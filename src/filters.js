// SVG Filter

module.exports = function(p5) {
    var SVGFilters = require('./p5.SVGFilters')(p5);

    var _filter = p5.prototype.filter;
    p5.prototype.filter = function(opreation, value) {
        if (this._graphics.svg) {
            // move nodes to a new <g>
            var nodes = this._graphics.svg.children;
            for (var i = 0; i < nodes.length; i++) {
            }
        } else {
            _filter.apply(this, arguments);
        }
    };
};
