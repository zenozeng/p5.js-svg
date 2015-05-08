;(function() {
/*! p5.svg.js v0.0.1 May 09, 2015 */
var core, p5SVGElement, renderingsvg, src_app;
(function (root, factory) {
    if (typeof define === 'function' && define.amd)
        define('p5.svg', ['p5'], function (p5) {
            factory(p5);
        });
    else if (typeof exports === 'object')
        module.exports = factory;
    else
        factory(root['p5']);
}(this, function (p5) {
    core = function () {
        return p5;
    }();
    p5SVGElement = function (require) {
        var p5 = core;
        /**
         * @class p5.SVGElement
         * @extends p5.Element
         * @constructor
         * @param {Element} element - DOM Element
         * @param {Object} p5Instance - P5 Instance
         */
        p5.SVGElement = function (element, p5Instance) {
            p5.Element.call(this, element);
        };
        // extends p5.Element
        p5.SVGElement.prototype = Object.create(p5.Element);    // p5.SVGElement.prototype.
    }({});
    renderingsvg = function (require) {
        var p5 = window.p5;
        var createSVGDrawingContext = function (svg) {
        };
        /**
         * Creates a SVG element in the document, and sets its width and
         * height in pixels. This method should be called only once at
         * the start of setup.
         * @param {Number} width - Width for SVG Element
         * @param {Number} height - Height for SVG Element
         * @param {Object} attributes - Attributes for SVG Element
         * @return {p5.SVGElement} p5.SVGElement represents the SVG Element created
         */
        p5.prototype.createSVG = function (width, height, attributes) {
            var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            svg.setAttribute('width', width || '100px');
            svg.setAttribute('height', height || '100px');
            svg.setAttributeNS('http://www.w3.org/2000/xmlns/', 'xmlns:xlink', 'http://www.w3.org/1999/xlink');
            Object.keys(attributes || {}).forEach(function (key) {
                svg.setAttribute(key, attributes[key]);
            });
            document.body.appendChild(svg);
            this.svg = svg;
            this.drawingContext = createSVGDrawingContext(svg);
            return svg;
        };
    }({});
    src_app = function (require) {
        var p5 = core;
        p5SVGElement;
        renderingsvg;
        /**
         * Create SVG element with given tag in the current SVG target.
         *
         * @param {String} tag - Tag for the new SVG elemenet
         * @param {Object} attributes - Attributes for the new SVG element
         */
        p5.prototype.createSVGElement = function (tag, attributes) {
            if (typeof this.svg === 'undefined') {
                throw new Error('createSVG() must be called before using createSVGElement()');
            }
            var element;
            Object.keys(attributes || {}).forEach(function (key) {
                element.setAttribute(key, attributes[key]);
            });
            return new p5.SVGElement(element);
        };
    }({});
}));
}());