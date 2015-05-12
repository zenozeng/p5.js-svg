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

## So, why SVG?

- Resolution Independence

- Tool chains!

    SVG works with Adobe Illustrator and Inkscape.
    It would be wonderful if designers can easily export their p5.js to SVG,
    and continue their work using SVG.
    Also, it would be great if p5.js can import SVG,
    because many resources are in SVG.

- Accessibility

    Different from canvas, SVGs are accessible.
    That is, the text can be selected, easily copied and used for TTS.

- Object Based Events

    Want to bind click events on a custom shape? Use SVG!
    SVG's API are born to be object based!

- Filters!

    Now that SVGs are object based,
    we can apply filters on object. (use blur, for example)

## 注意事项

### clear() and background()

When these 2 functions called, the <svg> will remove all child elements in order to improve performance.


## FAQ

### Why not PShape?

I think that PShape is somehow not that natural for SVG.
SVG is something more DOM-like.
So, the manipulation of SVG should have a DOM-like api.

Also, I think in SVG's world, we should treat shapes as object.
Thus, an OOP api was designed.

### Performance Issue

I have tested the performance of svg using a demo drawing many circles (a very edge case).
http://zenozeng.github.io/gsoc2015/p5.js/svg-test/

Though the fps is always about 60,
the circles drawn per second varies when circle count increases.
(Tested on my laptop, Intel(R) Core(TM) i5-2450M CPU @ 2.50GHz)
At the very beginning (before drawing 550 circles), about 40+ circles can be drawn per second.
However, when there are already 1000 circles in svg, only 20+ circles can be drawn per second.
When it comes to 20000 circles, only about 1 circle can be drawn per second.
See also: http://zenozeng.github.io/gsoc2015/p5.js/svg-test/svg.log

The performance is not good, but not so bad.

## License

LGPL

这个项目包括了：

- canvas2svg (MIT)
