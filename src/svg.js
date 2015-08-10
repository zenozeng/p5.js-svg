// some SVG only API

module.exports = function(p5) {
    p5.prototype.querySVG = function(selector) {
        var svg = this._graphics && this._graphics.svg;
        if (!svg) {
            return null;
        }
        // p5.SVGShape should provide setAttribute
        var elem = svg.querySelector(selector);
        return p5.SVGShape(elem);
    };
};
