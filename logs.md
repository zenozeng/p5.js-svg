# Log

## 2015-04-28 -- 2015-05-10 (10h41min)

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

    Note that current (2015-05-08) p5.js uses amdclean@0.3.3,
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

### Time (25h18min)

- canvas2svg: 1h01min

- p5.js-svg: 22h

- svgcanvas: 2h17min

### Logs

- Add shell script to generate amd for svgcanvas

    https://github.com/zenozeng/svgcanvas/commit/a9a860f3a040139b8187bb4cca9eb87aa3a5e12b

- Fix Bug: SVGCanvas undefined

    `var SVGCanvas = require('SVGCanvas')` was compiled to `var SVGCanvas = SVGCanvas;` by amdclean

    fixed by: `var svgCanvas = new (require('SVGCanvas'));`

- createSVG now will override default graphics and will call noCanvas

- svgcanvas now supports width, height, style, className, id and getBoundingClientRect

- Override svgcanvas.ctx.fillRect & svgcanvas.ctx.clearRect for p5.prototype.background & p5.prototype.clear

    Now when `clear` or `background` called, the svg will remove all child elements to save resources

- Add generation-based gc to svgcanvas (buggy)

- Skip gc when between ctx.save() and ctx.restore() (buggy due to redraw)

- Skip gc when still in path

- Modify canvas2svg.js: reuse __createElement

- New implementation for Context.prototype.gc (from bottom to top), fixes #17

- Use setTimeout for gc to make it called after redraw done (after both ctx.save() and ctx.restore() called)

- Test line()

    Now, ellipse() and line() could work based on svgcanvas.

- Add SVGGraphics.toSerializedSVG

    Based on canvas2svg's getSerializedSvg

- SVG Support for SVGGraphics.toDataURL

- JPEG Support for SVGGraphics.toDataURL (draw svg in canvas)

- PNG Support for SVGGraphics.toDataURL (draw svg in canvas)

- Add Bitmap Diff based unit tests

