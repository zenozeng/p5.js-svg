module.exports = function(p5) {
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
    SVGElement.prototype.filter = function(filter, arg) {
        p5.SVGFilters.apply(this, filter, arg);
        return this;
    };

    /**
     * Remove applied filter on current element
     * After called, rest filters will be chained together
     * and combine to a new SVG filter.
     *
     * @function unfilter
     * @memberof SVGElement.prototype
     * @param {String} filter BLUR, GRAY, INVERT, THRESHOLD, OPAQUE, ERODE, DILATE (defined in p5's constants)
     * @param {Any} argument Argument for that filter
     */
    SVGElement.prototype.unfilter = function(filterName, arg) {
        var filters = this.attribute('data-p5-svg-filters') || '[]';
        filters = JSON.parse(filters);
        if (arg === undefined) {
            arg = null;
        }
        var found = false;
        filters = filters.reverse().filter(function(filter) {
            if ((filter[0] === filterName) && (filter[1] === arg) && !found) {
                found = true;
                return false;
            }
            return true;
        }).reverse();
        this.attribute('data-p5-svg-filters', JSON.stringify(filters));
        p5.SVGFilters.apply(this, null);
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
     * Tell if current element matching given selector.
     * This is polyfill from MDN.
     *
     * @see https://developer.mozilla.org/en-US/docs/Web/API/Element/matches
     *
     * @function matches
     * @memberof SVGElement.prototype
     * @param {String} selector CSS Selector
     * @return {Bool}
     */
    SVGElement.prototype.matches = function(selector) {
        var element = this.elt;
        var matches = (element.document || element.ownerDocument).querySelectorAll(selector);
        var i = 0;
        while (matches[i] && matches[i] !== element) {
            i++;
        }
        return matches[i] ? true : false;
    };

    /**
     * Get defs element, or create one if not exists
     *
     * @private
     */
    SVGElement.prototype._getDefs = function() {
        var svg = this.parentNode('svg');
        var defs = svg.query('defs');
        if (defs[0]) {
            defs = defs[0];
        } else {
            defs = SVGElement.create('defs');
            svg.append(defs);
        }
        return defs;
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
};
