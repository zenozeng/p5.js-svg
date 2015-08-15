# p5.js-svg

[![build](https://travis-ci.org/zenozeng/p5.js-svg.svg)](https://travis-ci.org/zenozeng/p5.js-svg)

p5.js-svg is a runtime for p5.js plus some API designed for SVG (still coding).


## Compatible p5.js

p5.SVG Version | p5.js Version
-------------------|----------------------
v0.4.0 | v0.4.7 with [pull#850](https://github.com/processing/p5.js/pull/850)
v0.3.0 | v0.4.7
v0.2.0 | v0.4.5

## Known Issue

### Rendering

- blendMode() is not yet supported

### Filters

p5.SVG's filters were implemented using SVG Filter.
So the result of these filter may not be exactly same as canvas's.

For example, in SVG Renderer, I use feGaussianBlur,
but Canvas Renderer uses a pixels based blur (port of processing's blur),
so the results may not be exactly same.

### 3D

- [P3D is not supported yet](https://github.com/zenozeng/p5.js-svg/issues/51)

## API

https://github.com/zenozeng/p5.js-svg/blob/master/API.md

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
