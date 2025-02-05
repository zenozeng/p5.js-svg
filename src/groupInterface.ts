import p5RendererSVG from './p5.RendererSVG'
import { P5SVG, SVGElement, p5SVG } from './types'

export default function (p5: P5SVG) {
    p5.prototype.pushSVGGroup = function (this: p5SVG) {
        if (!(this._renderer instanceof p5RendererSVG)) {
            console.warn('Attempted to push SVG group in non-svg canvas')
            return null
        }

        const group = p5.SVGElement.create('g', {}, true)

        const currEl = this._renderer.drawingContext.__currentElement

        if (currEl.tagName !== 'g' && currEl.tagName) {
            console.warn('Attempted to pop SVG group whilst not in g, svg')
            return
        }

        currEl.append(group)

        this._renderer.drawingContext.__currentElement = group

        return group
    }

    p5.prototype.popSVGGroup = function (this: p5SVG, group: SVGElement) {
        if (!(this._renderer instanceof p5RendererSVG)) {
            console.warn('Attempted to pop SVG group in non-svg canvas')
            return null
        }

        const currEl = this._renderer.drawingContext.__currentElement

        if (currEl !== group) {
            return // Silently fail: the warning has already been given by filter
        }

        this._renderer.drawingContext.__currentElement = currEl.parentNode()

        return
    }
}
