## v0.6.0

p5.svg@0.6.0 (tests with p5.js@0.4.13)

- Remove String.prototype.repeat polyfill

    Since https://github.com/processing/p5.js/issues/858 already fixed.

- Replace `this._graphics` with `this._renderer` (for p5.js@0.4.13)

## v0.5.1

p5.svg@0.5.1 (requires p5.js@0.4.8)

- Fix issues with unit tests

## v0.5.0

p5.svg@0.5.0 (requires p5.js@0.4.8)

- Fix loadSVG in p5.js@0.4.8

- RendererSVG.prototype.appendChild(SVGElement)

- Configure ESLint and make it happy

- Allow save SVGElement in save() and saveSVG()

- add p5.prototype.registerSVGFilter

- add p5.prototype.getDataURL

## v0.4.3

p5.svg@0.4.3 (requires p5.js@0.4.7 with [patch#850](https://github.com/processing/p5.js/pull/850))

- Write filter attribute every time filter applied, fixes https://github.com/zenozeng/p5.js-svg/issues/137

- Fix SVGElement.unfilter not work when arg not defined

- Update documentation

- Add examples for using p5.SVG

- Use jsdoc3

## v0.4.2

p5.svg@0.4.2 (requires p5.js@0.4.7, with [patch#850](https://github.com/processing/p5.js/pull/850))

### p5.SVG

- add String.prototype.repeat polyfill: fixes https://github.com/zenozeng/p5.js-svg/issues/126 & https://github.com/zenozeng/p5.js-svg/issues/127

- Update Browser Compatibility Info (add Safari 8 on Mac and Safari on iOS 8)

- mocha.setup({timeout: 10000, slow: 2000})

- Update documentation

## v0.4.1

p5.svg@0.4.1 (built on top of p5.js@0.4.7, with [patch#850](https://github.com/processing/p5.js/pull/850))

Fix some issues in IE 10 and Safari (iOS).

### p5.SVG

- Update documentation

- Use Node.childNodes for IE

- Update test/io/save/canvas's-save, fixes https://github.com/zenozeng/p5.js-svg/issues/123

- Use \<svg\> to display tests, ignore diff, workround for https://github.com/zenozeng/p5.js-svg/issues/124

- use devicePixelRatio for diffCanvas in tests, fixes https://github.com/zenozeng/p5.js-svg/issues/125

### svgcanvas

- Use parentNode.removeChild instead of childNode.remove for IE, fixes https://github.com/zenozeng/p5.js-svg/issues/120

- Patch for IE's bug: search for a duplicate xmnls, fixes https://github.com/zenozeng/p5.js-svg/issues/121

- Use Node.childNodes for IE

## v0.4.0

### p5.svg

p5.svg@0.4.0 (built on top of p5.js@0.4.7, with [patch#850](https://github.com/processing/p5.js/pull/850))

#### Filters

- SVGFilters.apply(element, filter, arg)

- filters chain using svg's in and result.

- SVGElement.prototype.filter = function(filter, arg)

- SVGElement.prototype.unfilter = function(filter, arg)

    Undo the filter applied.

- SVGFilters.colorMatrix = function(inGraphics, resultGraphics, matrix)

- SVGFilters.blur using feGaussianBlur

- SVGFilters.gray using feColorMatrix (CIE luminance)

- SVGFilters.invert using feColorMatrix

- SVGFilters.threshold using feColorMatrix and feComponentTransfer (linear feFunc)

- SVGFilters.opaque using feColorMatrix

- SVGFilters._discreteTableValues

    Generate discrete table values based on the given color map function

- SVGFilters.posterize using feComponentTransfer (discrete feFunc)

- SVGFilters.erode using feOffset and feBlend

    Will create 4 offset layer and combine them with current layer using darken blend mode.

- SVGFilters.dilate using feOffset and feBlend

    Will create 4 offset layer and combine them with current layer using lighten blend mode.

#### p5.SVGElement

- add p5.prototype.querySVG (querySelectorAll and map to SVGElement objects)

- Extends p5.Element

- SVGElement.prototype.query (querySelectorAll and map to SVGElement objects)

- SVGElement.prototype.attribute (setAttributeNS, setAttribute and getAttribute)

- SVGElement.prototype.append

- SVGElement.create = function(nodeName, attributes)

- SVGElement.prototype.parentNode()

    Get parent node

- SVGElement.prototype.parentNode(selector)

    Get parent node matching given selector

- SVGElement.prototype.matches = function(selector)

    To tell whether a element matches certain selector

- SVGElement.prototype._getDefs

    Get defs element, or create one if not exists

#### RendererSVG

- image(SVGElement) now supported

#### IO

- private method p5.prototype.\_svg\_get that handles dataurl and http requests

- force request to dataurl to be async so that it won't mess up preload

- p5.prototype.loadSVG (will return a SVGElement Object)

#### Etc

- RendererSVG's image() now uses <svg> directly instead of drawImage

- use svgcanvas@0.8.0 & update tests, fixes #104

- add testRender.lock and testRender.unlock

- add testRender.setMaxDiff

- add testRender.setMaxPixelDiff

### svgcanvas

- replace encodeURI with encodeURIComponent in toDataURL

- use new XMLSerializer().serializeToString(this.svg)

- remove the buggy Context.prototype.getSerializedSvg

## v0.3.0

p5.svg@0.3.0 (built on top of p5.js@0.4.7)

## CHANGELOG

### p5.svg

- add p5.RendererSVG (extends p5.Renderer2D)

- use p5.js@0.4.7

- add p5.svg constants

- add loadGraphics

- patched p5.Graphics for p5.RendererSVG

- Switch to browserify

- Fix karma

- Canvas now will be cleared when resize called

- add RendererSVG.prototype._applyDefaults, fixes #95 (lineWidth issue)

- Rendering functions (createCanvas(), resizeCanvas(), noCanvas(), createGraphics()) now covered with unit tests

- use createCanvas(w, h, SVG) instead of createSVG(w, h)

- set viewBox attribute when resize, fixes scale issue

- add RendererSVG.prototype._withPixelDensity (temporally set pixel density to 1), fixes window scaled issue (https://github.com/zenozeng/p5.js-svg/issues/35)

- Fix issues in test-render

### svgcanvas

- Use div to wrapper svg, fixes https://github.com/zenozeng/p5.js-svg/issues/84

- check isNaN for width and height

- fixes wrong position issue of drawImage

## v0.2.0

p5.svg@0.2.0 (built on top of p5.js@0.4.5)

- save()
- saveFrames()
- saveSVG()

## v0.1.1

Basic p5.js functions support.
