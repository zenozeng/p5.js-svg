# p5.js-svg

[![build](https://travis-ci.org/zenozeng/p5.js-svg.svg)](https://travis-ci.org/zenozeng/p5.js-svg)

p5.js-svg is a runtime for p5.js plus some API designed for SVG (still coding).
The SVG based canvas API wrapper is powered by [gliffy's canvas2svg](https://github.com/gliffy/canvas2svg) with [patches](https://github.com/gliffy/canvas2svg/issues?utf8=%E2%9C%93&q=author%3Azenozeng+). I hope basically we can write once and run on both canvas and svg. So we can use canvas for perfermence and use svg for exporting or oop api. Also, I hope that we could only maintain the 2d shapes in canvas API, and let p5.js-svg automatically render it in SVG.

## Compatible p5.js

p5.SVG Version | p5.js Version
-------------------|----------------------
v0.2.0 | v0.4.5+

## Known Issue

### Shape

- [circle's edge is not exactly same in SVG and canvas #37](https://github.com/zenozeng/p5.js-svg/issues/37)

### 3D

- [P3D is not supported yet](https://github.com/zenozeng/p5.js-svg/issues/51)

## API

https://github.com/zenozeng/p5.js-svg/blob/master/API.md

## Project Logs

https://github.com/zenozeng/p5.js-svg/blob/master/logs.md

## Unit Test

http://zenozeng.github.io/p5.js-svg/test/

### Coverage Report

#### Chrome

http://zenozeng.github.io/p5.js-svg-test-reports/coverage/chrome/

#### Firefox

http://zenozeng.github.io/p5.js-svg-test-reports/coverage/iceweasel/

## License

Licensed under LGPL.

This program incorporates work covered by the following copyright and permission notices:

- canvas2svg

    ```
    The MIT License (MIT)
    Copyright (c) 2014 Gliffy Inc.
    ```

- svgcanvas

    ```
    The MIT License (MIT)
    Copyright (c) 2015 Zeno Zeng
    ```
