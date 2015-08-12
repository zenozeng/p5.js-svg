// SVG Filter

module.exports = function(p5) {
    var SVGFilters = require('./p5.SVGFilters')(p5);

    var _filter = p5.prototype.filter;
    p5.prototype.filter = function(opreation, value) {
        if (this._graphics.svg) {
            // TODO
        } else {
            _filter.apply(this, arguments);
        }
    };
};
