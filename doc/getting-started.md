# Getting started with p5.SVG

This page will help you setting up a p5.js project with p5.SVG and making your first sketch.

## [TODO] Download and File setup

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

## [TODO] Your First Sketch

## What's Next?

- Check out the [examples](./examples)

- View the [API Reference](./doc/reference.md) for full documentation.
