## v1.6.0

- test: p5.js v1.11.3
- fix: compatibility with p5.js 1.11.x (roundRect issue)
- fix: compatibility with p5.js 1.7.0+ ([BL451](https://github.com/BL451)) (https://github.com/zenozeng/p5.js-svg/pull/258)
- fix: compatibility with p5.js 1.7.0+ & Examples and Tests ([nkymut](https://github.com/nkymut)) (https://github.com/zenozeng/p5.js-svg/pull/260)
- fix: examples ([spencerflem](https://github.com/spencerflem)) (https://github.com/zenozeng/p5.js-svg/pull/264)
- feat: public interface for groups ([immjs](https://github.com/immjs)) (https://github.com/zenozeng/p5.js-svg/pull/256)

## v1.5.1

- docs: examples/vite
- refactor: p5svg -> p5SVG

## v1.5.0

- feat: TypeScript type declarations
- refactor: rewrite using TypeScript
- fix: clear after resizing should not have unwanted white background, fixes
  #235

## v1.4.0

- test: p5.js@1.6.0
- chore(deps): upgrade deps
- fix: make .image() use the transformation matrix
  ([Michael Elsdörfer](https://github.com/miracle2k))
  (https://github.com/zenozeng/p5.js-svg/pull/227)

## v1.3.3

- fix: add cjs output, fixes #217
- docs: update examples/webpack
- docs: add examples/vite

## v1.3.2

- update package.main to dist/p5.svg.js, fixes #213

## v1.3.1

- fix(SVGCanvasElement): addEventListener, fixes
  https://github.com/zenozeng/p5.js-svg/issues/202, fixes
  https://github.com/zenozeng/p5.js-svg/issues/196

## v1.3.0

- feat: loadPixels() for https://github.com/zenozeng/p5.js-svg/issues/203
- fix(graphics): call RendererSVG with this instead of pInst
- fix: _pixelDensity for drawing image created by createGraphics
- refactor: RendererTester
- refactor: use Renderer2D.prototype.line instead of RendererSVG.prototype.line
- refactor: use Proxy instead of _withPixelDensity

## v1.2.1

- fix: add p5.Color.prototype.indexOf, fixes
  https://github.com/zenozeng/p5.js-svg/issues/204

## v1.2.0

- test: p5.js@1.4.1

## v1.1.1

- fix: push/pop, fixes #191, fixes #192
- test: add test for push

## v1.1.0

- test: p5.js@1.4.0

## v1.0.8

- fix: set $this for RendererSVG.prototype.parent, fixes #187

## v1.0.7

- feat: sync element's width and height to context (svgcanvas@2.0.3), calling
  clear() in your draw function will now trigger internal
  context.__clearCanvas() to remove elements.
- test: add test for loadFont, fixes #147

## v1.0.6

- fix: use encodeURIComponent when saving svg, fixes #176 (save() bug)

## v1.0.5

- feat: implement CanvasTransform Interface, see
  https://github.com/gliffy/canvas2svg/pull/83, fixes
  https://github.com/zenozeng/p5.js-svg/issues/170,
- refactor: support p5.js@1.3.1, see
  https://github.com/zenozeng/p5.js-svg/pull/182
- refactor: ESM
- refactor: remove loadGraphics
- fix: keep svgcanvas's root `<g>` when applying filter
- fix: call _incrementPreload & _decrementPreload in p5.prototype.loadSVG, fixes
  https://github.com/zenozeng/p5.js-svg/issues/168
- test: add test for resetMatrix, for
  https://github.com/zenozeng/p5.js-svg/issues/170
- test: diff without converting to png
- test: update IO/saveFrames tests

## v0.6.0-alpha.0

p5.svg@0.6.0-alpha.0 (tests with p5.js@0.4.21)

## v0.5.2

p5.svg@0.5.2 (tests with p5.js@0.4.13)

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

p5.svg@0.4.3 (requires p5.js@0.4.7 with
[patch#850](https://github.com/processing/p5.js/pull/850))

- Write filter attribute every time filter applied, fixes
  https://github.com/zenozeng/p5.js-svg/issues/137

- Fix SVGElement.unfilter not work when arg not defined

- Update documentation

- Add examples for using p5.SVG

- Use jsdoc3

## v0.4.2

p5.svg@0.4.2 (requires p5.js@0.4.7, with
[patch#850](https://github.com/processing/p5.js/pull/850))

### p5.SVG

- add String.prototype.repeat polyfill: fixes
  https://github.com/zenozeng/p5.js-svg/issues/126 &
  https://github.com/zenozeng/p5.js-svg/issues/127

- Update Browser Compatibility Info (add Safari 8 on Mac and Safari on iOS 8)

- mocha.setup({timeout: 10000, slow: 2000})

- Update documentation

## v0.4.1

p5.svg@0.4.1 (built on top of p5.js@0.4.7, with
[patch#850](https://github.com/processing/p5.js/pull/850))

Fix some issues in IE 10 and Safari (iOS).

### p5.SVG

- Update documentation

- Use Node.childNodes for IE

- Update test/io/save/canvas's-save, fixes
  https://github.com/zenozeng/p5.js-svg/issues/123

- Use \<svg\> to display tests, ignore diff, workround for
  https://github.com/zenozeng/p5.js-svg/issues/124

- use devicePixelRatio for diffCanvas in tests, fixes
  https://github.com/zenozeng/p5.js-svg/issues/125

### svgcanvas

- Use parentNode.removeChild instead of childNode.remove for IE, fixes
  https://github.com/zenozeng/p5.js-svg/issues/120

- Patch for IE's bug: search for a duplicate xmnls, fixes
  https://github.com/zenozeng/p5.js-svg/issues/121

- Use Node.childNodes for IE

## v0.4.0

### p5.svg

p5.svg@0.4.0 (built on top of p5.js@0.4.7, with
[patch#850](https://github.com/processing/p5.js/pull/850))

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

- SVGFilters.threshold using feColorMatrix and feComponentTransfer (linear
  feFunc)

- SVGFilters.opaque using feColorMatrix

- SVGFilters._discreteTableValues

  Generate discrete table values based on the given color map function

- SVGFilters.posterize using feComponentTransfer (discrete feFunc)

- SVGFilters.erode using feOffset and feBlend

  Will create 4 offset layer and combine them with current layer using darken
  blend mode.

- SVGFilters.dilate using feOffset and feBlend

  Will create 4 offset layer and combine them with current layer using lighten
  blend mode.

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

- Rendering functions (createCanvas(), resizeCanvas(), noCanvas(),
  createGraphics()) now covered with unit tests

- use createCanvas(w, h, SVG) instead of createSVG(w, h)

- set viewBox attribute when resize, fixes scale issue

- add RendererSVG.prototype._withPixelDensity (temporally set pixel density to
  1), fixes window scaled issue
  (https://github.com/zenozeng/p5.js-svg/issues/35)

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
