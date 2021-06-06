export default function(p5) {
    /**
     * Returns an Array of SVGElements of current SVG Graphics matching given selector
     *
     * @function querySVG
     * @memberof p5.prototype
     * @param {String} selector CSS selector for query
     * @returns {SVGElement[]}
     */
    p5.prototype.querySVG = function(selector) {
        var svg = this._renderer && this._renderer.svg;
        if (!svg) {
            return null;
        }
        return p5.SVGElement.prototype.query.call({elt: svg}, selector);
    };

    /**
     * @namespace SVGElement
     * @constructor
     * @param {Element} element
     */
    function SVGElement(element) {
        if (!element) {
            return null;
        }
        return p5.Element.apply(this, arguments);
    }

    SVGElement.prototype = Object.create(p5.Element.prototype);

    /**
     * Returns an Array of children of current SVG Element matching given selector
     *
     * @function query
     * @memberof SVGElement.prototype
     * @param {String} selector CSS selector for query
     * @returns {SVGElement[]}
     */
    SVGElement.prototype.query = function(selector) {
        var elements = this.elt.querySelectorAll(selector);
        var objects = [];
        for (var i = 0; i < elements.length; i++) {
            objects[i] = new SVGElement(elements[i]);
        }
        return objects;
    };

    /**
     * Append a new child to current element.
     *
     * @function append
     * @memberof SVGElement.prototype
     * @param {SVGElement|Element} element
     */
    SVGElement.prototype.append = function(element) {
        var elt = element.elt || element;
        this.elt.appendChild(elt);
        return this;
    };

    /**
     * Apply different attribute operation based on arguments.length
     * <ul>
     *     <li>setAttribute(name, value)</li>
     *     <li>setAttributeNS(namespace, name, value)</li>
     *     <li>getAttribute(name)</li>
     * </ul>
     *
     * @function attribute
     * @memberof SVGElement.prototype
     */
    SVGElement.prototype.attribute = function() {
        var args = arguments;
        if (args.length === 3) {
            this.elt.setAttributeNS.apply(this.elt, args);
        }
        if (args.length === 2) {
            this.elt.setAttribute.apply(this.elt, args);
        }
        if (args.length === 1) {
            return this.elt.getAttribute.apply(this.elt, args);
        }
        return this;
    };

    /**
     * Apply filter on current element.
     * If called multiple times,
     * these filters will be chained together and combine to a bigger SVG filter.
     *
     * @function filter
     * @memberof SVGElement.prototype
     * @param {String} filter BLUR, GRAY, INVERT, THRESHOLD, OPAQUE, ERODE, DILATE (defined in p5's constants)
     * @param {Any} argument Argument for that filter
     */
    SVGElement.prototype._filter = function(filter, arg, defs) {
        p5.SVGFilters.apply(this, filter, arg, defs);
        return this;
    };

    /**
     * Create SVGElement
     *
     * @function create
     * @memberof SVGElement
     * @param {String} nodeName
     * @param {Object} [attributes] Attributes for the element
     * @return {SVGElement}
     */
    SVGElement.create = function(nodeName, attributes) {
        attributes = attributes || {};
        var elt = document.createElementNS('http://www.w3.org/2000/svg', nodeName);
        Object.keys(attributes).forEach(function(k) {
            elt.setAttribute(k, attributes[k]);
        });
        return new SVGElement(elt);
    };


    /**
     * Get parentNode.
     * If selector not given, returns parentNode.
     * Otherwise, will look up all ancestors,
     * and return closest element matching given selector,
     * or return null if not found.
     *
     * @function parentNode
     * @memberof SVGElement.prototype
     * @param {String} [selector] CSS Selector
     * @return {SVGElement}
     */
    SVGElement.prototype.parentNode = function(selector) {
        if (!selector) {
            return new SVGElement(this.elt.parentNode);
        }
        var elt = this;
        while (elt) {
            elt = this.parentNode();
            if (elt && elt.matches(selector)) {
                return elt;
            }
        }
        return null;
    };

    p5.SVGElement = SVGElement;
}