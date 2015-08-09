var SVGCanvas = require('svgcanvas');

module.exports = function(p5) {
    function RendererSVG(elt, pInst, isMainCanvas) {
        var svgCanvas = new SVGCanvas();
        var svg = svgCanvas.svg;

        // replace <canvas> with <svg> and copy id, className
        var parent = elt.parentNode;
        var id = elt.id;
        var className = elt.className;
        parent.replaceChild(svgCanvas.getElement(), elt);
        svgCanvas.id = id;
        svgCanvas.className = className;
        elt = svgCanvas; // our fake <canvas>

        elt.parentNode = {
            // fake parentNode.removeChild so that noCanvas will work
            removeChild: function(element) {
                if (element === elt) {
                    var wrapper = svgCanvas.getElement();
                    wrapper.parentNode.removeChild(wrapper);
                }
            }
        };

        p5.Renderer2D.call(this, elt, pInst, isMainCanvas);

        this.isSVG = true;
        this.svg = svg;

        return this;
    }

    RendererSVG.prototype = Object.create(p5.Renderer2D.prototype);

    RendererSVG.prototype._applyDefaults = function() {
        p5.Renderer2D.prototype._applyDefaults.call(this);
        this.drawingContext.lineWidth = 1;
    };

    RendererSVG.prototype.resize = function(w, h) {
        if (!w || !h) {
            // ignore invalid values for width and height
            return;
        }
        if (this.width !== w || this.height !== h) {
            // canvas will be cleared if its size changed
            // so, we do same thing for SVG
            // note that at first this.width and this.height is undefined
            // so, also check that
            if (this.width && this.height) {
                this.drawingContext.clearRect(0, 0, this.width, this.height);
            }
        }
        p5.Renderer2D.prototype.resize.call(this, w, h);
    };

    p5.RendererSVG = RendererSVG;
};


