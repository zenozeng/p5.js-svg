var p5 = require('core');
var SVGCanvas = require('svgcanvas');

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

p5.RendererSVG = RendererSVG;
