import p5 from 'p5'

export type Element = any
export type Renderer = any

export type SVGElement = Element & {
    query(selector: string): SVGElement[]
    append(element: SVGElement | Element): SVGElement
    attribute(name: string): any
    attribute(name: string, value: any): SVGElement
    attribute(namespace: string, name: string, value: any): SVGElement
    parentNode(selector?: string): SVGElement | null
    isWithinUserInstanciated(): boolean
    isUserInstanciated?: boolean
}

export type P5 = typeof p5

export type SVG = 'svg'

export type p5SVG = InstanceType<P5> & {
    SVG: SVG
    P2D: any
    _renderer: any
    _isdefaultGraphics?: boolean
    _setProperty(key: string, value: any): void
    querySVG(selector: string): SVGElement[] | null
    createCanvas(w: number, h: number, renderer: Renderer | SVG): any
    createGraphics(w: number, h: number, renderer: Renderer | SVG): any
    registerSVGFilter(name: string, fn: any): void
    filter(operation: string, value: any): void
    pushSVGGroup(): SVGElement | null
    popSVGGroup(group: SVGElement): void
    _makeSVGFrame(options: {
        svg?: globalThis.SVGElement
        filename?: string
        extension?: string
        callback: (err: Error | null, frame: {
            imageData: string
            filename: string
            ext: string
        }) => void
    }): void
    saveSVG(...args: any[]): void
    loadSVG(path: string, successCallback?: any, failureCallback?: any): any
    getDataURL(): string
    _svg_get(path: string, successCallback: any, failureCallback: any): void
}

export type P5SVG = P5 & {
    Renderer2D: any
    RendererSVG: any
    Graphics: any
    Element: {
        prototype: {
            parent(...args: any[]): any
        }
    }
    SVGElement: {
        new(elt: string | Element, pInst?: p5SVG): SVGElement
        create(nodeName: string, attributes?: { [key: string]: string | number }, isUserInstanciated?: boolean): SVGElement
        prototype: SVGElement
    }
    SVGFilters: {
        apply(svgElement: SVGElement, func: string, arg: any, defs: globalThis.Element): void
        blur(inGraphics: string, resultGraphics: string, val: number): SVGElement
        colorMatrix(inGraphics: string, resultGraphics: string, matrix: number[]): SVGElement
        gray(inGraphics: string, resultGraphics: string): SVGElement
        threshold(inGraphics: string, resultGraphics: string, threshold: number): SVGElement[]
        invert(inGraphics: string, resultGraphics: string): SVGElement
        opaque(inGraphics: string, resultGraphics: string): SVGElement
        posterize(inGraphics: string, resultGraphics: string, level: number): SVGElement
        erode(inGraphics: string, resultGraphics: string): SVGElement[]
        dilate(inGraphics: string, resultGraphics: string): SVGElement[]
        [key: string]: any
    }
    _validateParameters: any
    prototype: p5SVG
}

export { p5 }

export interface P5Global {
    p5: P5
}
