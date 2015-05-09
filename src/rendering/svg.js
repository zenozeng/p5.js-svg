define(function(require) {
    "use strict";

    var p5 = require('core');

    var SVGCanvas = require('SVGCanvas');

    /**
     * Creates a SVG element in the document, and sets its width and
     * height in pixels. This method should be called only once at
     * the start of setup.
     * @param {Number} width - Width (in px) for SVG Element
     * @param {Number} height - Height (in px) for SVG Element
     * @return {p5.SVGElement} p5.SVGElement represents the SVG Element created
     */
    p5.prototype.createSVG = function(width, height) {

        var svgCanvas = new SVGCanvas();
        var svg = svgCanvas.svg;

        document.body.appendChild(svg);
        this.svg = svg;

        if (!this._defaultGraphics) {
            this._defaultGraphics = new p5.Graphics(svgCanvas, this, true);
            this._elements.push(this._defaultGraphics);
        }

        this._defaultGraphics.resize(width, height);
        this._defaultGraphics._applyDefaults();

        return svg;
    };

});
