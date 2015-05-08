/**
 * @module SVG
 * @for p5.SVGElement
 */
define(function(require) {
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
