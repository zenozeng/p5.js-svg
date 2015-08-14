module.exports = function(p5) {
    var SVGFilters = function() {
    };

    var SVGElement = p5.SVGElement;

    var generateID = function() {
        return Date.now().toString() + Math.random().toString().replace(/0\./, '');
    };

    // We have to build a filter for each element
    // the `filter: f1 f2` and svg param is not supported by many browsers
    // so we can just modify the filter def to do so
    SVGFilters.apply = function(svgElement, func, arg) {
        // get filters
        var filters = svgElement.attribute('data-p5-svg-filters') || '[]';
        filters = JSON.parse(filters);
        if (func) {
            filters.push([func, arg]);
        }
        svgElement.attribute('data-p5-svg-filters', JSON.stringify(filters));

        if (filters.length === 0) {
            svgElement.attribute('filter', null);
            return;
        }

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
            in: inGraphics,
            result: resultGraphics
        });
    };

    // Here we use CIE luminance for RGB
    // See also: http://www.w3.org/TR/SVG11/filters.html#feColorMatrixElement
    // See also: http://stackoverflow.com/questions/21977929/match-colors-in-fecolormatrix-filter
    SVGFilters.gray = function(inGraphics, resultGraphics, val) {
        var matrix = [
            0.2126, 0.7152, 0.0722, 0, 0, // R'
            0.2126, 0.7152, 0.0722, 0, 0, // G'
            0.2126, 0.7152, 0.0722, 0, 0, // B'
            0, 0, 0, 1, 0 // A'
        ].join(' ');
        return SVGElement.create('feColorMatrix', {
            type: "matrix",
            values: matrix,
            "color-interpolation-filters": "sRGB",
            in: inGraphics,
            result: resultGraphics
        });
    };

    SVGFilters.threshold = function(inGraphics, resultGraphics, val) {
        var elements = [];
        elements.push(SVGFilters.gray(inGraphics, resultGraphics + "-tmp"));
        // TODO: use feComponentTransfer
        return elements[0];
    };

    SVGFilters.invert = function(inGraphics, resultGraphics) {
        var matrix = [
            -1, 0, 0, 0, 1, // R'
            0, -1, 0, 0, 1, // G'
            0, 0, -1, 0, 1, // B'
            0, 0, 0, 1, 0 // A'
        ].join(' ');
        return SVGElement.create('feColorMatrix', {
            type: "matrix",
            values: matrix,
            "color-interpolation-filters": "sRGB",
            in: inGraphics,
            result: resultGraphics
        });
    };

    p5.SVGFilters = SVGFilters;

    return SVGFilters;
};


