---
title: Procedural Terrain Generation
author: ["admin"]
date: '2020-04-15'
slug: Terrain generation
categories: []
tags: []
image:
  caption: ''
  focal_point: ''
summary: 'Generating 3D terrain surfaces using Poisson Disc Sampling'
subtitle: 'Using Poisson Disc Sampling'
smartDashes: true
---
### Introduction
Creating a terrain manually for a game or just for visualization purposes is a really daunting task. Instead, a better way to do so is to programmatically generate it by passing some parameters to a code. Here, I discuss how to make a procedural terrain generator mostly using processing for python. This can also be done in any other language or game engine or 3D design software. I will be making a simple terrain using height maps for stylized purposes. But, first we need to understand how to generate height maps using perlin noise. 

Perlin noise is a procedurally generated noise texture developed by ken perlin. How perlin noise is generated using code is discussed thoroughly **[here](https://rtouti.github.io/graphics/perlin-noise-algorithm)**. I'll be using the built in noise function that generates perlin noise for processing. 

### Generating sample points
In order to render the terrain, we need some geometry. We can generate tile the plane with cubes, but that would look more like minecraft. We could choose randomly generated points. But purely random or even pseudo-random choices have a tendency of clustering together. This phenomenon is known as [`Poisson Clumping`](https://en.wikipedia.org/wiki/Poisson_clumping). Pure or pseudo-random points are not good choices because of this phenomenon, as shown below.

<!-- ![Random points](/img/random.png) -->
{{< figure src="/img/random.png" caption="Generated random points tend to cluster together." numbered="true" >}}

So, instead we use a different sort of random point generation called **[`Poisson Disc Sampling`](https://en.wikipedia.org/wiki/Supersampling#Poisson_disk)**. This generates random points at a given interval and thus making them more uniform. This is a much better choice for generating terrains.

Now if we triangulate the points,We should get a plane with enough geometry to offset using the generated height map. I go into some details on triangulation [`here`](https://tahsintariq.github.io/triangulation). The final result should look something like this (without the animation of course):

<div class="videoWrapper">
    <iframe
        src="https://tahsintariq.github.io/p5js/P5_Sketches/P5_Web_Collection/Delunay_triangulation"
        data-position="center center">
    </iframe>
</div>

### Creating a rough 3D terrain
Now we rotate the canvas on the y-axis so it looks more like a plane.

<!-- ![Random Plane](/img/random_plane.png) -->
{{< figure src="/img/random_plane.png" caption="The entire plane rotated along the Y-axis to give it a 3D look" numbered="true" >}}

Now, using the generated height map, we offset the z-position of the points by the value corresponding to that x and y position in the height map. This gives us a stylized terrain.

<!-- ![Terrain](/img/terrain.png) -->
{{< figure src="/img/terrain.png" caption="A generated rough terrain" numbered="true" >}}

We can change the shape of this terrain by changing the noise using offsets. This can result in traversing through the terrain as if we were flying on top of it, or changing the entire topology of the terrain. It will depend on how the noise is being offset.

I've put the processing.py codes for this project [`here`](https://github.com/TahsinTariq/Processing/tree/master/Pycessing/Perlin/Terrain_generation).

### Smoother surfaces
The generated surface is still pretty low resolution and looks pointy. This can be solved in two ways. First, we can either increase the number of points from the poisson disk sampling process. The other method is using the [`Catmull-Clark algorithm`](https://en.wikipedia.org/wiki/Catmull%E2%80%93Clark_subdivision_surface). This is a technique used in 3D computer graphics to represent curved surfaces by the specification of a coarser polygonal mesh and produced by a recursive algorithmic method.

Furthermore, the same process can be used to generate terrain in 3D modelling  software. The Catmull-Clark algorithm can be used easily here as most software have built in support. The following demonstrates the improvements made while using the algorithm.


<div style="display:flex">
    <div style="flex:1;padding:0 1% 0 0">
       <img  src="/img/terrain_blend_1.png" alt="coarse" data-position="center center" />
    </div>
    <div style="flex:1;padding:0 1% 0 0">
       <img  src="/img/terrain_blend_2.png" alt="subdivided" data-position="center center" />
    </div>
</div>

<article class="grid" style="text-align: center;">
The left image shows a coarse pointy surface, the right image shows a smooth, curved, subdivided surface 
and below is an animated terrain made in Blender 3D
</article>

<video controls loop autoplay>
  <source src="/img/terrain_vid.mp4">
</video> 

### Example videos
Below are two different renders I've made using the processing.py. One with a half inverted render and the other colored according to the height of the points i.e. a topological height map.

<style>
	*.videoWrapper {
		position: relative;
		width:100%;
		padding-bottom: 56.25%; /* 16:9 */
		height: 0;
	}
	video{
		display:grid;
		margin: auto;
		width:90%;
		height:90%;
	}
	*.videoWrapper iframe{
		position: absolute;
		margin:auto;
		top: 0; bottom: 0;
		left: 0; right: 0;
		text-align: center;
		width: 90%;
		height: 90%;
	}
	*.grid{
	display: grid;
	place-items:center;
	/* width: 100%; */
    }
</style>

<style> iframe{ border: none; } </style>
<div class="videoWrapper">
    <iframe src="https://www.youtube.com/embed/kLhleR4t7LQ" data-position="center center">
    </iframe>
</div>
<div class="videoWrapper">
    <iframe src="https://www.youtube.com/embed/-vS37cZq3B8" data-position="center center">
    </iframe>
</div>
<!-- "https://www.youtube.com/embed/kLhleR4t7LQ"  -->
<!-- "https://www.youtube.com/embed/-vS37cZq3B8" -->
