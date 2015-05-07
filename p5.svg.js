// p5.svg MAIN
(function(p5) {

    /**
     * Base class for all SVG elements
     * it should extend p5.Element
     * it should provide elem.filter
     */
    p5.SVGElement = function(element, attributes) {
        if (typeof element === "string") {
        }
        Object.keys(attributes || {}).forEach(function(key) {
            element.setAttribute(key, attributes[key]);
        });
    };

    p5.SVGElement.prototype = p5.Element;

    /**
     * Provide Canvas like API based on SVG
     *
     */
    p5.SVGDrawingContext = function(svg) {
        return new C2S();
    };


    var svgElements = {
        Group: 'g',
        Circle: 'circle'
    };

    // API Style 1: c = new Circle()
    // API Style 2: c = createCircle()
    // API Style 3: c = circle() // 也许不能接受，因为原先的 API 允许了链式调用之类的功能

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

})(window.p5);
