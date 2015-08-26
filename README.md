# p5.js-svg

[![build](https://travis-ci.org/zenozeng/p5.js-svg.svg)](https://travis-ci.org/zenozeng/p5.js-svg)

The main goal of p5.SVG is to provide a SVG runtime for p5.js,
so that we can draw using p5's powerful API in \<svg\>, save things to svg file
and manipulating existing SVG file without rasterization.

## Docs

- [p5.SVG Overview](./doc/overview.md)

- [Getting Started with p5.SVG](./doc/getting-started.md)

- [Examples](http://zenozeng.github.io/p5.js-svg/examples/)

- [API Reference](http://zenozeng.github.io/p5.js-svg/doc/reference/index.html)

- [CHANGELOG](CHANGELOG.md)

## For Contributor

### To build

```bash
npm run build
```

Make sure you have bash, eslint, browserify and jsdoc installed.

### To run unit test

```bash
npm test
```

Make sure you have karma installed.

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
