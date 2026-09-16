---
title: I drew this with mathematical equations
author: ["admin"]
date: '2025-02-10'
slug: voronoi stippling
categories: [Generative Art, Shader]
tags: []
# type: book
image:
  caption: ''
  focal_point: ''
summary: 'Implementation of Realtime Voronoi Stippling'
subtitle: 'Implementing Realtime Voronoi Stippling Using WebGL'
smartDashes: true
---

<style>
  .stipple-viewer { position: relative; aspect-ratio: 5 / 3; border: 2px solid #ed8e22; }
  .stipple-fps { position: absolute; top: 4px; left: 4px; padding: 1px 4px; border-radius: 3px; font: 11px/1.2 ui-monospace, Consolas, monospace; color: #fff; background: rgba(0, 0, 0, 0.5); pointer-events: none; }
  .stipple-viewer canvas { display: block; width: 100%; height: 100%; }
  .stipple-bar { margin-top: 0.5rem; display: flex; flex-wrap: wrap; gap: 0.5rem; align-items: center; }
  #stipple-status { flex: 1 1 12rem; min-width: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .stipple-settings { display: grid; grid-template-columns: repeat(auto-fit, minmax(14rem, 1fr)); gap: 0.5rem 1.5rem; align-items: end; margin-top: 0.5rem; }
  .stipple-settings label { display: flex; flex-wrap: wrap; justify-content: space-between; margin: 0; font-size: 0.9rem; }
  .stipple-settings input[type=range] { width: 100%; }
  .stipple-settings output { font-variant-numeric: tabular-nums; opacity: 0.7; }
  .stipple-settings .stipple-check { justify-content: flex-start; gap: 0.4rem; align-items: center; }
</style>
<div class="stipple-demo">
  <div class="stipple-viewer"><canvas id="stipple-canvas"></canvas><span id="stipple-fps" class="stipple-fps" aria-hidden="true">– fps</span></div>
  <img id="stipple-default" src="/img/terrain_blend_2.png" alt="" hidden>
  <input id="stipple-upload" type="file" accept="image/*,video/*" hidden>
  <div class="stipple-bar">
    <button id="stipple-upload-btn" type="button" class="btn btn-sm btn-outline-primary">Upload photo or video</button>
    <button id="stipple-camera" type="button" class="btn btn-sm btn-outline-primary">Use camera</button>
    <button id="stipple-pause" type="button" class="btn btn-sm btn-outline-primary" disabled>Pause</button>
    <button id="stipple-download" type="button" class="btn btn-sm btn-outline-primary">Download image</button>
    <small id="stipple-status" class="text-muted" role="status">Photos and videos are processed on device and not uploaded elsewhere.</small>
  </div>
  <details>
    <summary>Settings</summary>
    <div id="stipple-settings" class="stipple-settings"></div>
  </details>
</div>
<script src="/js/voronoi-stipple.js"></script>

