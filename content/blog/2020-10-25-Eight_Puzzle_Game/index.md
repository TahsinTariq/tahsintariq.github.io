---
title: Eight-Puzzle Game
author: ["admin"]
date: '2020-10-25'
# slug: Eight-Puzzle Game
categories: []
tags: []
image:
  caption: ''
  focal_point: ''
summary: 'A JavaScript implementation of the 8-puzzle game with a built-in AI solver'
# subtitle: 'Details.'
smartDashes: true
---

This is a JavaScript implementation of the classic 8-puzzle game. I've also built in an AI to solve the puzzle if you are stuck.

### Features
* Uses the A* algorithm to find the shortest way to solve the puzzle
* You can choose any image to show in the tiles. It will replace the numbers though.
* The blank tile can also be controlled using hand gestures. It was trained using supervised learning on a set of over 5000 photos.


### Controls
<div style="display:flex">
    <div style="flex:1;padding:0 1% 0 0">
        <h1>
            <div ALIGN=Center>
                ↑
            </div>
            <div ALIGN=Center>
                ←  ↓  →
            </div>
        </h1>
        <!-- <h3> -->
            <div ALIGN=Center>
                Arrow keys
            </div>
        <!-- </h3> -->
    </div>
    <div style="flex:1;padding:0 1% 0 0">
        <h1>
            <div ALIGN=Center>
                ✋
            </div>
            <div ALIGN=Center>
                👈 👇 👉
            </div>
        </h1>
        <!-- <h3> -->
            <div ALIGN=Center>
                Hand Gestures (using camera)
            </div>
        <!-- </h3> -->
    </div>
    <div style="flex:1;padding:0 1% 0 0">
        <h1>
            <div ALIGN=Center>
                W
            </div>
            <div ALIGN=Center>
                A  S  D
            </div>
        </h1>
        <!-- <h3> -->
            <div ALIGN=Center>
                Keyboard keys
            </div>
        <!-- </h3> -->
    </div>
</div>


<style>
	*.videoWrapper {
		position: relative;
		padding-bottom: 56.25%; /* 16:9 */
		height: 0;
	}
	*.videoWrapper iframe {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
	}
    *.grid{
        display: grid;
        place-items:center;
        width: 100%;
    }
</style>
### Game
<style> iframe{ border: none; } </style>
<div class="videoWrapper" style="--aspect-ratio: 3 / 4;">
    <iframe 
        src="https://tahsintariq.github.io/p5js/P5_Sketches/P5_Web_Collection/EightPuzzle"
        data-position="center center">
    </iframe>
</div>

<!-- <div class="videoWrapper" style="--aspect-ratio: 3 / 4;">
    <iframe 
        src="https://tahsintariq.github.io/p5js/P5_Sketches/P5_Web_Collection/EightPuzzle"
        data-position="center center">
    </iframe>
</div> -->

### Code
Here's the code for A* path finding algorithm that solves the puzzle:
<!-- {{% callout note %}}
A Markdown callout is useful for displaying notices, hints, or definitions to your readers.
{{% /callout %}} -->
<!-- <style>
    @import url('https://cdn.rawgit.com/lonekorean/gist-syntax-themes/848d6580/stylesheets/monokai.css');
    @import url('https://fonts.googleapis.com/css?family=Open+Sans');
  /* .gist-file */
  /* .gist-data {max-height: 700px; max-width: auto;} */
  .gistContainer {width: 75%; margin: 0 auto;}
</style> -->

<!-- <div class = "gistContainer">
<script src="https://gist.github.com/TahsinTariq/5c4ba6b74dd1279f6d4bcfea6a3cbefd.js"></script>
</div> -->

<!-- <script src="https://gist.github.com/TahsinTariq/5c4ba6b74dd1279f6d4bcfea6a3cbefd.js"></script> -->

```js
function AStar(v1, v2){
	function route(v1, v2){
	    if (parents[v2] != 'NONE'){route(v1, parents[v2])}
		path.push(v2)
        }
    parents = {}
    searched = []
    fcost = {}
    queue = {}

    parents[v1] = "NONE"
    gcost[v1] = 0
    fcost[v1] = h(v1)
    queue[v1] = fcost[v1]

    while (queue.length != 0){
        x = sortProperties(queue);
        node = x[0][0];
        delete queue[node];
        searched.push(node);
        if (node == v2){
            try{print("found");
                route(v1, v2);}
            catch{print('No path exists');}
            return 0;
        }
        hash_ = generatechild(node);
        for(let[n, c] of Object.entries(hash_)){
            if (c + gcost[node] < gcost[n]){
            	if (searched.includes(n)){continue;}
            	else{
                    gcost[n] = c + gcost[node];
                    fcost[n] = (gcost[n] + h(n));
                    parents[n] = node;
                    if (!queue.hasOwnProperty(n)){queue[n] = fcost[n]}
                }
            }
        }
    }
    print('NO path Found')
}
```

<!-- {{< gallery album="artworks" >}} -->
