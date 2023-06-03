import constants from './constants'
import { P5SVG, p5SVG } from './types'

export default function (p5: P5SVG) {
    // patch p5.Graphics for SVG
    const _graphics = p5.Graphics
    p5.Graphics = function (w: number, h: number, renderer: any, pInst: p5SVG) {
        const isSVG = renderer === constants.SVG
        _graphics.apply(this, [w, h, isSVG ? pInst.P2D : renderer, pInst])
        if (isSVG) {
            // replace <canvas> with <svg>
            let c = this._renderer.elt
            this._renderer = new p5.RendererSVG(c, this, false) // replace renderer
            c = this._renderer.elt
            this.elt = c // replace this.elt
            // do default again
            this._renderer.resize(w, h)
            this._renderer._applyDefaults()
        }
        return this
    }
    p5.Graphics.prototype = _graphics.prototype

    /**
     * Patched version of createCanvas
     *
     * use createCanvas(100, 100, SVG) to create SVG canvas.
     *
     * Creates a SVG element in the document, and sets its width and
     * height in pixels. This method should be called only once at
     * the start of setup.
     * @function createCanvas
     * @memberof p5.prototype
     * @param {Number} width - Width (in px) for SVG Element
     * @param {Number} height - Height (in px) for SVG Element
     * @return {Graphics}
     */
    const _createCanvas = p5.prototype.createCanvas
    p5.prototype.createCanvas = function (w: number, h: number, renderer: any) {
        const graphics = _createCanvas.apply(this, [w, h, renderer])
        if (renderer === constants.SVG) {
            const c = graphics.canvas
            this._setProperty('_renderer', new p5.RendererSVG(c, this, true))
            this._isdefaultGraphics = true
            this._renderer.resize(w, h)
            this._renderer._applyDefaults()
        }
        return this._renderer
    }

    p5.prototype.createGraphics = function (w: number, h: number, renderer: any) {
        return new p5.Graphics(w, h, renderer, this)
    }

}