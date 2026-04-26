global.window = {}

const init = require('../dist/p5.svg.cjs.js')

class MockElement {
    constructor(elt) {
        this.elt = elt
    }

    parent() {
        return this
    }
}

class MockP5 {}

MockP5.Element = MockElement
MockP5.Graphics = function () {}
MockP5.Renderer2D = function () {
    return {}
}
MockP5.Renderer2D.prototype = {
    _applyDefaults() {},
    resize() {},
    clear() {},
    image() {}
}
MockP5.prototype = {
    createCanvas() {},
    createGraphics() {},
    filter() {},
    loadPixels() {},
    saveFrames() {},
    constrain(v) {
        return v
    },
    save() {},
    downloadFile() {},
    _checkFileExtension(name, ext) {
        return [name, ext || '']
    },
    _setProperty(key, value) {
        this[key] = value
    }
}
MockP5._validateParameters = function () {}

const patched = init(MockP5)
const required = [
    'SVG',
    'querySVG',
    'registerSVGFilter',
    'filter',
    'pushSVGGroup',
    'popSVGGroup',
    'loadPixels',
    'saveSVG',
    'saveFrames',
    'save',
    'loadSVG',
    'getDataURL',
    'createCanvas',
    'createGraphics'
]
const missing = required.filter((name) => typeof patched.prototype[name] === 'undefined')

if (missing.length) {
    throw new Error('Missing prototype patches: ' + missing.join(', '))
}

if (patched.SVGElement == null || patched.RendererSVG == null || patched.SVGFilters == null) {
    throw new Error('Missing static patches')
}

console.log('smoke ok')
