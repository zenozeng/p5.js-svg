import { P5SVG } from './types'

export default function (p5: P5SVG) {
    p5.prototype.loadPixels = function (...args: any[]) {
        p5._validateParameters('loadPixels', args)
        return this._renderer.loadPixels()
    }
}
