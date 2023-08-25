---
date: "2016-04-27T00:00:00Z"
external_link: ""
#image:
#  caption: Photo by rawpixel on Unsplash
#  focal_point: Smart
#links:
#- icon: twitter
#  icon_pack: fab
#  name: Follow
#  url: https://twitter.com/Gravellesimon
# slides: example
summary: project
tags:
- aaaaaa
title: Game of life in Rust
url_code: ""
url_pdf: ""
url_slides: ""
url_video: ""
---


<div class="container-lg">
    <div class="col-lg-12">
    <h2 class="mt-5 text-left heading-color">Game of life in Rust and Webassembly</h2>
    <p class="text-left">This is an implementation of <a
        href="https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life">Conway's Game of Life</a>. Here I've used
        <a href="https://docs.rs/fixedbitset/0.4.0/fixedbitset/"><code>fixedbitset</code></a> to minimize data
        transfer between javascript and webassembly.
    </p>
    </div>
</div>
<div class="container-lg">
    <div class="col-lg-12 ">
    <div class="mt-5">
        <!-- Dropdown HTML -->
        <select name="Render Resolution" id="rez">
        <option value="" selected="selected">Render Resolution</option>
        <option value="1k">1080p</option>
        <option value="2k">1620p</option>
        <option value="4k">2160p</option>
        </select>
        <!-- dropdown end -->
        <div class="text-right col" id="fps"></div>
        <canvas class="col" id="game-of-life"></canvas>
    </div>
    <div class="row px-4 g-2">
        <div class="row align-middle col-6 p-3">
        <div class="col-2 text-center">Speed</div>
        <div class="col">
            <input type="range" min="1" max="10" value="1" class="slider border col" id="range">
        </div>
        </div>
        <button class="p-3 col" id="play-pause"></button>
        <button class="p-3 col" id="reset">Reset</button>
        <button class="p-3 col" id="dead">Dead Cells</button>
    </div>
    <h2 class="mt-5 text-left heading-color">Controls</h2>
    <p class="text-left">
        Use the slider to control the speed of the game in steps per frame from 1 to 10.
    </p>
    <p class="text-left">
        Pause, reset the board or kill all the cells in the board with the buttons
    </p>
    <p class="text-left">
        If you're on a computer,
    <ul><code>CLICK</code> to toggle the state of a cell.</ul>
    <ul><code>CTRL+CLICK</code> to insert a <a
        href="https://en.wikipedia.org/wiki/Glider_(Conway%27s_Life)">Glider</a>.</ul>
    <ul><code>SHIFT+CLICK</code> to insert a <a href="https://www.conwaylife.com/wiki/Pulsar">Pulser</a>.</ul>
    <ul><code>CTRL+SHIFT+CLICK</code> to insert <a href="https://conwaylife.com/wiki/Gosper_glider_gun">Gosper's
        Glider Gun</a>.
    </ul>
    </p>
    </div>
</div>

