---
title: Random Crawlers
author: ["admin"]
date: '2025-06-11'
slug: Random Crawlers
categories: [Generative Art, Procedural]
tags: []
# type: book
image:
  caption: ''
  focal_point: ''
summary: 'Creating random crawlers using multi-pendulums'
subtitle: 'Using multi-pendulums'
smartDashes: true
---
### Introducing Random Crawlers
<div style="position: relative; width: 100%; padding-bottom: 60%; height: 0;border: 2px solid #ED225D;">
  <iframe src="https://editor.p5js.org/TahsinTariq/full/YDUOeuZwo"
          style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: none;"
          allowfullscreen>
  </iframe>
</div>

<!-- {{% callout controls %}}
Controls:
- **i** - Toggle trajectory
- **p** - Toggle pendulums
- **l** - Toogle pendulum joints
- **u** - Toggle crawlers
- **o** - Toggle attachment points
{{% /callout %}} -->


{{% callout controls %}}
Controls:
<div class="two-column-list">
<ul>
  <li><strong>i</strong> - Toggle trajectory</li>
  <li><strong>p</strong> - Toggle pendulums</li>
  <li><strong>l</strong> - Toggle pendulum joints</li>
  <li><strong>u</strong> - Toggle crawlers</li>
  <li><strong>o</strong> - Toggle attachment points</li>
  <!-- <ul>If the buttons are not working, click on the canvas and try again.</ul> -->
</ul>
</div>
{{% /callout %}}

### What is it?

A random crawlers as I call it is a set of very simple rules that can simulate natural looking movement. But even though the underlying mechanism is simple, the results are anything but. The name `random crawlers` is a reference to one of my favorite processes in mathematics, the [`Random Walk`](https://en.wikipedia.org/wiki/Random_walk) algorithm. This simple process links several fields of modern technology including  computer graphics, game dev, physics, fluid simulation and even social sciences. But I find it quite fascinating how linking one stochastic process to another completely seemingly unrelated thing can result in beautiful visualizations.

### How does it work?

This is a piece I've worked on for quite a while. it's essentially a set of chained rotating arms connected end to end. Each have their own length and rotational speed. At the end of the chain is anchored a crawler agent that simply connects to nearby points and therefore, the anchor and the connecting lines make it seem like crawlers. The end of the chains form what is known as an [epicycle](https://en.wikipedia.org/wiki/Deferent_and_epicycle). Since the initialization for the chains are random every step, the generated curve also varies drastically and is extremely sensitive to initial conditions. However, unlike a multi-pendulum system, this is not chaotic, rather deterministic. This gives us the added benefit of parameterizing the model so we don't depend on the previous step of the simulation to predict the next. The tip position is a closed-form function of time.

Link $i$ has length $L_i$, an initial angle $\varphi_i$, and an angular velocity $\omega_i$, so its angle at time $t$ is simply $\varphi_i + \omega_i t$. Summing the contributions down a chain of $N$ links from a pivot at $(x_0, y_0)$:

$$ x(t) = x_0 + \sum_{i=1}^{N} L_i \sin(\varphi_i + \omega_i t) $$

$$ y(t) = y_0 + \sum_{i=1}^{N} L_i \cos(\varphi_i + \omega_i t) $$

Or, treating the plane as the complex plane, which is much tidier:

$$ z(t) = z_0 + \sum_{i=1}^{N} L_i e^{i(\varphi_i + \omega_i t)} $$


With this parameterizion, we can now predict the state of the chain at any point in time and even look ahead many many steps in the future. Simulating the entire thing by stepping through frames of the sketch is really slow and dependent on the hardware capability of the machine it's running on. This parameterizion actually fixes the issue as it is no longer dependent on the framerate.

The random points around the crawler anchor is generated using poisson disk sampling. Pure random (or even pseudo random) numbers have a tendency to cluster together, a phenomenon know as poisson clumping. Poisson disk sampling gives a uniform look to the randomly scattered points.


<!-- TODO: #### Fourier Analysis on the Pendulum movement -->

#### Motivation
<!-- : Forms and Behavior  -->

This was largely inspired from the work `Process Compendium` by Casey Reas. There he describes how a simple set of elements and interaction processes can lead to complex forms and behaviours. For Random Crawlers, this can be described simply as follows:

> **Element 1.** A point that moves along the sum of $N$ circular motions.
>
> **Element 2.** Stationary points distributed uniformly along the plane.
>
> **Process.** Draw a line from each Element 1 to every Element 2 within distance $d$.
