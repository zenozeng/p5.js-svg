// SVG Filter

module.exports = function(p5) {
    var _filter = p5.prototype.filter;

    var SVGFilters = require('./p5.SVGFilters')(p5);

    /**
     * Register a custom SVG Filter
     *
     * @function registerSVGFilter
     * @memberof p5.prototype
     * @param {String} name Name for Custom SVG filter
     * @param {Function} filterFunction filterFunction(inGraphicsName, resultGraphicsName, value)
     *                                  should return SVGElement or Array of SVGElement.
     * @example
     * registerSVGFilter('myblur', function(inGraphicsName, resultGraphicsName, value) {
     *     return SVGElement.create('feGaussianBlur', {
     *         stdDeviation: val,
     *         in: inGraphics,
     *         result: resultGraphics,
     *         'color-interpolation-filters': 'sRGB'
     *     });
     * });
     * filter('myblur', 5);
     */
    p5.prototype.registerSVGFilter = function(name, fn) {
        SVGFilters[name] = fn;
    };

    p5.prototype.filter = function(operation, value) {
        var svg = this._renderer.svg;
        if (svg) {
            // move nodes to a new <g>
            var nodes = svg.children || svg.childNodes; // childNodes is for IE
            var g = p5.SVGElement.create('g');
            this._renderer._setGCFlag(g.elt);
            svg.appendChild(g.elt);
            // convert nodeList to array and use forEach
            // instead of using for loop,
            // which is buggy due to the length changed during append
            nodes = Array.prototype.slice.call(nodes);
            nodes.forEach(function(node) {
                if (node !== g.elt && (node.nodeName.toLowerCase() !== 'defs')) {
                    g.elt.appendChild(node);
                }
            });

            // apply filter
            g.filter(operation, value);

            // create new <g> so that new element won't be influenced by the filter
            g = p5.SVGElement.create('g');
            this._renderer._setGCFlag(g.elt);
            this._renderer.svg.appendChild(g.elt);
            this._renderer.drawingContext.__currentElement = g.elt;
        } else {
            _filter.apply(this, arguments);
        }
    };
};
