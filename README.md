# p5.js-svg

SVG module for p5.js (still coding).

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
