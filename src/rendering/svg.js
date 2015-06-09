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

        var SVGGraphics = {
            svg: svg,
            toSerializedSVG: function() {
                return svgCanvas.getContext('2d').getSerializedSvg();
            },
            toDataURL: function(type, options, callback) {
                svgCanvas.toDataURL(type, options, callback);
            }
        };

        // enable hardware acceleration
        ['-webkit-', '-moz-', '-ms-', '-o-', ''].forEach(function(prefix) {
            var key = prefix + 'transform';
            var value = 'translateZ(0)';
            svg.style[key] = value;
        });

        // for debug
        window.p = this;

        return SVGGraphics;
    };

    /**
     * @alias resizeCanvas
     */
    p5.prototype.resizeSVG = this.resizeCanvas;
});
