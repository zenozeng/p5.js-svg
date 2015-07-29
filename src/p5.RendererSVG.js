define(function(require) {
    'use strict';

    var p5 = require('core');
    var SVGCanvas = require('svgcanvas');

    // TODO: allow new RendererSVG(<svg>);
    function RendererSVG(elt, pInst, isMainCanvas) {
        var svgCanvas = new SVGCanvas();
        var svg = svgCanvas.svg;
        var canvas = elt;

        p5.Renderer.call(this, elt, pInst, isMainCanvas);
        this.drawingContext = this.canvas.getContext('2d');
        this._pInst._setProperty('drawingContext', this.drawingContext);
        this.isSVG = true;

        return this;
    }

    RendererSVG.prototype = Object.create(p5.Renderer2D.prototype);

    /**
     * Remove the svg element created
     */
    RendererSVG.prototype.noCanvas = function() {
        if (this.svg) {
            this.svg.remove();
            this.svg = null;
        }
    };

    p5.RendererSVG = RendererSVG;
});
