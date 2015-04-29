# PDF/SVG support for p5.js

Time-stamp: \<2015-04-29 11:35:05 Zeno Zeng\>

Revision: 1 (Draft)

## Part 1 - SVG Support for p5.js

### Frist of all, why SVG?

- Resolution Independence

- Tool chains!

    SVG works with Adobe Illustrator and Inkscape.
    It would be wonderful if designers can easily export their p5.js to SVG,
    and continue their work using SVG.
    Also, it would be great if p5.js can import SVG,
    because many resources are in SVG.

- Accessibility

    Different from canvas, SVGs are accessible.
    That is, the text can be selected, easily copied and used for TTS.

- Object Based Events

    Want to bind click events on a custom shape? Use SVG!
    SVG's API are born to be object based!

- Filters!

    Now that SVGs are object based,
    we can apply filters on object. (use blur, for example)

### Example Usage

#### In Canvas

```javascript
function setup() {
    createCanvas(width, height);
}
```

```javascript
var myshape;
function preload() {
    myshape = loadImage('myshape.svg');
}
```

```javascript
var x = 0,
    y = 0;
function draw() {
    background(0);
    shapeMode(CORNERS);
    shape(myshape, x, y, w, h); // draw svg on current canvas
    x++;
    y++;
}
```

#### In SVG

After long time of consideration,
I think that maybe a custom API for SVG is better.
It won't confuse our users and the expression `new Object` really means creating an object.
An object is like a mover in `The Nature of Code`.

```javascript
var svg;
function setup() {
    svg = createSVG(width, height); // enter SVG mode
}
```

```javascript
var myshape;
function preload() {
    myshape = loadImage('myshape.svg');
}
```

```javascript
var s,
    x = 0,
    y = 0;
function draw() {
    if (!s) {
        // insert svg on current svg
        shapeMode(CORNERS);
        // note that when in canvas mode this will throw an exception
        s = new Shape(myshape, x, y, w, h);
        // s.shapeMode now is CORNERS
    } else {
        // Note that s.x is defined via Object.defineProperty with setter overridden
        // So, when s.x updated, the position of s will follow the change
        // See also: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty
        // If this API is too aggressive, then maybe something like `s.set('x', x)` or `s.x = x; s.update()` ?
        s.x = x;
        s.y = y;
    }
    x++;
    y++;
}
```

### API Outline

#### OOP API

- shapeMode

- shape(svg, x, y, w, h)

    Draw a SVG to current canvas.

- new Shape(svg, x, y, w, h)

    Draw a SVG to current SVG.

- new Shape(img, x, y, w, h)

    Draw a given image to current SVG.

- Basic shapes in p5.js

```javascript
function setup () {
    ellipse = new Ellipse(x, y, w, h);
}
```

```javascript
function draw () {
    ellipse.width++;
    ellipse.update();
}
```

- shape.x

- shape.y

- shape.filter

    Set a filter for this object. Should allow SVG filters and provide some simple filters.

    See also: https://developer.mozilla.org/en-US/docs/Web/CSS/filter

    ```javascript
    var r = 0,
        ellipse;
    function setup () {
        ellipse = new Ellipse(x, y, w, h);
    }
    function draw () {
        var myfilter = new SVG.Filter.Blur('5px');
        ellipse.filter = myfilter;
    }
    ```

#### Manipulate SVG (low-level API)

Like p5.dom's API, but more for SVG.

- SVG.createElement

- SVG.createGroup

    For svg's \<g\>

- SVG.createRect and other basic shapes

    See also: http://www.w3.org/TR/SVG/shapes.html

- SVG.SVGElement.prototype.attr

- SVG.SVGElement.prototype.style

- Some other methods p5.Element provides

#### Export

- toDataURL

```javascript
var svg;
function setup() {
    svg = createSVG(width, height);
}
```

```javascript
function draw() {
    if (some condition) {
        // draw something
    } else {
        noLoop();
        var dataURL = svg.toDataURL();
    }
}
```

### FAQ

#### Why not PShape?

I think that PShape is somehow not that natural for SVG.
SVG is something more DOM-like.
So, the manipulation of SVG should have a DOM-like api.

Also, I think in SVG's world, we should treat shapes as object.
Thus, an OOP api was designed.

#### Performance Issue

I have tested the performance of svg using a demo drawing many circles (a very edge case).
http://zenozeng.github.io/gsoc2015/p5.js/svg-test/

Though the fps is always about 60,
the circles drawn per second varies when circle count increases.
(Tested on my laptop, Intel(R) Core(TM) i5-2450M CPU @ 2.50GHz)
At the very beginning (before drawing 550 circles), about 40+ circles can be drawn per second.
However, when there are already 1000 circles in svg, only 20+ circles can be drawn per second.
When it comes to 20000 circles, only about 1 circle can be drawn per second.
See also: http://zenozeng.github.io/gsoc2015/p5.js/svg-test/svg.log

The performance is not good, but not so bad.
However, performance can be improved in the following ways:

- GC invisible elements
    For instance, remove all nodes when `background()` called.

- provide an API in SVG's manner (already talked above)

    That is, move an existing object rather than draw another new object.
    A OOP API for this, for example.

## Part 2 - PDF support for p5.js

This will be based on my current [p5.js-pdf](https://github.com/zenozeng/p5.js-pdf).

As for PDF, I think allowing exporting to PDF is enough.

And the future plan is:

- PDF.prototype.beginRecord

- PDF.prototype.endRecord

- Allow using ratio of canvas as PDF ratio

- Allow frames to overlay each other

- Vector Support (for Canvas)

    Using canvas to SVG.

- Vector Support (for SVG)

    Maybe using svgToPdf.js and jsPDF.

## Part 3 - About me

I am a junior student of Biosystems Engineering, Zhejiang University.
And I have 3 years of web development experience (both frontend and backend).

Also, I have some experience with SVG, D3 and processing.
I am very active on [github](https://github.com/zenozeng) and would like to contribute to p5.js and extend its possibility for today's web. I really love the goal of p5.js, that is, to make coding accessible for artists, designers, educators, and beginners.

## Part 4 - Links

- [Project List](https://github.com/processing/processing/wiki/Project-List)

- [Dealing with SVGs](https://github.com/processing/p5.js/issues/458)

- [Load and Display SVG in processing](https://www.processing.org/examples/loaddisplaysvg.html)

- https://www.mapbox.com/osmdev/2012/11/20/getting-serious-about-svg/

- http://code.tutsplus.com/articles/why-arent-you-using-svg--net-25414

- [Adding SVG support to processing-js](https://annasob.wordpress.com/2010/07/20/adding-svg-support-to-processing-js/)

- http://snapsvg.io/start/

- [Processing - PShape](https://www.processing.org/reference/PShape.html)
