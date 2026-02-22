// p5.js 2.0.1 missing type declarations
// https://github.com/processing/p5.js/issues/7789
// workaround: declare module as untyped-module;
declare module 'p5' {
    export class Element {
        constructor(elt: HTMLElement, pInst?: p5)
        elt: HTMLElement
    }
    export class Renderer {
    }
    export class p5 {
        static Element: typeof Element
        _renderer: any
    }
    export default p5
}
