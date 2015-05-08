/**
 * Alias for p5's core.
 *
 */
define('core',[],function() {
    return p5;
});

/**
 * @module SVG
 * @for p5.SVGElement
 */
define('p5.SVGElement',['require','core'],function(require) {
    "use strict";

    var p5 = require('core');

    /**
     * @class p5.SVGElement
     * @extends p5.Element
     * @constructor
     * @param {Element} element - DOM Element
     * @param {Object} p5Instance - P5 Instance
     */
    p5.SVGElement = function(element, p5Instance) {
        p5.Element.call(this, element);
    };

    // extends p5.Element
    p5.SVGElement.prototype = Object.create(p5.Element);

    // p5.SVGElement.prototype.
});

define('rendering.svg',['require'],function(require) {
    "use strict";

    var p5 = window.p5;

    var createSVGDrawingContext = function(svg) {
        // return new C2S();
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
    p5.prototype.createSVG = function(width, height, attributes) {
        var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');

        svg.setAttribute('width', width || "100px");
        svg.setAttribute('height', height || "100px");
        svg.setAttributeNS('http://www.w3.org/2000/xmlns/', 'xmlns:xlink', 'http://www.w3.org/1999/xlink');

        Object.keys(attributes || {}).forEach(function(key) {
            svg.setAttribute(key, attributes[key]);
        });

        document.body.appendChild(svg);

        this.svg = svg;

        this.drawingContext = createSVGDrawingContext(svg);

        return svg;
    };

});

define('src/app',['require','core','p5.SVGElement','rendering.svg'],function(require) {
    'use strict';

    var p5 = require('core');

    require('p5.SVGElement');
    require('rendering.svg');

    /**
     * Create SVG element with given tag in the current SVG target.
     *
     * @param {String} tag - Tag for the new SVG elemenet
     * @param {Object} attributes - Attributes for the new SVG element
     */
    p5.prototype.createSVGElement = function(tag, attributes) {

        if (typeof this.svg === 'undefined') {
            throw new Error('createSVG() must be called before using createSVGElement()');
        }

        var element;
        Object.keys(attributes || {}).forEach(function(key) {
            element.setAttribute(key, attributes[key]);
        });

        return new p5.SVGElement(element);
    };

});

