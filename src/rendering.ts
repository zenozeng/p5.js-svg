import constants from './constants'
import { P5SVG, p5SVG } from './types'

export default function (p5: P5SVG) {
    const isSVGRenderer = function (renderer: any) {
        return !!(renderer && renderer.isSVG)
    }

    const isPatchedImageSource = function (source: any) {
        return !!(
            source &&
            (
                source instanceof p5.Graphics ||
                (source._renderer && isSVGRenderer(source._renderer)) ||
                (source.elt && source.elt.nodeName && source.elt.nodeName.toLowerCase() === 'svg') ||
                (source.nodeName && source.nodeName.toLowerCase() === 'svg')
            )
        )
    }

    const forceSVGPixelDensity = function (host: any) {
        if (host && host._renderer && isSVGRenderer(host._renderer)) {
            host._pixelDensity = 1
            host._renderer._pixelDensity = 1
            if (host._pInst) {
                host._pInst._pixelDensity = 1
            }
            return true
        }
        return false
    }

    const _validate = p5.prototype.validate
    p5.prototype.validate = function (func: string, args: any[]) {
        if (func === 'createCanvas' && args[2] === constants.SVG) {
            return
        }
        if (func === 'createGraphics' && args[2] === constants.SVG) {
            return
        }
        if (func === 'image' && isPatchedImageSource(args[0])) {
            return
        }
        if (func === 'saveFrames' && (args[2] == null || args[3] == null)) {
            return
        }
        return _validate.call(this, func, args)
    }

    // patch p5.Graphics for SVG
    const _graphics = p5.Graphics
    p5.Graphics = function (w: number, h: number, renderer: any, pInst: p5SVG) {
        const isSVG = renderer === constants.SVG
        const pg = new _graphics(w, h, isSVG ? pInst.P2D : renderer, pInst)

        if (isSVG) {
            // replace renderer with SVG renderer
            const svgRenderer = new p5.RendererSVG(pg.canvas, pg._pInst || pInst, false)
            pg._renderer = svgRenderer
            pg.elt = svgRenderer.elt

            // do default again
            pg._renderer.resize(w, h)
            pg._renderer._applyDefaults()
        }

        return pg
    }
    p5.Graphics.prototype = _graphics.prototype

    const _graphicsPixelDensity = p5.Graphics.prototype.pixelDensity
    p5.Graphics.prototype.pixelDensity = function (val?: number) {
        if (!forceSVGPixelDensity(this)) {
            return _graphicsPixelDensity.call(this, val)
        }
        return typeof val === 'number' ? this : 1
    }
    
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
        if (renderer !== constants.SVG) {
            return _createCanvas.apply(this, [w, h, renderer])
        }
        const graphics = _createCanvas.apply(this, [w, h, 'p2d'])
        const c = graphics.canvas
        const rendererSVG = new p5.RendererSVG(c, this, true)
        if (typeof this._setProperty === 'function') {
            this._setProperty('_renderer', rendererSVG)
        } else {
            this._renderer = rendererSVG
        }
        this._isdefaultGraphics = true
        this._renderer.resize(w, h)
        this._renderer._applyDefaults()
        return this._renderer
    }

    const _pixelDensity = p5.prototype.pixelDensity
    p5.prototype.pixelDensity = function (val?: number) {
        if (!forceSVGPixelDensity(this)) {
            return _pixelDensity.call(this, val)
        }
        return typeof val === 'number' ? this : 1
    }

    p5.prototype.createGraphics = function (w: number, h: number, renderer: any) {
        return new p5.Graphics(w, h, renderer, this)
    }

}
