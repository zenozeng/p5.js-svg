define(function(require) {
    'use strict';

    var p5 = require('core');
    var SVGCanvas = require('svgcanvas');

    function RendererSVG(elt, pInst, isMainCanvas) {
        var svgCanvas = new SVGCanvas();
        var svg = svgCanvas.svg;

        // replace <canvas> with <svg> and copy id, className
        var parent = elt.parentNode;
        var id = elt.id;
        var className = elt.className;
        parent.replaceChild(elt, svg);
        svgCanvas.id = id;
        svgCanvas.className = className;
        elt = svgCanvas;

        p5.Renderer2D.call(this, elt, pInst, isMainCanvas);
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
