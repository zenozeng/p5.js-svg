import p5, { Renderer } from 'p5'

export type P5 = typeof p5 & {
    Renderer2D: any
    SVGElement: any
    RendererSVG: any
}

export { p5 }

export interface P5Global {
    p5: P5,
}

export interface P5SVG extends P5 {

}