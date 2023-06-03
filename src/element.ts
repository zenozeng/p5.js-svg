import { P5 } from './types'

/**
 * https://github.com/processing/p5.js/blob/main/src/core/p5.Element.js
 */
export default (p5: P5) => {
    return class SVGElement extends p5.Element {
        public elt: Element;

        /**
         * Returns an Array of children of current SVG Element matching given selector
         *
         * @param selector CSS selector for query
         */
        query(selector: string) {
            var elements = this.elt.querySelectorAll(selector)
            var objects = []
            for (var i = 0; i < elements.length; i++) {
                objects[i] = new SVGElement(elements[i] as any)
            }
            return objects
        }

        /**
         * Append a new child to current element.
         * @param element 
         * @returns 
         */
        append(element: SVGElement | Element) {
            var elt = (element as SVGElement).elt || element as Element;
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
         */
        attribute() {
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
         * @param filter BLUR, GRAY, INVERT, THRESHOLD, OPAQUE, ERODE, DILATE (defined in p5's constants)
         * @param argument Argument for that filter
         */
        protected _filter(filter: string, arg: any, defs: any) {
            (p5 as any).SVGFilters.apply(this, filter, arg, defs);
            return this;
        };

        /**
         * Create SVGElement
         *
         */
        create(nodeName: string, attributes: { [key: string]: string }) {
            attributes = attributes || {};
            var elt = document.createElementNS('http://www.w3.org/2000/svg', nodeName);
            Object.keys(attributes).forEach(function (k) {
                elt.setAttribute(k, attributes[k]);
            });
            return new SVGElement(elt as any);
        };

        /**
         * Get parentNode.
         * If selector not given, returns parentNode.
         * Otherwise, will look up all ancestors,
         * and return closest element matching given selector,
         * or return null if not found.
         *
         */
        parentNode(selector?: string) {
            if (!selector) {
                return new SVGElement(this.elt.parentNode as any);
            }
            var elt: SVGElement = this;
            while (elt) {
                elt = this.parentNode();
                if (elt && elt.elt.matches(selector)) {
                    return elt;
                }
            }
            return null;
        };

    }
}


