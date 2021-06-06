# p5.js-svg

The main goal of p5.SVG is to provide a SVG runtime for p5.js,
so that we can draw using p5's powerful API in \<svg\>, save things to svg file
and manipulating existing SVG file without rasterization.

## Getting Started

```html
<script src="https://unpkg.com/p5@1.3.1/lib/p5.js"></script>
<script src="https://unpkg.com/p5.js-svg@1.0.5"></script>
```

Open your sketch.js and edit it:

```javascript
function setup() {
    createCanvas(100, 100, SVG);
    background(255);
    fill(150);
    stroke(150);
}

function draw() {
    var r = frameCount % 200 * Math.sqrt(2);
    background(255);
    ellipse(0, 0, r, r);
}
```

Then you can open your html file, and view the result.
It's \<svg\>!

![SVG Gettting Started](./doc/svg-getting-started.png)

## Examples

http://zenozeng.github.io/p5.js-svg/examples/

## SVG Renderer vs Canvas2D Renderer

The major difference is that SVG Renderer is based on SVG Document Object Model
while Canvas 2D Renderer is based on pixels.
Therefore, the performance may not be as good as canvas, but SVG-format vector images can be rendered at any size without loss of quality.

Note that not all drawing results are exactly same in pixel-level.For example, the round rects below are almost same, but there are some pixels different.

![round rect](doc/round-rect.png)

As for filters, gray(), invert(), threshold(), opaque() did have same behavior as Canvas2D Renderer. But blur(), erode(), dilate() didn't.

To implement blur, feGaussianBlur was used, which is different from Processing's blur.
![blur](doc/blur.png)

As for erode() and dilate(), they were implemnted using feOffset and feBlend. So, the result is not exactly same.
![erode](doc/erode.png)

You can view all the pixels based diff on the [online tests](http://zenozeng.github.io/p5.js-svg/test/).

## Browser Compatibility

p5.js-svg@1.x was tested and should work on:

- Chromium 90 (Debian 11.0, LXQt 0.16)
- Safari (iPadOS 14)

## How it works

p5.RendererSVG is a class which extends p5.Renderer2D.
I create a mock \<canvas\> element,
which is JavaScript Object that syncs proprieties to \<svg\>.
A drawing context is provided,
it provides most canvas's API but will draw them on \<svg\> element.

## Known issue

- blendMode is not implemented yet.

## Tests

p5.SVG was driven by tests.
We use Karma and mocha.
Most tests are based on pixel-diff.
There are still some p5's methods not covered with unit tests.
But Rendering and Shape API are already covered with tests and should work.

If you found a bug, feel free to open a issue or pull a request.

All tests can be found here:
https://github.com/zenozeng/p5.js-svg/tree/master/test/unit

You can also run the online test yourself:
https://zenozeng.github.io/p5.js-svg/test/

And this is our coverage report:
https://coveralls.io/github/zenozeng/p5.js-svg?branch=master
