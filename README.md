# p5.js-svg

SVG module for p5.js (still coding).
The SVG based canvas API wrapper is powered by [gliffy's canvas2svg](https://github.com/gliffy/canvas2svg).

## Usage

### Global

Simply include p5.svg.js and that's all.

### AMD

```javascript
define(function(require) {
    require('p5.svg');
    // your code here
});
```

### CommonJS

```javascript
var p5 = require('p5');
require('./p5.svg.js')(p5);
```

## Unit Test

http://zenozeng.github.io/p5.js-svg/test/

## Known Issue

### Shape

- [circle's edge is not exactly same in SVG and canvas #37](https://github.com/zenozeng/p5.js-svg/issues/37)

## License

Licensed under LGPL.

This program incorporates work covered by the following copyright and permission notices:

- canvas2svg

    The MIT License (MIT)
    Copyright (c) 2014 Gliffy Inc.

- svgcanvas

    The MIT License (MIT)
    Copyright (c) 2015 Zeno Zeng

