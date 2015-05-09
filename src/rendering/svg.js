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
     * @param {Object} attributes - Attributes for SVG Element
     * @return {p5.SVGElement} p5.SVGElement represents the SVG Element created
     */
    p5.prototype.createSVG = function(width, height, attributes) {

        svg.setAttribute('width', width || "100px");
        svg.setAttribute('height', height || "100px");
        svg.setAttributeNS('http://www.w3.org/2000/xmlns/', 'xmlns:xlink', 'http://www.w3.org/1999/xlink');

        Object.keys(attributes || {}).forEach(function(key) {
            svg.setAttribute(key, attributes[key]);
        });

        document.body.appendChild(svg);

        var svgCanvas = new SVGCanvas();

        if (!this._defaultGraphics) {
            this._defaultGraphics = new p5.Graphics(svgCanvas, this, true);
            this._elements.push(this._defaultGraphics);
        }

        this.svg = svg;

        return svg;
    };

});
