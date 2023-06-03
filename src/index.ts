import { P5SVG, P5, P5Global } from './types'
import RendererSVG from './p5.RendererSVG'
import Rendering from './rendering'
import IO from './io'
import Element from './element'
import Filters from './filters'
import constants from './constants'

function init(p5: P5) {
    const p5svg = p5 as unknown as P5SVG

    RendererSVG(p5svg)
    Rendering(p5svg)
    IO(p5svg)
    Filters(p5svg)
    Element(p5svg)

    // attach constants to p5 instance
    p5svg.prototype['SVG'] = constants.SVG

    return p5svg
}

const global = window as unknown as P5Global
if (typeof global.p5 !== 'undefined') {
    init(global.p5)
}

export default init