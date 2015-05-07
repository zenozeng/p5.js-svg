/**
 * @module SVG
 * @for p5.SVGElement
 */
define(function(require) {
    "use strict";

    var p5 = window.p5;

    p5.SVGElement = function(element) {
        p5.Element.call(this, element);
    };

    // extends p5.Element
    p5.SVGElement.prototype = Object.create(p5.Element);

    // p5.SVGElement.prototype.
});
