# Getting started with p5.SVG

This page will help you setting up a p5.js project with p5.SVG and making your first sketch.

## Download and File Setup

p5.SVG@0.4 requires p5.js@0.4.7 with [patch#850](https://github.com/processing/p5.js/pull/850).
You can download it here:

https://github.com/zenozeng/p5.js-svg/blob/a18ee413ce15ca6df3dbd3758f40a16606853572/test/bower_components/p5.js/p5.js

And p5.SVG@0.4 can be downloaded here:

https://github.com/zenozeng/p5.js-svg/releases

Then you can simple put them in your \<head\>.

```html
<script src="./path-to/p5.js"></script>
<script src="./path-to/p5.svg.js"></script>
```

### AMD and Browserify

If you are using AMD, then you can:

```javascript
define(function(require) {
    require('p5.svg');
    // your code here
});
```

If you are using browserify, then you can:

```bash
npm install p5.js-svg --save
```

```javascript
var p5 = require('./p5.js');
require('p5.js-svg')(p5);
```

## Your First Sketch

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

![SVG Gettting Started](./svg-getting-started.png)

## What's Next?

- Check out the [examples](http://zenozeng.github.io/p5.js-svg/examples/).

- View the [API Reference](http://zenozeng.github.io/p5.js-svg/doc/reference/index.html) for full documentation.
