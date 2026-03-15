import { P5SVG } from './types'

/**
 * https://github.com/processing/p5.js/blob/dev-2.0/src/dom/p5.Element.js
 */
export default function (p5: P5SVG) {
    p5.prototype.querySVG = function (selector: string) {
        const svg = this._renderer && this._renderer.svg
        if (!svg) {
            return null
        }
        return p5.SVGElement.prototype.query.call({ elt: svg }, selector)
    }

    p5.SVGElement = class SVGElement extends p5.Element {

        public elt: globalThis.Element

        public isUserInstanciated: boolean

        /**
         * Returns an Array of children of current SVG Element matching given selector
         *
         * @param selector CSS selector for query
         */
        query(selector: string) {
            const elements = this.elt.querySelectorAll(selector)
            const objects = []
            for (let i = 0; i < elements.length; i++) {
                objects[i] = new p5.SVGElement(elements[i] as any)
            }
            return objects
        }

        /**
         * Append a new child to current element.
         * @param element
         * @returns
         */
        append(element: { elt?: globalThis.Element } | globalThis.Element) {
            const elt = (element as { elt?: globalThis.Element }).elt || element as globalThis.Element
            this.elt.appendChild(elt)
            return this
        }

        /**
         * Create SVGElement
         *
         */
        static create(nodeName: string, attributes: { [key: string]: string | number } = {}, isUserInstanciated?: boolean) {
            const elt = document.createElementNS('http://www.w3.org/2000/svg', nodeName)
            Object.keys(attributes).forEach(function (k) {
                elt.setAttribute(k, String(attributes[k]))
            })
            const svgEl = new p5.SVGElement(elt as any)
            svgEl.isUserInstanciated = !!isUserInstanciated
            return svgEl
        }

        /**
         * Check if any group above is user instanciated
         * Will also return true if oneself is user instanciated
         *
         */
        isWithinUserInstanciated(): boolean {
            if (this.isUserInstanciated) {
                return true
            }

            const parent = this.parentNode()
            if (!(parent instanceof p5.SVGElement)) {
                return false
            }

            return parent.isWithinUserInstanciated()
        }

        /**
         * Get parentNode.
         * If selector not given, returns parentNode.
         * Otherwise, will look up all ancestors,
         * and return closest element matching given selector,
         * or return null if not found.
         *
         */
        parentNode(selector?: string): InstanceType<P5SVG['SVGElement']> | null {
            if (!selector) {
                return this.elt.parentNode ? new p5.SVGElement(this.elt.parentNode as any) : null
            }

            let parent: InstanceType<P5SVG['SVGElement']> | null = this.parentNode()
            while (parent) {
                if ((parent.elt as globalThis.Element).matches(selector)) {
                    return parent
                }
                parent = parent.parentNode()
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
    } as unknown as P5SVG['SVGElement']
}
