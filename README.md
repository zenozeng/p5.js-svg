# p5.js-svg

[![build](https://travis-ci.org/zenozeng/p5.js-svg.svg)](https://travis-ci.org/zenozeng/p5.js-svg)

SVG runtime for p5.js.

## p5.SVG Overview

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
