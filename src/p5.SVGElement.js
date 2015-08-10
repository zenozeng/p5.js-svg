module.exports = function(p5) {
    // input: SVGElement or SVGString
    // TODO: SVGShape(SVGString);
    function SVGElement(svg) {
        this.element = svg;
    }

    /**
     * Get the original element
     */
    SVGElement.prototype.get = function() {
        return this.element;
    };

    SVGElement.prototype.query = function(selector) {
    };

    // TODO
    SVGElement.prototype.append = function(svgShape) {
    };

    // TODO
    SVGElement.prototype.setAttribute = function() {
    };
};
