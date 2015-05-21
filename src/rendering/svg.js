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

        var svgCanvas = new SVGCanvas;
        var svg = svgCanvas.svg;

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
                if (typeof type === "function") {
                    callback = type;
                    type = null;
                }
                if (typeof options === "function") {
                    callback = options;
                    options = {};
                }
                var serializedSVG = svgCanvas.getContext('2d').getSerializedSvg();
                var dataURL = "data:image/svg+xml;charset=utf-8," + serializedSVG;
                if (type === "image/jpeg" || type === "image/png") {
                    var canvas = document.createElement('canvas');
                    canvas.width = svgCanvas.width;
                    canvas.height = svgCanvas.height;
                    var ctx = canvas.getContext('2d');

                    var img = new Image();
                    img.onload = function() {
                        ctx.drawImage(img, 0, 0);
                        callback(null, canvas.toDataURL(type, options));
                    };
                    img.src = dataURL;
                } else {
                    callback(null, dataURL);
                }
            }
        };

        // for debug
        window.p = this;
        window.s = SVGGraphics;

        return SVGGraphics;
    };
});
