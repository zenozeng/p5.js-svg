module.exports = function(p5) {
    var SVGFilters = function() {
    };

    var SVGElement = p5.SVGElement;

    SVGFilters.apply = function(svgElement, func, arg) {
        var filters = svgElement.attribute('data-p5-svg-filters') || '[]';
        filters = JSON.parse(filters);
        filters.push({func: func, arg: arg});

        filters = filters.map(function(filter, index) {
            var inGraphics = index === 0 ? 'SourceGraphic' : ('result-' + (index - 1));
            var resultGraphics = 'result-' + index;
            SVGFilters[filter.func].call(null, inGraphics, resultGraphics, filter.arg);
        });

        console.log(filters);
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


