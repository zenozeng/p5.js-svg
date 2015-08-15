# p5.SVG Overview

The main goal of p5.SVG is to provide a SVG runtime for p5.js,
so that we can draw using p5's powerful API in \<svg\>, save things to svg file
and manipulating existing SVG file without rasterization.

## [TODO] p5.SVG 的组成部分

## [TODO] How is SVG Renderer different than Canvas2D Renderer

## [TODO] Getting Started

## [TODO] SVGElement API

## [TODO] SVGFilter API

Custom SVG Filter using `registerSVGFilter` might be added in next release of p5.svg (v0.5.0).

## Browser Compatibility

p5.SVG@0.4.0 was tested on:

- Firefox 40.0 on Linux

- Google Chrome 44 on Linux

- Google Chrome 43 on Android 4.4.4

## [TODO] How it works

The SVG based canvas API wrapper is powered by [gliffy's canvas2svg](https://github.com/gliffy/canvas2svg) with [patches](https://github.com/gliffy/canvas2svg/issues?utf8=%E2%9C%93&q=author%3Azenozeng+). I hope basically we can write once and run on both canvas and svg. So we can use canvas for perfermence and use svg for exporting or oop api. Also, I hope that we could only maintain the 2d shapes in canvas API, and let p5.js-svg automatically render it in SVG.

## [TODO] Tests and Issues

I write a lot tests

https://github.com/zenozeng/p5.js-svg/tree/master/test/unit

## Unit Test

http://zenozeng.github.io/p5.js-svg/test/

### Coverage Report

#### Chrome

http://zenozeng.github.io/p5.js-svg-test-reports/coverage/chrome/

#### Firefox

http://zenozeng.github.io/p5.js-svg-test-reports/coverage/iceweasel/
