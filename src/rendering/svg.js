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
            toDataURL: function(type, options) {
                var serializedSVG = svgCanvas.getContext('2d').getSerializedSvg();
                var dataURL = "data:image/svg+xml;charset=utf-8," + serializedSVG;
                if (type === "image/jpeg" || type === "image/png") {
                    console.log(type, options);
                    // use canvas to export
                    var img = new Image();
                    img.src = dataURL;
                    // sync mode
                    var imageLoaded = function() {
                        return (img.width > 0) && (img.height > 0);
                    };
                    // wait until image loaded
                    while (!imageLoaded()) {}
                    var canvas = document.createElement('canvas');
                    canvas.width = svgCanvas.width;
                    canvas.height = svgCanvas.height;
                    var ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0);
                    return canvas.toDataURL(type, options);
                } else {
                    return dataURL;
                }
            }
        };

        // for debug
        window.p = this;
        window.s = SVGGraphics;

        return SVGGraphics;
    };
});
