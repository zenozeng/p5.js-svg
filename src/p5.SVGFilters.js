module.exports = function(p5) {
    var SVGFilters = function() {
    };

    var SVGElement = p5.SVGElement;

    var generateID = function() {
        return Date.now().toString() + Math.random().toString().replace(/0\./, '');
    };

    SVGFilters.apply = function(svgElement, func, arg) {
        // get filters
        var filters = svgElement.attribute('data-p5-svg-filters') || '[]';
        filters = JSON.parse(filters);
        if (func) {
            filters.push([func, arg]);
        }
        svgElement.attribute('data-p5-svg-filters', JSON.stringify(filters));

        // generate filters chain
        filters = filters.map(function(filter, index) {
            var inGraphics = index === 0 ? 'SourceGraphic' : ('result-' + (index - 1));
            var resultGraphics = 'result-' + index;
            return SVGFilters[filter[0]].call(null, inGraphics, resultGraphics, filter[1]);
        });

        // get filter id for this element or create one
        var filterid = svgElement.attribute('data-p5-svg-filter-id');
        if (!filterid) {
            filterid = 'p5-svg-' + generateID();
            svgElement.attribute('data-p5-svg-filter-id', filterid);
            svgElement.attribute('filter', 'url(#' + filterid + ')');
        }

        // create <filter>
        var filter = SVGElement.create('filter', {id: filterid});
        filters.forEach(function(elt) {
            filter.append(elt);
        });

        // get defs
        var defs = svgElement._getDefs();
        var oldfilter = defs.query('#' + filterid)[0];
        if (!oldfilter) {
            defs.append(filter);
        } else {
            oldfilter.elt.parentNode.replaceChild(filter.elt, oldfilter.elt);
        }
    };

    SVGFilters.blur = function(inGraphics, resultGraphics, val) {
        return SVGElement.create('feGaussianBlur', {
            stdDeviation: val,
            "in": inGraphics,
            result: resultGraphics
        });
    };

    p5.SVGFilters = SVGFilters;

    return SVGFilters;
};


