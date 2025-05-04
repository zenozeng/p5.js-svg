// p5.js 2.0.1 missing type declarations
// https://github.com/processing/p5.js/issues/7789
// workaround: declare module as untyped-module;
declare module 'p5' {
    export class Element {}
    export class Renderer {}
    const p5: any
    export default p5
}