- Pull request for canvas2svg: reuse __createElement ([#18](https://github.com/gliffy/canvas2svg/pull/18)), Merged in canvas2svg@1.0.8

- svgcanvas: clearRect now will remove all elements if x, y, w, h matches the whole canvas

- Display mocha results

- Basic 2D Primitives (arc, ellipse, line, point quad, rect, triangle) now work and covered with unit tests (based on svgcanvas)

    Known Issue: [circle's edge is not exactly same in SVG and canvas #37](https://github.com/zenozeng/p5.js-svg/issues/37)

- Find no way to provide toDataURL (sync), provide async version instead

- SVGGraphics.toDataURL now moved to SVGCanvas.prototype.toDataURL

- Update unit test, fixes #37 (circle's edge is not exactly same in SVG and canvas)

    ```javascript
    diffv = Math.abs(r1 - r2) + Math.abs(g1 - g2) + Math.abs(b1 - b2) + Math.abs(a1 - a2);
    diffv /= 255 * 4;
    mismatchval += diffv;
    // loop...
    mismatchLevel = mismatchval / count;
    matchp = mismatchLevel < 0.02;
    ```
- svgcanvas: add documentation

- canvas2svg: use currentDefaultPath instead of &lt;path&gt;'s d attribute, fixes stroke's different behavior in SVG and canvas. ([pull#20](https://github.com/gliffy/canvas2svg/pull/20)), Merged in canvas2svg@1.0.9

    Now \_\_addPathCommand will only update this.\_\_currentDefaultPath. And \_\_applyCurrentDefaultPath will be called inside stroke or fill.

    The bug:

    ![2015-05-21 10 40 01](https://cloud.githubusercontent.com/assets/2544489/7740542/da35f258-ffa5-11e4-8070-631651950cb7.png)

    The left image is SVG, the middle image is Canvas, and the right is diff bitmap.

    The following 2 code blocks should have different result:

    ```javascript
    ctx.beginPath();
    ctx.moveTo(10,10);
    ctx.lineTo(30, 30);
    ctx.lineTo(60, 10);
    ctx.stroke(); // currentDefaultPath not including the final Z
    ctx.closePath();
    ```

    ```javascript
    ctx.beginPath();
    ctx.moveTo(10,10);
    ctx.lineTo(30, 30);
    ctx.lineTo(60, 10);
    ctx.closePath();
    ctx.stroke(); // currentDefaultPath including the final Z
    ```

    See also: https://github.com/zenozeng/p5.js-svg/issues/38

- smooth and noSmooth now work (using SVG's shape-rendering attribute)

- Shape/Attributes (ellipseMode, noSmooth, rectMode, smooth, strokeCap, strokeJoin, strokeWeight) now work and covered with unit tests (based on svgcanvas)

- Add default width & height: 100 * 100

- Add grunt-contrib-jshint

- Make jshint happy

## 2015-05-25 -- 2015-06-07

### Time (30h48min)

- canvas2svg: 1h11min

- p5.js-svg: 16h46min

- svgcanvas: 12h51min

### Logs

- Configure grunt watch

- Enable hardware acceleration using translateZ(0)

- Configure Karma

- Update tests for karma-firefox-launcher and karma-chrome-launcher

- Update tests for karma-coverage

- Move test reports to new repo: https://github.com/zenozeng/p5.js-svg-test-reports

- svgcanvas: log context api call and keep it in __history if debug on

- Display canvas context api call history in test/index.html (to make debug easier)

- canvas2svg: when lineTo called, use M instead of L unless subpath exists ([pull#22](https://github.com/gliffy/canvas2svg/pull/22))

    Commit: https://github.com/zenozeng/canvas2svg/commit/1c49685c9d8caab0cbba14065aa193c4c623444c

    See also:

    - https://github.com/zenozeng/p5.js-svg/issues/44

    - https://github.com/gliffy/canvas2svg/issues/21

- Shape/Vertex now covered with unit tests and works based on svgcanvas

    - beginContour()
    - beginShape()
    - bezierVertex()
    - curveVertex()
    - endContour()
    - endShape()
    - quadraticVertex()
    - vertex()

- List current API in API.md

  - new API such as createSVG
  - compatible API covered with unit tests

- svgcanvas: Now also log prop's setting to history when debug on

- max mismatchLevel for test now changed to 0.05

- svgcanvas: Simple value check for fillStyle, strokeStyle

- Show test describe title for each testRender block

- Shape/Curves now covered with unit tests and works based on svgcanvas

  - bezier()
  - bezierPoint()
  - bezierTangent()
  - curve()
  - curveTightness()
  - curvePoint()
  - curveTangent()

- svgcanvas: use xor globalCompositeOperation for diff in unit tests

- svgcanvas: Configure karma and Travis CI

- [Future plan](plan.md) for p5.js-svg and p5.js-pdf

- svgcanvas: add basic implementation and unit tests for ctx.arcTo

- svgcanvas: use XOR with thin line removed (using 8-connected neighborhood < 5) for diff


## 2015-06-08 -- 2015-06-21

### Time

### Logs

- svgcanvas: add more tests

- svgcanvas: add canvas.toObjectURL()

- svgcanvas: fix onload issue in tests

    See also: https://github.com/zenozeng/svgcanvas/issues/3

- canvas2svg: call lineTo instead moveTo in ctx.arc, fixes closePath issue and straight line issue ([PR#24](https://github.com/gliffy/canvas2svg/pull/24))

- canvas2svg: implementation of ctx.prototype.arcTo ([PR#25](https://github.com/gliffy/canvas2svg/pull/25))

- p5.prototype.resizeSVG

- Configure Travis CI

- p5.prototype.saveSVG

- rewirte test/test-render and make it clean

- use diff with thin line removed (8-connected neighborhood < 5)

- Fix `there is no timestamp` issue in karma

    This error means that file not included. This is due to requirejs's `urlArgs: "_=" + now`, so add a map will fix this:

    ```javascript
    for (var file in window.__karma__.files) {
        // Fix there is no timestamp issue
        // See also: https://github.com/karma-runner/karma-requirejs/issues/6
        window.__karma__.files[file + "?_=" + now] = window.__karma__.files[file];
    }
    ```

- (Pre)Release p5.js-svg@0.1.1

- svgcanvas: fix paint order issue (lineWidth issue) ([canvas2svg - PR#26](https://github.com/gliffy/canvas2svg/pull/26))

    In canvas, the order of stroke and fill was determined by call of stroke() and fill(), in SVG, we should use paint-order to simulate it.

    See also: https://github.com/zenozeng/p5.js-svg/issues/63

    See also: https://github.com/gliffy/canvas2svg/issues/23

- svgcanvas: make Travis CI happy

- svgcanvas: sync version toDataURL

    Note that sync API for jpeg/png is only available in chrome due to image load issue.
    Already tried iframe and web worker but no good luck.
