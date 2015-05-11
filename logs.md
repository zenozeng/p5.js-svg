# Log

## 2015-04-28 -- 2015-05-10

- API Design

- Read documentation

    - p5's API

    - p5.dom's API and Source Code

    - [canvas2svg](http://gliffy.github.io/canvas2svg/)

    - [p5.js Developing Guide](https://github.com/processing/p5.js/wiki/Development)

    - [p5.js Contribute Guide](http://p5js.org/contribute/)

    - [p5.js Libraries Guide](https://github.com/processing/p5.js/wiki/Libraries)

    - [svg.js's API](https://github.com/wout/svg.js)

- Init some functions and classes

    - p5.prototype.createSVG

    - p5.SVGElement

- Gruntfile (using requirejs and amdclean) for generating dist/

    This is based on p5.js's Gruntfile.

    Note that if current (2015-05-08) p5.js uses amdclean@0.3.3,
    which will have different behavior with latest amdclean.
    In latest amdclean, when hooking into onBuildWrite,
    multiple `define` will be called in different anonymous functions,
    which will make variables undefined to each other.
    To fix this, hook into onBuildWrite.

- Create repo: [svgcanvas](https://github.com/zenozeng/svgcanvas)

    `Mock <canvas> element using <svg> (based on gliffy's canvas2svg).`

- Init demo/

- Import svgcanvas to p5.js-svg

    Note that UMD package will be broken after amdclean.

## 2015-05-11 -- 2015-05-24

- Add shell script to generate amd for svgcanvas

    https://github.com/zenozeng/svgcanvas/commit/a9a860f3a040139b8187bb4cca9eb87aa3a5e12b

- Bug: SVGCanvas undefined

    `var SVGCanvas = require('SVGCanvas')` was compiled to `var SVGCanvas = SVGCanvas;` by amdclean

    fixed by: `var svgCanvas = new (require('SVGCanvas'));`

- createSVG now will override default graphics and will call noCanvas

- svgcanvas now supports width, height, style, className, id and getBoundingClientRect
