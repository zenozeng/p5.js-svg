// SVG Filter

module.exports = function(p5) {
    var SVGFilters = require('./p5.SVGFilters')(p5);

    var _filter = p5.prototype.filter;
    p5.prototype.filter = function(operation, value) {
        if (this._graphics.svg) {
            // move nodes to a new <g>
            var nodes = this._graphics.svg.children;
            var g = p5.SVGElement.create('g');
            this._graphics._setGCFlag(g.elt);
            this._graphics.svg.appendChild(g.elt);
            for (var i = 0; i < nodes.length; i++) {
                var node = nodes[i];
                if (node !== g.elt && (node.nodeName.toLowerCase() !== 'defs')) {
                    g.append(node);
                }
            }

            // apply filter
            g.filter(operation, value);

            // create new <g> so that new element won't be influenced by the filter
            g = p5.SVGElement.create('g');
            this._graphics._setGCFlag(g.elt);
            this._graphics.svg.appendChild(g.elt);
        } else {
            _filter.apply(this, arguments);
        }
    };
};
