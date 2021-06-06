import P5SVGFilters from './p5.SVGFilters';

// SVG Filter

export default function(p5) {
    var _filter = p5.prototype.filter;

    var SVGFilters = P5SVGFilters(p5);

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
            const ctx = this._renderer.drawingContext;
            const defs = ctx.__root.querySelectorAll('defs')[0];
            const rootGroup = ctx.__root.childNodes[1];
            // move nodes to a new <g>
            let g = p5.SVGElement.create('g');
            while (rootGroup.childNodes.length > 0) {
                g.elt.appendChild(rootGroup.childNodes[0]);
            }
            rootGroup.appendChild(g.elt);

            // apply filter
            g._filter(operation, value, defs);

            // create new <g> so that new element won't be influenced by the filter
            g = p5.SVGElement.create('g');
            rootGroup.appendChild(g.elt);
            ctx.__currentElement = g.elt;
        } else {
            _filter.apply(this, arguments);
        }
    };
}