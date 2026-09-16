// Realtime Voronoi stippling — Shadertoy port (https://www.shadertoy.com/view/Wcf3Wr).
// Source is an uploaded photo/video or, only when the visitor opts in, their camera.
(() => {
  const $ = id => document.getElementById(id);
  const canvas = $('stipple-canvas');
  const status = $('stipple-status');
  const fileInput = $('stipple-upload');
  const camBtn = $('stipple-camera');
  const pauseBtn = $('stipple-pause');
  const downloadBtn = $('stipple-download');
  const settingsEl = $('stipple-settings');
  const defaultImg = $('stipple-default');
  const fpsEl = $('stipple-fps');

  const DEFAULT_STATUS = 'Photos, videos and camera stay on your device.';

  const gl = canvas.getContext('webgl2');
  if (!gl) {
    status.textContent = 'Your browser does not support WebGL2, so the shader cannot run.';
    return;
  }

  // Shadertoy's #defines, now live controls. `uniform` is the GLSL name it drives.
  const SETTINGS = [
    { uniform: 'uGridSize',     label: 'Grid size',           min: 10,    max: 150,  step: 1,      value: 50 },
    { uniform: 'uMaxPoints',    label: 'Max points per cell', min: 1,     max: 8,    step: 1,      value: 4, int: true },
    { uniform: 'uLumaWeight',   label: 'Brightness weight',   min: 0,     max: 2,    step: 0.05,   value: 0.45 },
    { uniform: 'uDetailWeight', label: 'Detail weight',       min: 0,     max: 4,    step: 0.05,   value: 1.6 },
    { uniform: 'uPointSize',    label: 'Point size',          min: 0.001, max: 0.01, step: 0.0005, value: 0.004 },
    { uniform: 'uShowPoints',   label: 'Show points',         checkbox: true,                      value: false },
  ];

  const VERT = `#version 300 es
in vec2 p;
void main() { gl_Position = vec4(p, 0.0, 1.0); }`;

  // Same algorithm as the Shadertoy version, but it works in image UV rather than
  // canvas UV, so the viewer can letterbox while downloads render the image unpadded.
  const FRAG = `#version 300 es
precision highp float;
uniform vec3 iResolution;
uniform sampler2D iChannel0;
uniform vec4 uView;       // canvas UV -> image UV: xy scale, zw offset
uniform float uAspect;    // image width / height
uniform bool uMirror;
uniform float uGridSize;
uniform int uMaxPoints;
uniform float uLumaWeight;
uniform float uDetailWeight;
uniform bool uShowPoints;
uniform float uPointSize;
out vec4 outColor;

vec2 hash22(vec2 p) {
    vec3 p3 = fract(p.xyx * vec3(0.1031, 0.1030, 0.0973));
    p3 += dot(p3, p3.yzx + 33.33);
    return fract((p3.xx + p3.yz) * p3.zy);
}

float cellDensity(vec2 cellUV) {
    float r = 0.35 / uGridSize;
    vec3 c  = textureLod(iChannel0, cellUV, 0.0).rgb;
    vec3 a  = textureLod(iChannel0, cellUV + vec2( r,  r), 0.0).rgb;
    vec3 b  = textureLod(iChannel0, cellUV + vec2(-r,  r), 0.0).rgb;
    vec3 cc = textureLod(iChannel0, cellUV + vec2( r, -r), 0.0).rgb;
    vec3 d  = textureLod(iChannel0, cellUV + vec2(-r, -r), 0.0).rgb;

    vec3 mn = min(min(a, b), min(cc, d));
    vec3 mx = max(max(a, b), max(cc, d));

    float luma    = dot(c, vec3(0.2126, 0.7152, 0.0722));
    float detail  = length(mx - mn);

    return clamp(uLumaWeight * luma + uDetailWeight * detail, 0.0, 1.0);
}

void mainImage(out vec4 fragColor, in vec2 fragCoord) {
    vec2 uv = (fragCoord / iResolution.xy - uView.zw) / uView.xy;
    if (any(lessThan(uv, vec2(0.0))) || any(greaterThan(uv, vec2(1.0)))) {
        fragColor = vec4(0.0); // letterbox: transparent
        return;
    }
    if (uMirror) uv.x = 1.0 - uv.x;

    vec2 aspect = vec2(uAspect, 1.0);
    vec2 cell = floor(uv * uGridSize);

    float minDist = 1e5;
    vec2  closest = uv;

    for (int di = -1; di <= 1; di++)
    for (int dj = -1; dj <= 1; dj++) {
        vec2 nCell = cell + vec2(float(di), float(dj));

        if (any(lessThan(nCell, vec2(0.0))) ||
            any(greaterThan(nCell, vec2(uGridSize - 1.0)))) continue;

        vec2  cellUV    = (nCell + 0.5) / uGridSize;
        float density   = cellDensity(cellUV);
        float numPoints = 1.0 + floor(density * float(uMaxPoints - 1));

        for (int k = 0; k < uMaxPoints; k++) {
            if (float(k) >= numPoints) break;

            vec2 off      = hash22(nCell + vec2(37.13, 71.7) * float(k));
            vec2 pointPos = (nCell + off) / uGridSize;

            float dist = distance(uv * aspect, pointPos * aspect);
            if (dist < minDist) {
                minDist = dist;
                closest = pointPos;
            }
        }
    }

    vec4 color = textureLod(iChannel0, closest, 0.0);
    if (uShowPoints && minDist < uPointSize) color = vec4(0.0, 0.0, 0.0, 1.0);

    fragColor = color;
}

void main() { mainImage(outColor, gl_FragCoord.xy); }`;

  function compile(type, src) {
    const s = gl.createShader(type);
    gl.shaderSource(s, src);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s));
    return s;
  }

  const prog = gl.createProgram();
  gl.attachShader(prog, compile(gl.VERTEX_SHADER, VERT));
  gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FRAG));
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(prog));
  gl.useProgram(prog);
  const u = name => gl.getUniformLocation(prog, name);

  // One triangle that covers the whole viewport.
  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(prog, 'p');
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

  gl.bindTexture(gl.TEXTURE_2D, gl.createTexture());
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true); // Shadertoy textures are bottom-up

  // Photos are downscaled to this; it is also the download resolution for photos.
  const MAX_PHOTO = 2048;

  let source = null, srcW = 1, srcH = 1;
  let frames = 0, fpsSince = performance.now(); // viewer draws, for the fps counter
  let photo = null;   // last photo, shown again when a video or the camera stops
  let mode = 'photo'; // 'photo' | 'video' | 'camera'

  // --- Settings panel ---
  const values = {};
  function applySettings() {
    for (const s of SETTINGS) {
      if (s.checkbox) gl.uniform1i(u(s.uniform), values[s.uniform] ? 1 : 0);
      else if (s.int) gl.uniform1i(u(s.uniform), values[s.uniform]);
      else gl.uniform1f(u(s.uniform), values[s.uniform]);
    }
  }

  settingsEl.innerHTML = SETTINGS.map(s => s.checkbox
    ? `<label class="stipple-check"><input type="checkbox" data-u="${s.uniform}"> ${s.label}</label>`
    : `<label>${s.label} <output></output>
         <input type="range" data-u="${s.uniform}" min="${s.min}" max="${s.max}" step="${s.step}"></label>`
  ).join('') + '<button type="button" class="btn btn-sm btn-outline-secondary" data-reset>Reset</button>';

  function setControl(s, value) {
    const input = settingsEl.querySelector(`[data-u="${s.uniform}"]`);
    values[s.uniform] = value;
    if (s.checkbox) input.checked = value;
    else {
      input.value = value;
      input.previousElementSibling.textContent = value;
    }
  }

  settingsEl.addEventListener('input', e => {
    const s = SETTINGS.find(s => s.uniform === e.target.dataset.u);
    if (!s) return;
    setControl(s, s.checkbox ? e.target.checked : Number(e.target.value));
    applySettings();
    render();
  });
  settingsEl.querySelector('[data-reset]').addEventListener('click', () => {
    SETTINGS.forEach(s => setControl(s, s.value));
    applySettings();
    render();
  });
  SETTINGS.forEach(s => setControl(s, s.value));
  applySettings();

  // --- Rendering ---
  function uploadFrame() {
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, source);
  }

  // Draws into the current drawing buffer. `fill` renders the image edge to edge (for downloads);
  // otherwise it is letterboxed to fit the fixed-size viewer.
  function render(fill = false) {
    if (!source) return;
    const W = canvas.width, H = canvas.height;
    let sx = 1, sy = 1;
    if (!fill) {
      const r = (srcW / srcH) / (W / H);
      if (r > 1) sy = 1 / r; else sx = r;
    }
    gl.viewport(0, 0, W, H);
    gl.uniform3f(u('iResolution'), W, H, 1);
    gl.uniform4f(u('uView'), sx, sy, (1 - sx) / 2, (1 - sy) / 2);
    gl.uniform1f(u('uAspect'), srcW / srcH);
    gl.uniform1i(u('uMirror'), mode === 'camera' ? 1 : 0);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    if (!fill) frames++;
  }

  // Drawing buffer follows the viewer's CSS size; the viewer's size never depends on the source.
  function fitCanvas() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(canvas.clientWidth * dpr);
    canvas.height = Math.round(canvas.clientHeight * dpr);
  }

  function setSource(src, w, h, newMode) {
    source = src;
    srcW = w;
    srcH = h;
    mode = newMode;
    pauseBtn.disabled = mode !== 'video'; // disabled, not hidden, so the button row never reflows
    pauseBtn.textContent = 'Pause';
    camBtn.textContent = mode === 'camera' ? 'Stop camera' : 'Use camera';
    uploadFrame();
    render();
  }

  // --- Photos ---
  function showPhoto(img) {
    const scale = Math.min(1, MAX_PHOTO / Math.max(img.naturalWidth, img.naturalHeight));
    const c = document.createElement('canvas');
    c.width = Math.round(img.naturalWidth * scale);
    c.height = Math.round(img.naturalHeight * scale);
    c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
    stopVideo();
    photo = c;
    setSource(c, c.width, c.height, 'photo');
  }

  function showLastPhoto() {
    if (photo) setSource(photo, photo.width, photo.height, 'photo');
  }

  // --- Video (uploaded file or camera share one element) ---
  const video = document.createElement('video');
  video.muted = true;
  video.playsInline = true;
  video.loop = true;
  let stream = null;

  // Video frames (file or camera) are uploaded as they play; photos only once.
  (function loop() {
    if (source === video && !video.paused && video.readyState >= video.HAVE_CURRENT_DATA) {
      uploadFrame();
      render();
    }
    const now = performance.now();
    if (now - fpsSince >= 500) {
      // Photos only redraw on changes, so an idle viewer shows a dash rather than 0.
      fpsEl.textContent = (frames ? Math.round(frames * 1000 / (now - fpsSince)) : '–') + ' fps';
      frames = 0;
      fpsSince = now;
    }
    requestAnimationFrame(loop);
  })();

  function stopVideo() {
    video.pause();
    if (stream) stream.getTracks().forEach(t => t.stop());
    stream = null;
    video.srcObject = null;
    if (video.src) {
      URL.revokeObjectURL(video.src);
      video.removeAttribute('src');
      video.load();
    }
    status.textContent = DEFAULT_STATUS;
  }

  async function showVideoFile(file) {
    stopVideo();
    video.src = URL.createObjectURL(file);
    try {
      await video.play();
    } catch (e) {
      stopVideo();
      status.textContent = 'That video could not be played in this browser.';
      showLastPhoto();
      return;
    }
    setSource(video, video.videoWidth, video.videoHeight, 'video');
  }

  async function startCamera() {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      status.textContent = 'Camera access is not available in this browser.';
      return;
    }
    camBtn.disabled = true; // a second click while the permission prompt is open would open a second stream
    try {
      stopVideo();
      stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
      video.srcObject = stream;
      await video.play();
    } catch (e) {
      stopVideo();
      status.textContent = 'Could not start the camera: ' + e.message;
      showLastPhoto();
      return;
    } finally {
      camBtn.disabled = false;
    }
    setSource(video, video.videoWidth, video.videoHeight, 'camera');
    status.textContent = 'Camera is on. Video never leaves your device.';
  }

  // --- Controls ---
  camBtn.addEventListener('click', () => {
    if (mode !== 'camera') return startCamera();
    stopVideo();
    showLastPhoto();
  });

  pauseBtn.addEventListener('click', () => {
    if (video.paused) video.play(); else video.pause();
    pauseBtn.textContent = video.paused ? 'Play' : 'Pause';
  });

  $('stipple-upload-btn').addEventListener('click', () => fileInput.click());
  fileInput.addEventListener('change', () => {
    const file = fileInput.files[0];
    fileInput.value = ''; // allow re-selecting the same file
    if (!file) return;
    if (file.type.startsWith('video/')) return showVideoFile(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(img.src);
      showPhoto(img);
    };
    img.onerror = () => { status.textContent = 'That file could not be read as an image or video.'; };
    img.src = URL.createObjectURL(file);
  });

  // Re-render at the source's own size and aspect, grab it, then restore the viewer.
  // toBlob snapshots the buffer synchronously, so the viewer never shows the resized frame.
  downloadBtn.addEventListener('click', () => {
    if (!source) return;
    canvas.width = srcW;
    canvas.height = srcH;
    render(true);
    canvas.toBlob(blob => {
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'voronoi-stipple.png';
      a.click();
      setTimeout(() => URL.revokeObjectURL(a.href), 1000);
    }, 'image/png');
    fitCanvas();
    render();
  });

  window.addEventListener('resize', () => {
    fitCanvas();
    render();
  });

  fitCanvas();
  if (defaultImg.complete && defaultImg.naturalWidth) showPhoto(defaultImg);
  else defaultImg.addEventListener('load', () => showPhoto(defaultImg));
})();
