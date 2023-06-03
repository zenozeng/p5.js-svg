import { P5SVG } from './types'

/**
 * https://github.com/processing/p5.js/blob/main/src/core/p5.Element.js
 */
export default (p5: P5SVG) => {

    /**
     * Returns an Array of SVGElements of current SVG Graphics matching given selector
     * 
     * @param selector CSS selector for query
     */
    p5.prototype.querySVG = function (selector: string) {
        const svg = this._renderer && this._renderer.svg
        if (!svg) {
            return null
        }
        return p5.SVGElement.prototype.query.call({ elt: svg }, selector)
    }

    p5.SVGElement = class SVGElement extends p5.Element {
        public elt: Element

        /**
         * Returns an Array of children of current SVG Element matching given selector
         *
         * @param selector CSS selector for query
         */
        query(selector: string) {
            const elements = this.elt.querySelectorAll(selector)
            const objects = []
            for (let i = 0; i < elements.length; i++) {
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
            const elt = (element as SVGElement).elt || element as Element
            this.elt.appendChild(elt)
            return this
        }

        /**
         * Create SVGElement
         *
         */
        static create(nodeName: string, attributes: { [key: string]: string }) {
            attributes = attributes || {}
            const elt = document.createElementNS('http://www.w3.org/2000/svg', nodeName)
            Object.keys(attributes).forEach(function (k) {
                elt.setAttribute(k, attributes[k])
            })
            return new SVGElement(elt as any)
        }

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
                return new SVGElement(this.elt.parentNode as any)
            }
            let elt: SVGElement = this as SVGElement
            while (elt) {
                elt = this.parentNode()
                if (elt && elt.elt.matches(selector)) {
                    return elt
                }
            }
            return null
        }

        /**
         * Apply different attribute operation based on arguments.length
         * <ul>
         *     <li>setAttribute(name, value)</li>
         *     <li>setAttributeNS(namespace, name, value)</li>
         *     <li>getAttribute(name)</li>
         * </ul>
         *
         */
        attribute = function (...args: any[]): any {
            if (args.length === 3) {
                this.elt.setAttributeNS(args[0], args[1], args[2])
                return this
            }
            if (args.length === 2) {
                this.elt.setAttribute(args[0], args[1])
                return this
            }
            if (args.length === 1) {
                return this.elt.getAttribute(args[0])
            }
            return this
        }
    }


}
