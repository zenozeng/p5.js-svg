import p5, { Renderer } from 'p5'

export type SVGElement = p5.Element & {
    query(selector: string): SVGElement[]
    append(element: SVGElement | Element): SVGElement
    attribute(name: string): any
    attribute(name: string, value: any): void
    attribute(namespace: string, name: string, value: any): void
    parentNode(selector?: string): SVGElement | null
}

export type P5 = typeof p5

export type SVG = 'svg'

export type p5SVG = p5 & {
    SVG: SVG
    querySVG(selector: string): SVGElement[]
    createCanvas(w: number, h: number, renderer: Renderer | SVG): void
    registerSVGFilter(name: string, fn: any): void
    filter(operation: string, value: any): void
}

export type P5SVG = P5 & {
    new(sketch: (p: p5SVG) => any, node?: HTMLElement): p5SVG
    Renderer2D: any
    RendererSVG: any
    Graphics: any
    SVGElement: {
        new(elt: string | Element, pInst?: p5): SVGElement
        create(nodeName: string, attributes?: { [key: string]: string | number }): SVGElement
    }
    SVGFilters: {
        apply(svgElement: SVGElement, func: string, arg: number, defs: Element): void
        blur(inGraphics: string, resultGraphics: string, val: number): SVGElement
        colorMatrix(inGraphics: string, resultGraphics: string, matrix: number[]): SVGElement
        gray(inGraphics: string, resultGraphics: string): SVGElement
        threshold(inGraphics: string, resultGraphics: string, threshold: number): SVGElement[]
        invert(inGraphics: string, resultGraphics: string): SVGElement
        opaque(inGraphics: string, resultGraphics: string): SVGElement
        posterize(inGraphics: string, resultGraphics: string, level: number): SVGElement
        erode(inGraphics: string, resultGraphics: string): SVGElement[]
        dilate(inGraphics: string, resultGraphics: string): SVGElement[]
    }
    _validateParameters: any
}

export { p5 }

export interface P5Global {
    p5: P5,
}
