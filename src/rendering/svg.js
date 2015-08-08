define(function(require) {
    "use strict";

    var p5 = require('core');
    var SVGCanvas = require('svgcanvas');
    var cons = require('constants');

    // patch p5.Graphics for SVG
    var _graphics = p5.Graphics;
    p5.Graphics = function(w, h, renderer, pInst) {
        var args = arguments;
        _graphics.apply(this, args);
        if (renderer === cons.SVG) {
            // replace <canvas> with <svg>
            var c = this._graphics.elt;
            this._graphics = new p5.RendererSVG(c, pInst, false); // replace renderer
            c = this._graphics.elt;
            this.elt = c; // replace this.elt
            // do default again
            this._graphics.resize(w, h);
            this._graphics._applyDefaults();
        }
        return this;
    };
    p5.Graphics.prototype = _graphics.prototype;

    /**
     * Due to a known issue (image is not surely ready before onload fires),
     * we have no way to draw SVG element synchronously.
     * So, this method will load a SVG Graphics
     * and then convert it to Canvas Graphics asynchronously
     *
     * @see https://github.com/zenozeng/p5.js-svg/issues/78
     *
     * @method loadGraphics
     * @param {p5.Graphics} graphics the p5.Grphaics object
     * @param {Function(p5.Graphics)} [successCallback] Function to be called once
     *                                 the SVG Graphics is loaded. Will be passed the
     *                                 p5.Graphics.
     * @param {Function(Event)}    [failureCallback] called with event error.
     *
     * @example
     * <div>
     * <code>
     * pg = createGraphics(100, 100, SVG);
     * background(200);
     * pg.background(100);
     * pg.ellipse(pg.width/2, pg.height/2, 50, 50);
     * loadGraphics(pg, function(pgCanvas) {
     *      image(pgCanvas, 50, 50);
     *      image(pgCanvas, 0, 0, 50, 50);
     * });
     * </code>
     * </div>
     *
     */
    p5.prototype.loadGraphics = function(graphics, successCallback, failureCallback) {
        if (graphics._graphics.svg) {
            var svg = graphics._graphics.svg;
            svg = (new XMLSerializer()).serializeToString(svg);
            svg = "data:image/svg+xml;charset=utf-8," + encodeURI(svg);
            var img = new Image();
            var pg = this.createGraphics(graphics.width, graphics.height);
            pg.loadImage(svg, function(img) {
                pg.image(img);
                successCallback(pg);
            });
        } else {
            successCallback(graphics);
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
        var graphics = this.createCanvas(width, height);
        var c = graphics.elt;
        this._setProperty('_graphics', new p5.RendererSVG(c, this, true));
        this._isdefaultGraphics = true;
        this._graphics.resize(width, height);
        this._graphics._applyDefaults();
        return this._graphics;
    };

});
