define(function(require) {
    "use strict";

    var p5 = require('core');
    var SVGCanvas = require('svgcanvas');

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
