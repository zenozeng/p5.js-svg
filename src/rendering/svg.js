define(function(require) {
    "use strict";

    var p5 = require('core');
    var SVGCanvas = require('svgcanvas');
    var cons = require('constants');

    // patch p5.Graphics for SVG
    var _graphics = p5.Graphics;
    p5.Graphics = function(w, h, renderer, pInst) {
        var args = arguments;
        console.log(p5.Graphics.prototype);
        _graphics.apply(this, args);
        if (renderer === cons.SVG) {
            var c = this._graphics.elt;
            this._graphics = new p5.RendererSVG(c, pInst, false);
            this._graphics.resize(w, h);
            this._graphics._applyDefaults();
        }
    };
    p5.Graphics.prototype = _graphics.prototype;

    /**
     * Creates a SVG element in the document, and sets its width and
     * height in pixels. This method should be called only once at
     * the start of setup.
     * @param {Number} width - Width (in px) for SVG Element
     * @param {Number} height - Height (in px) for SVG Element
     * @return {Object} {toDataURL}
     */
    p5.prototype.createSVG = function(width, height) {
        var graphics = this.createCanvas(width, height);
        var c = graphics.elt;
        this._setProperty('_graphics', new p5.RendererSVG(c, this, true));
        this._isdefaultGraphics = true;
        this._graphics.resize(width, height);
        this._graphics._applyDefaults();
        return this._graphics;
    };

});
