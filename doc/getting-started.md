# Getting started with p5.SVG

## Load p5.SVG

There are 3 ways:

- Global

    Simply include p5.svg.js and that's all.

- AMD

    ```javascript
    define(function(require) {
        require('p5.svg');
        // your code here
    });
    ```

- CommonJS

    ```javascript
    var p5 = require('p5');
    require('./p5.svg.js')(p5);
    ```
