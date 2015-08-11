module.exports = function(p5) {
    p5.prototype.querySVG = function(selector) {
        var svg = this._graphics && this._graphics.svg;
        if (!svg) {
            return null;
        }
        var elements = svg.querySelectorAll(selector);
        return elements.map(function(elt) {
            return new p5.SVGElement(elt);
        });
    };

    function SVGElement(element, pInst) {
        if (!element) {
            return null;
        }
        return p5.Element.apply(this, arguments);
    };

    SVGElement.prototype = Object.create(p5.Element.prototype);

    SVGElement.prototype.query = function(selector) {
        var elements = svg.querySelectorAll(selector);
        return elements.map(function(elt) {
            return new SVGElement(elt);
        });
    };

    p5.SVGElement = SVGElement;
};
