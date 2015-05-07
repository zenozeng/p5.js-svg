// p5.svg MAIN
(function(p5) {

    /**
     * Base class for all SVG elements
     * it should extend p5.Element
     * it should provide elem.filter
     */
    p5.SVGElement = function(attributes) {
        var element;
        Object.keys(attributes || {}).forEach(function(key) {
            element.setAttribute(key, attributes[key]);
        });
    };

    p5.SVGElement.prototype = p5.Element;

    /**
     * Creates a SVG element in the document, and sets its width and
     * height in pixels. This method should be called only once at
     * the start of setup.
     * @param {Number} width - Width for SVG Element
     * @param {Number} height - Height for SVG Element
     * @param {Object} attributes - Attributes for SVG Element
     * @return {p5.SVGElement} p5.Element represents the SVG Element created
     */
    p5.prototype.createSVG = function(width, height, attributes) {
        var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');

        svg.setAttribute('width', width || "100px");
        svg.setAttribute('height', height || "100px");
        svg.setAttributeNS('http://www.w3.org/2000/xmlns/', 'xmlns:xlink', 'http://www.w3.org/1999/xlink');

        Object.keys(attributes || {}).forEach(function(key) {
            svg.setAttribute(key, attributes[key]);
        });

        document.body.appendChild(svg);

        return svg;
    };

    var svgElements = {
        Group: 'g',
        Circle: 'circle'
    };

    // Object.keys(svgElements).forEach();

    /**
     * @return {p5.Element} p5.Element represents the `g` element
     */
    p5.prototype.createGroup = function() {
    };

    p5.prototype.createCircle = function(attributes) {
    };

    // reset current SVG
    p5.prototype.background = function() {
    };

    // Clears the pixels within a buffer. (This function clears everything to make all of the pixels 100% transparent)
    p5.prototype.clear = function() {
    };

    p5.prototype.circle = function() {
    };
})(window.p5);
