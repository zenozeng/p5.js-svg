# Future plan of p5.js-svg and p5.js-pdf

## Current Status

Now all shape API is basically finished and covered with [unit tests](http://zenozeng.github.io/p5.js-svg/test/). I am working on context.arcTo now. After implementing context.arcTo, all shape API is done.

The logs can be viewed at https://github.com/zenozeng/p5.js-svg/blob/master/logs.md.

## Future Plans for SVG

1. [DONE] ~~After shape API done, I will add Vector Export API for SVG:  saveSVG(filename, extension) and saveFrames~~

2. SVGShape API (a OOP API in SVG's manner)

    [Current API Design](https://github.com/zenozeng/p5.js-svg/issues/42):

    ```javascript
    s = new SVGShape();
    s.circle();
    s.rect();
    s.translate(100, 100); // move towards right and bottom
    s.translate(100, 100); // again
    s.rotate(angle); // should respect p5's angleMode
    s.rotateTo(angle);
    blur5 = new SVGFilter.Blur(5);
    s.addFilter(blur5);
    s.removeFilter(blur5);
    s.scale(scale);
    s.scaleTo(scale);
    ```

    ```javascript
    c = new SVGShape.Circle(x, y, r);
    c.x = newX; // update using javascript setter API
    c.y = newY;
    c.r = newR;
    ```

3. Low Level API for manipulating SVG

    Like p5.dom's API, but more for SVG.

4. Other p5's API and cover them with unit tests

    See also: https://github.com/zenozeng/p5.js-svg/issues/52

5. Improve unit tests' coverage (100% hopefully)

## Future Plans for PDF

I am now not working on PDF, the vector support for PDF needs SVG Export Support finished.
Once SVG Export Support finished, I will begin working on it. Maybe use svg2pdf or svgToPdf.js.

