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
        var elements = this.elt.querySelectorAll(selector);
        return elements.map(function(elt) {
            return new SVGElement(elt);
        });
    };

    SVGElement.prototype.attribute = function() {
        var args = arguments;
        if (args.length === 3) {
            this.elt.setAttributeNS.apply(this.elt, args);
            return this;
        }
        p5.Element.prototype.attribute.apply(this, args);
    };

    p5.SVGElement = SVGElement;
};
