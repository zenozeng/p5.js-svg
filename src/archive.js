// /**
//  * Create SVG element with given tag in the current SVG target.
//  *
//  * @param {String} tag - Tag for the new SVG elemenet
//  * @param {Object} attributes - Attributes for the new SVG element
//  */
// p5.prototype.createSVGElement = function(tag, attributes) {

//     if (typeof this.svg === 'undefined') {
//         throw new Error('createSVG() must be called before using createSVGElement()');
//     }

//     var element;
//     Object.keys(attributes || {}).forEach(function(key) {
//         element.setAttribute(key, attributes[key]);
//     });

//     return new p5.SVGElement(element);
// };
