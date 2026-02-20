import { p5 } from './types'
import { SVGElement } from './element'

class P5SVG extends p5{

    static SVGElement = SVGElement

    /**
     * Returns an Array of SVGElements of current SVG Graphics matching given selector
     * 
     * @param selector CSS selector for query
     */
    querySVG (selector: string) {
        const svg = this._renderer && this._renderer.svg
        if (!svg) {
            return null
        }
        return SVGElement.prototype.query.call({ elt: svg }, selector)
    }
}
