var SVGFilters = function() {
};

SVGFilters.apply = function(svgElement, func, arg) {
    var filters = svgElement.attribute('data-p5-svg-filters') || '[]';
    filters = JSON.parse(filters);
    filters.push({func: func, arg: arg});

    filters = filters.map(function(filter) {
        
    });
};

SVGFilters.blur = function(inGraphics, resultGraphics, val) {
    return '<feGaussianBlur in="SourceGraphic" stdDeviation="'+val+'"/>';
};

module.exports = SVGFilters;
