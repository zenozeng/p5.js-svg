// some SVG only API

module.exports = function(p5) {
    p5.prototype.querySVG = function(selector) {
        var svg = this._graphics && this._graphics.svg;
        if (!svg) {
            return null;
        }
        var elem = svg.querySelector(selector);
        return elem;
    };
};
