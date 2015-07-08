define(function(require) {
    "use strict";

    var p5 = require('core');
    var SVGCanvas = require('svgcanvas');

    /**
     * Creates and returns a new p5.Graphics object. Use this class if you need
     * to draw into an off-screen graphics buffer. The two parameters define the
     * width and height in pixels.
     *
     * @method createGraphics
     * @param {Number} width - Width of the offscreen graphics buffer
     * @param {Number} height - Height of the offscreen graphics buffer
     * @param {String} renderer - either 'p2d' or 'webgl' or 'svg'. undefined defaults to p2d
     * @return {Object} offscreen graphics buffer
     */
    var _createGraphics = p5.prototype.createGraphics;
    p5.prototype.createGraphics = function(width, height, renderer) {
        if (typeof renderer === "string" && renderer.toLowerCase() === "svg") {
            width = width || 100;
            height = height || 100;

            var svgCanvas = new SVGCanvas();
            var svg = svgCanvas.svg;

            var node = this._userNode || document.body;
            node.appendChild(svg);
            var pg = new p5.Graphics(svgCanvas, this, false);
            this._elements.push(pg);

            for (var p in p5.prototype) {
                if (!pg.hasOwnProperty(p)) {
                    if (typeof p5.prototype[p] === 'function') {
                        pg[p] = p5.prototype[p].bind(pg);
                    } else {
                        pg[p] = p5.prototype[p];
                    }
                }
            }
            pg.resize(width, height);
            pg._applyDefaults();
            return pg;
        } else {
            return _createGraphics.apply(this, arguments);
        }
    };

    /**
     * Creates a SVG element in the document, and sets its width and
     * height in pixels. This method should be called only once at
     * the start of setup.
     * @param {Number} width - Width (in px) for SVG Element
     * @param {Number} height - Height (in px) for SVG Element
     * @return {Object} {toDataURL}
     */
    p5.prototype.createSVG = function(width, height) {

        var svgCanvas = new SVGCanvas({debug: true});
        var svg = svgCanvas.svg;

        width = width || 100;
        height = height || 100;

        document.body.appendChild(svg);
        this.svg = svg;

        // override default graphics (original is created by createCanvas at _start)
        this.noCanvas();
        this._defaultGraphics = new p5.Graphics(svgCanvas, this, true);
        this._elements.push(this._defaultGraphics);
        this._defaultGraphics.resize(width, height);
        this._defaultGraphics._applyDefaults();

        // enable hardware acceleration
        ['-webkit-', '-moz-', '-ms-', '-o-', ''].forEach(function(prefix) {
            var key = prefix + 'transform';
            var value = 'translateZ(0)';
            svg.style[key] = value;
        });

        return this._defaultGraphics;
    };

    /**
     * Remove the svg element created by createSVG
     */
    p5.prototype.noSVG = function() {
        if (this.svg) {
            this.svg.remove();
            this.svg = null;
            // this.canvas = null;
        }
    };

    /**
     * @alias resizeCanvas
     */
    p5.prototype.resizeSVG = p5.prototype.resizeCanvas;
});
