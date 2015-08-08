(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
module.exports=window.p5;


},{}],2:[function(require,module,exports){
var p5=require("./p5"),assert=require("assert"),_=window._,canvasGraphics,svgGraphics,p5svg,p5canvas;p5svg=new p5(function(e){e.setup=function(){svgGraphics=e.createSVG(100,100),e.noLoop(),e.isSVG=!0}},!0),p5canvas=new p5(function(e){e.setup=function(){canvasGraphics=e.createCanvas(100,100),e.noLoop(),e.isSVG=!1}},!0);var resetCanvas=function(e){e.clear(),e.strokeWeight(3),e.fill(200),e.stroke(0),e.ellipseMode(e.CENTER),e.rectMode(e.CORNER),e.smooth()},countPixels=function(e){for(var t=0,a=3;a<e.data.length;a+=4)e.data[a]>0&&t++;return t},diffPixels=function(e,t,a){for(var n=0;n<e.data.length;n+=4){var i=[n,n+1,n+2,n+3];i.forEach(function(e){a.data[e]=0}),i.some(function(a){return e.data[a]!=t.data[a]})&&(a.data[n+3]=255)}},removeThinLines=function(e){for(var t=e.getContext("2d"),a=e.width,n=e.height,i=t.getImageData(0,0,e.width,e.height),r=t.getImageData(0,0,e.width,e.height),s=function(e,t){return 4*(t*a+e)+3},d=function(e,t){var a=s(e,t);return r.data[a]},o=function(e,t,a){i.data[s(e,t)]=a},c=1;a-1>c;c++)for(var v=1;n-1>v;v++)if(0!=d(c,v)){var f=[{x:c-1,y:v-1},{x:c,y:v-1},{x:c+1,y:v-1},{x:c-1,y:v},{x:c+1,y:v},{x:c-1,y:v+1},{x:c,y:v+1},{x:c+1,y:v+1}].map(function(e){return d(e.x,e.y)}).filter(function(e){return e>0}).length;5>f&&o(c,v,0)}e.getContext("2d").putImageData(i,0,0)},render=function(draw){var fnbody=draw.toString();fnbody=fnbody.substring(fnbody.indexOf("{")+1,fnbody.lastIndexOf("}")),[p5svg,p5canvas].forEach(function(p){with(resetCanvas(p),p)p.canvas.getContext("2d").__history=[],eval(fnbody)})},prepareDom=function(e){var t=$("#test-graph"),a='<div class="th"><div>Rendered in SVG</div><div>Rendered in Canvas<br>Converted to PNG</div><div>Diff Bitmap</div><div>Diff Bitmap with thin line removed (8-connected neighborhood < 5)</div><div></div><div class="function">p5.js</div></div>';t.append(a);var n=new Image;n.src="data:image/svg+xml;charset=utf-8,"+p5svg._curElement.elt.getContext("2d").getSerializedSvg(),n.className="svg",t.append(n);var i=new Image;i.src=p5canvas._curElement.elt.toDataURL("image/png"),t.append(i);var r=document.createElement("canvas");r.width=100,r.height=100,t.append(r);var s=document.createElement("canvas");s.width=100,s.height=100,t.append(s);var d=$('<div class="match"></div>');t.append(d);var o=e.toString();o=o.substring(o.indexOf("{")+1,o.lastIndexOf("}"));var c=o.match(/( +)/)[0].length;return c=new RegExp("^[ ]{"+c+"}","gm"),o=o.replace(c,""),t.append('<pre class="function">'+o+"</pre>"),t.append("<hr>"),{svg:n,canvas:i,diffCanvas:r,diffCanvas2:s,$match:d}},testRender=function(e,t){render(e);var a=function(e){if(!e.svg.complete||!e.canvas.complete)return void setTimeout(function(){a(e)},100);var n=e.diffCanvas.getContext("2d"),i=100,r=100;n.clearRect(0,0,i,r),n.drawImage(e.svg,0,0);var s=n.getImageData(0,0,i,r);n.clearRect(0,0,i,r),n.drawImage(e.canvas,0,0);var d=n.getImageData(0,0,i,r),o=n.getImageData(0,0,i,r);diffPixels(s,d,o),n.putImageData(o,0,0),n=e.diffCanvas2.getContext("2d"),n.putImageData(o,0,0),removeThinLines(e.diffCanvas2);var c=n.getImageData(0,0,i,r),v=countPixels(s),f=countPixels(c),p=f/v,g=.05>=p,u=g?"fa-check":"fa-times";if(e.$match.html('<i class="fa '+u+'"></i>'),g)t();else{var h=JSON.stringify({pixels:v,diffPixels:f,rate:p});t(new Error(h))}},n=function(){if(testRender.waitUntil&&Date.now()<testRender.waitUntil)return void setTimeout(n,100);var t=prepareDom(e);a(t)};n()};testRender.describe=function(e){$(function(){var t=$("#test-graph");t.append("<h2>"+e+"</h2>")})},testRender.wait=function(e){testRender.waitUntil=Date.now()+e},module.exports=testRender;


},{"./p5":1,"assert":13}],3:[function(require,module,exports){
require("./io/save-frames"),require("./io/save"),require("./io/save-svg"),require("./rendering/rendering"),require("./shape/2d_primitives"),require("./shape/attributes"),require("./shape/curves"),require("./shape/vertex");
},{"./io/save":6,"./io/save-frames":4,"./io/save-svg":5,"./rendering/rendering":8,"./shape/2d_primitives":9,"./shape/attributes":10,"./shape/curves":11,"./shape/vertex":12}],4:[function(require,module,exports){
var assert=require("assert"),p5=require("../../lib/p5");describe("IO/saveFrames",function(){it("should capture canvas frames",function(n){new p5(function(e){e.setup=function(){e.createCanvas(100,100),e.strokeWeight(3),e.saveFrames("hello","png",.5,10,function(a){try{assert.ok(a.length>1),e.noCanvas(),n()}catch(t){e.noCanvas(),n(t)}})},e.draw=function(){var n=2*e.frameCount;e.line(0,0,n,n)}})}),it("should capture svg frames",function(n){new p5(function(e){e.setup=function(){e.createSVG(100,100),e.strokeWeight(3),e.saveFrames("hello","svg",.5,10,function(a){try{assert.ok(a.length>1),e.noCanvas(),n()}catch(t){e.noCanvas(),n(t)}})},e.draw=function(){var n=2*e.frameCount;e.line(0,0,n,n)}})}),it("should capture svg frames even omitting duration and fps",function(n){this.timeout(0),new p5(function(e){e.setup=function(){e.createSVG(100,100),e.strokeWeight(3),e.saveFrames("hello","svg",null,null,function(a){try{assert.ok(a.length>1),e.noCanvas(),n()}catch(t){e.noCanvas(),n(t)}})},e.draw=function(){var n=2*e.frameCount;e.line(0,0,n,n)}})}),it("should download svg frames",function(n){new p5(function(e){e.setup=function(){e.createSVG(100,100);var a,t=(e.downloadFile,0);e.downloadFile=function(){t++,t>1&&(a||(e.noCanvas(),n(),a=!0))},e.saveFrames("hello","svg",.5,10)},e.draw=function(){var n=2*e.frameCount;e.line(0,0,n,n)}})}),it("should wait all pending jobs done",function(n){new p5(function(e){e.setup=function(){e.createSVG(100,100);var a=(e.downloadFile,0),t=e._makeSVGFrame;e._makeSVGFrame=function(n){a++,setTimeout(function(){t.call(e,n)},500)},e.downloadFile=function(){a--,0===a&&(e.noCanvas(),n())},e.saveFrames("hello","svg",.5,10)},e.draw=function(){var n=2*e.frameCount;e.line(0,0,n,n)}})})});


},{"../../lib/p5":1,"assert":13}],5:[function(require,module,exports){
var assert=require("assert"),testDownload=require("./test-download.js"),p5=require("../../lib/p5");describe("IO/saveSVG",function(){it("should save untitled.svg",function(e){testDownload("untitled","svg",function(e){e.saveSVG()},e)}),it("should save hello.svg",function(e){testDownload("hello","svg",function(e){e.saveSVG("hello.svg")},e)}),it("should save hello.jpg",function(e){testDownload("hello","jpg",function(e){e.saveSVG("hello","jpg")},e)}),it("should save hello.jpeg",function(e){testDownload("hello","jpeg",function(e){e.saveSVG("hello.jpeg")},e)}),it("should save hello.png",function(e){testDownload("hello","png",function(e){e.saveSVG("hello.png")},e)}),it("source is Graphics",function(e){testDownload("source-graphics","png",function(e){var o=e.createGraphics(100,100,e.SVG);o.background(100),e.saveSVG(o,"source-graphics.png")},e)}),it("source is <svg>",function(e){testDownload("source-svg","png",function(e){var o=e.createGraphics(100,100,e.SVG);o.background(100),e.saveSVG(o._graphics.svg,"source-svg.png")},e)}),it("should throw if given unsupported type",function(){new p5(function(e){e.setup=function(){e.createSVG(100,100),e.background(255),e.stroke(0,0,0),e.line(0,0,100,100),assert["throws"](function(){e.saveSVG("hello.txt")}),e.noCanvas()}})})});


},{"../../lib/p5":1,"./test-download.js":7,"assert":13}],6:[function(require,module,exports){
var assert=require("assert"),p5=require("../../lib/p5"),testDownload=require("./test-download.js");describe("IO/save",function(){it("save()",function(s){testDownload("untitled","svg",function(s){s.save()},s)}),it("save(Graphics)",function(s){testDownload("untitled","svg",function(s){s.save(s._defaultGraphics)},s)}),it("save(<svg>)",function(s){testDownload("untitled","svg",function(s){s.save(s.svg)},s)}),it("canvas's save should still work",function(s){testDownload("canvas-save.png","png",function(s){s.save("canvas-save.png")},s,!0)})});


},{"../../lib/p5":1,"./test-download.js":7,"assert":13}],7:[function(require,module,exports){
var assert=require("assert"),p5=require("../../lib/p5"),testDownload=function(e,t,a,o,n){new p5(function(r){r.setup=function(){n?r.createCanvas(100,100):r.createSVG(100,100),r.background(255),r.stroke(0,0,0),r.strokeWeight(3),r.line(0,0,100,100);p5.prototype.downloadFile;p5.prototype.downloadFile=function(a,n,s){try{assert.notEqual(a.indexOf("image/octet-stream"),-1),assert.equal(n,e),assert.equal(s,t),r.noCanvas(),o()}catch(i){r.noCanvas(),o(i)}},a(r)}})};module.exports=testDownload;


},{"../../lib/p5":1,"assert":13}],8:[function(require,module,exports){
var p5=require("../../lib/p5"),testRender=require("../../lib/test-render"),assert=require("assert");describe("Rendering",function(){describe("noCanvas",function(){it("should remove the <svg> created by createCanvas",function(){new p5(function(e){e.setup=function(){e.createSVG(100,100);var t=e._graphics.svg;assert.strictEqual(!0,document.body.contains(t)),e.line(0,0,100,100),e.noCanvas(),assert.strictEqual(!1,document.body.contains(t))}})})}),describe("createGraphics",function(){it("createGraphics: SVG API should draw same image as Canvas API",function(e){testRender.describe("createGraphics"),testRender(function(){pg=createGraphics(400,400,SVG),background(200),pg.background(100),pg.noStroke(),pg.ellipse(pg.width/2,pg.height/2,50,50),loadGraphics(pg,function(e){image(e,50,50),image(e,0,0,50,50),ellipse(width/2,height/2,50,50)},function(e){console.error(e)}),testRender.wait(1e3)},e)})})});


},{"../../lib/p5":1,"../../lib/test-render":2,"assert":13}],9:[function(require,module,exports){
var testRender=require("../../lib/test-render");describe("Shape/2d_primitives",function(){var e={arc:function(){arc(50,55,50,50,0,.5*PI),noFill(),arc(50,55,60,60,.5*PI,1.5*PI)},circle:function(){ellipse(56,46,55,55)},ellipse:function(){ellipse(56,46,55,35)},line:function(){line(30,20,85,20),stroke(126),line(85,20,85,75),stroke(200),line(85,75,30,75)},point:function(){point(30,20),point(85,20),point(85,75),point(30,75)},quad:function(){quad(38,31,86,20,69,63,30,76)},rect:function(){rect(30,20,55,55)},roundRect:function(){rect(30,20,55,55,20,15,10,5)},triangle:function(){triangle(30,75,58,20,86,75)}};Object.keys(e).forEach(function(n){describe(n,function(){it(n+": SVG API should draw same image as Canvas API",function(i){testRender.describe(n),testRender(e[n],i)})})})});


},{"../../lib/test-render":2}],10:[function(require,module,exports){
var testRender=require("../../lib/test-render");describe("Shape/Attributes",function(){var e={strokeWeight:function(){strokeWeight(10),line(0,0,100,100),strokeWeight(5),line(0,0,50,100)},strokeCap:function(){strokeWeight(12),strokeCap(ROUND),line(20,30,80,30),strokeCap(SQUARE),line(20,50,80,50),strokeCap(PROJECT),line(20,70,80,70)},strokeJoinMiter:function(){noFill(),strokeWeight(10),strokeJoin(MITER),beginShape(),vertex(35,20),vertex(65,50),vertex(35,80),endShape()},strokeJoinBevel:function(){noFill(),strokeWeight(10),strokeJoin(BEVEL),beginShape(),vertex(35,20),vertex(65,50),vertex(35,80),endShape()},strokeJoinRound:function(){noFill(),strokeWeight(10),strokeJoin(ROUND),beginShape(),vertex(35,20),vertex(65,50),vertex(35,80),endShape()},ellipseModeRadius:function(){ellipseMode(RADIUS),fill(255),ellipse(50,50,30,30)},ellipseModeCenter:function(){ellipseMode(RADIUS),fill(255),ellipse(50,50,30,30),ellipseMode(CENTER),fill(100),ellipse(50,50,30,30)},ellipseModeCorner:function(){ellipseMode(RADIUS),fill(255),ellipse(50,50,30,30),ellipseMode(CORNER),fill(255),ellipse(25,25,50,50)},ellipseModeCorners:function(){ellipseMode(RADIUS),fill(255),ellipse(50,50,30,30),ellipseMode(CORNERS),fill(100),ellipse(25,25,50,50)},rectModeCornerAndCorners:function(){rectMode(CORNER),fill(255),rect(25,25,50,50),rectMode(CORNERS),fill(100),rect(25,25,50,50)},rectModeRadiusAndCenter:function(){rectMode(RADIUS),fill(255),rect(50,50,30,30),rectMode(CENTER),fill(100),rect(50,50,30,30)},smooth:function(){background(0),fill(255),noStroke(),smooth(),ellipse(30,48,36,36),noSmooth(),ellipse(70,48,36,36)}};Object.keys(e).forEach(function(i){describe(i,function(){it(i+": SVG API should draw same image as Canvas API",function(t){testRender.describe(i),testRender(e[i],t)})})})});


},{"../../lib/test-render":2}],11:[function(require,module,exports){
var testRender=require("../../lib/test-render");describe("Shape/Curves",function(){var e={bezier:function(){noFill(),stroke(255,102,0),line(85,20,10,10),line(90,90,15,80),stroke(0,0,0),bezier(85,20,10,10,90,90,15,80)},bezierPoint:function(){noFill(),bezier(85,20,10,10,90,90,15,80),fill(255),stroke(100),steps=10;for(var e=0;e<=steps;e++){var t=e/steps;x=bezierPoint(85,10,90,15,t),y=bezierPoint(20,10,90,80,t),ellipse(x,y,5,5)}},bezierTangent:function(){for(noFill(),bezier(85,20,10,10,90,90,15,80),steps=6,fill(255),i=0;i<=steps;i++)t=i/steps,x=bezierPoint(85,10,90,15,t),y=bezierPoint(20,10,90,80,t),tx=bezierTangent(85,10,90,15,t),ty=bezierTangent(20,10,90,80,t),a=atan2(ty,tx),a+=PI,stroke(255,102,0),line(x,y,30*cos(a)+x,30*sin(a)+y),stroke(0)},curve:function(){noFill(),stroke(255,102,0),curve(5,26,5,26,73,24,73,61),stroke(0),curve(5,26,73,24,73,61,15,65),stroke(255,102,0),curve(73,24,73,61,15,65,15,65)},curvePoint:function(){for(noFill(),curve(5,26,5,26,73,24,73,61),curve(5,26,73,24,73,61,15,65),fill(255),ellipseMode(CENTER),steps=6,i=0;i<=steps;i++)t=i/steps,x=curvePoint(5,5,73,73,t),y=curvePoint(26,26,24,61,t),ellipse(x,y,5,5),x=curvePoint(5,73,73,15,t),y=curvePoint(26,24,61,65,t),ellipse(x,y,5,5)},curveTangent:function(){for(noFill(),curve(5,26,73,24,73,61,15,65),steps=6,i=0;i<=steps;i++)t=i/steps,x=curvePoint(5,73,73,15,t),y=curvePoint(26,24,61,65,t),tx=curveTangent(5,73,73,15,t),ty=curveTangent(26,24,61,65,t),a=atan2(ty,tx),a-=PI/2,line(x,y,8*cos(a)+x,8*sin(a)+y)},curveTightness:function(){curveTightness(10),beginShape(),curveVertex(10,26),curveVertex(10,26),curveVertex(83,24),curveVertex(83,61),curveVertex(25,65),curveVertex(25,65),endShape()}};Object.keys(e).forEach(function(t){describe(t,function(){it(t+": SVG API should draw same image as Canvas API",function(i){testRender.describe(t),testRender(e[t],i)})})})});


},{"../../lib/test-render":2}],12:[function(require,module,exports){
var testRender=require("../../lib/test-render");describe("Shape/Vertex",function(){var e={contour:function(){translate(50,50),stroke(255,0,0),beginShape(),vertex(-40,-40),vertex(40,-40),vertex(40,40),vertex(-40,40),beginContour(),vertex(-20,-20),vertex(-20,20),vertex(20,20),vertex(20,-20),endContour(),endShape(CLOSE),translate(-50,-50)},bezierVertex:function(){beginShape(),vertex(30,20),bezierVertex(80,0,80,75,30,75),bezierVertex(50,80,60,25,30,20),endShape()},curveVertex:function(){noFill(),beginShape(),curveVertex(84,91),curveVertex(84,91),curveVertex(68,19),curveVertex(21,17),curveVertex(32,100),curveVertex(32,100),endShape()},quadraticVertex:function(){noFill(),strokeWeight(4),beginShape(),vertex(20,20),quadraticVertex(80,20,50,50),quadraticVertex(20,80,80,80),vertex(80,60),endShape()}};Object.keys(e).forEach(function(r){describe(r,function(){it(r+": SVG API should draw same image as Canvas API",function(t){testRender.describe(r),testRender(e[r],t)})})})});


},{"../../lib/test-render":2}],13:[function(require,module,exports){
// http://wiki.commonjs.org/wiki/Unit_Testing/1.0
//
// THIS IS NOT TESTED NOR LIKELY TO WORK OUTSIDE V8!
//
// Originally from narwhal.js (http://narwhaljs.org)
// Copyright (c) 2009 Thomas Robinson <280north.com>
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the 'Software'), to
// deal in the Software without restriction, including without limitation the
// rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
// sell copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
// ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
// WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

// when used in node, this will actually load the util module we depend on
// versus loading the builtin util module as happens otherwise
// this is a bug in node module loading as far as I am concerned
var util = require('util/');

var pSlice = Array.prototype.slice;
var hasOwn = Object.prototype.hasOwnProperty;

// 1. The assert module provides functions that throw
// AssertionError's when particular conditions are not met. The
// assert module must conform to the following interface.

var assert = module.exports = ok;

// 2. The AssertionError is defined in assert.
// new assert.AssertionError({ message: message,
//                             actual: actual,
//                             expected: expected })

assert.AssertionError = function AssertionError(options) {
  this.name = 'AssertionError';
  this.actual = options.actual;
  this.expected = options.expected;
  this.operator = options.operator;
  if (options.message) {
    this.message = options.message;
    this.generatedMessage = false;
  } else {
    this.message = getMessage(this);
    this.generatedMessage = true;
  }
  var stackStartFunction = options.stackStartFunction || fail;

  if (Error.captureStackTrace) {
    Error.captureStackTrace(this, stackStartFunction);
  }
  else {
    // non v8 browsers so we can have a stacktrace
    var err = new Error();
    if (err.stack) {
      var out = err.stack;

      // try to strip useless frames
      var fn_name = stackStartFunction.name;
      var idx = out.indexOf('\n' + fn_name);
      if (idx >= 0) {
        // once we have located the function frame
        // we need to strip out everything before it (and its line)
        var next_line = out.indexOf('\n', idx + 1);
        out = out.substring(next_line + 1);
      }

      this.stack = out;
    }
  }
};

// assert.AssertionError instanceof Error
util.inherits(assert.AssertionError, Error);

function replacer(key, value) {
  if (util.isUndefined(value)) {
    return '' + value;
  }
  if (util.isNumber(value) && !isFinite(value)) {
    return value.toString();
  }
  if (util.isFunction(value) || util.isRegExp(value)) {
    return value.toString();
  }
  return value;
}

function truncate(s, n) {
  if (util.isString(s)) {
    return s.length < n ? s : s.slice(0, n);
  } else {
    return s;
  }
}

function getMessage(self) {
  return truncate(JSON.stringify(self.actual, replacer), 128) + ' ' +
         self.operator + ' ' +
         truncate(JSON.stringify(self.expected, replacer), 128);
}

// At present only the three keys mentioned above are used and
// understood by the spec. Implementations or sub modules can pass
// other keys to the AssertionError's constructor - they will be
// ignored.

// 3. All of the following functions must throw an AssertionError
// when a corresponding condition is not met, with a message that
// may be undefined if not provided.  All assertion methods provide
// both the actual and expected values to the assertion error for
// display purposes.

function fail(actual, expected, message, operator, stackStartFunction) {
  throw new assert.AssertionError({
    message: message,
    actual: actual,
    expected: expected,
    operator: operator,
    stackStartFunction: stackStartFunction
  });
}

// EXTENSION! allows for well behaved errors defined elsewhere.
assert.fail = fail;

// 4. Pure assertion tests whether a value is truthy, as determined
// by !!guard.
// assert.ok(guard, message_opt);
// This statement is equivalent to assert.equal(true, !!guard,
// message_opt);. To test strictly for the value true, use
// assert.strictEqual(true, guard, message_opt);.

function ok(value, message) {
  if (!value) fail(value, true, message, '==', assert.ok);
}
assert.ok = ok;

// 5. The equality assertion tests shallow, coercive equality with
// ==.
// assert.equal(actual, expected, message_opt);

assert.equal = function equal(actual, expected, message) {
  if (actual != expected) fail(actual, expected, message, '==', assert.equal);
};

// 6. The non-equality assertion tests for whether two objects are not equal
// with != assert.notEqual(actual, expected, message_opt);

assert.notEqual = function notEqual(actual, expected, message) {
  if (actual == expected) {
    fail(actual, expected, message, '!=', assert.notEqual);
  }
};

// 7. The equivalence assertion tests a deep equality relation.
// assert.deepEqual(actual, expected, message_opt);

assert.deepEqual = function deepEqual(actual, expected, message) {
  if (!_deepEqual(actual, expected)) {
    fail(actual, expected, message, 'deepEqual', assert.deepEqual);
  }
};

function _deepEqual(actual, expected) {
  // 7.1. All identical values are equivalent, as determined by ===.
  if (actual === expected) {
    return true;

  } else if (util.isBuffer(actual) && util.isBuffer(expected)) {
    if (actual.length != expected.length) return false;

    for (var i = 0; i < actual.length; i++) {
      if (actual[i] !== expected[i]) return false;
    }

    return true;

  // 7.2. If the expected value is a Date object, the actual value is
  // equivalent if it is also a Date object that refers to the same time.
  } else if (util.isDate(actual) && util.isDate(expected)) {
    return actual.getTime() === expected.getTime();

  // 7.3 If the expected value is a RegExp object, the actual value is
  // equivalent if it is also a RegExp object with the same source and
  // properties (`global`, `multiline`, `lastIndex`, `ignoreCase`).
  } else if (util.isRegExp(actual) && util.isRegExp(expected)) {
    return actual.source === expected.source &&
           actual.global === expected.global &&
           actual.multiline === expected.multiline &&
           actual.lastIndex === expected.lastIndex &&
           actual.ignoreCase === expected.ignoreCase;

  // 7.4. Other pairs that do not both pass typeof value == 'object',
  // equivalence is determined by ==.
  } else if (!util.isObject(actual) && !util.isObject(expected)) {
    return actual == expected;

  // 7.5 For all other Object pairs, including Array objects, equivalence is
  // determined by having the same number of owned properties (as verified
  // with Object.prototype.hasOwnProperty.call), the same set of keys
  // (although not necessarily the same order), equivalent values for every
  // corresponding key, and an identical 'prototype' property. Note: this
  // accounts for both named and indexed properties on Arrays.
  } else {
    return objEquiv(actual, expected);
  }
}

function isArguments(object) {
  return Object.prototype.toString.call(object) == '[object Arguments]';
}

function objEquiv(a, b) {
  if (util.isNullOrUndefined(a) || util.isNullOrUndefined(b))
    return false;
  // an identical 'prototype' property.
  if (a.prototype !== b.prototype) return false;
  // if one is a primitive, the other must be same
  if (util.isPrimitive(a) || util.isPrimitive(b)) {
    return a === b;
  }
  var aIsArgs = isArguments(a),
      bIsArgs = isArguments(b);
  if ((aIsArgs && !bIsArgs) || (!aIsArgs && bIsArgs))
    return false;
  if (aIsArgs) {
    a = pSlice.call(a);
    b = pSlice.call(b);
    return _deepEqual(a, b);
  }
  var ka = objectKeys(a),
      kb = objectKeys(b),
      key, i;
  // having the same number of owned properties (keys incorporates
  // hasOwnProperty)
  if (ka.length != kb.length)
    return false;
  //the same set of keys (although not necessarily the same order),
  ka.sort();
  kb.sort();
  //~~~cheap key test
  for (i = ka.length - 1; i >= 0; i--) {
    if (ka[i] != kb[i])
      return false;
  }
  //equivalent values for every corresponding key, and
  //~~~possibly expensive deep test
  for (i = ka.length - 1; i >= 0; i--) {
    key = ka[i];
    if (!_deepEqual(a[key], b[key])) return false;
  }
  return true;
}

// 8. The non-equivalence assertion tests for any deep inequality.
// assert.notDeepEqual(actual, expected, message_opt);

assert.notDeepEqual = function notDeepEqual(actual, expected, message) {
  if (_deepEqual(actual, expected)) {
    fail(actual, expected, message, 'notDeepEqual', assert.notDeepEqual);
  }
};

// 9. The strict equality assertion tests strict equality, as determined by ===.
// assert.strictEqual(actual, expected, message_opt);

assert.strictEqual = function strictEqual(actual, expected, message) {
  if (actual !== expected) {
    fail(actual, expected, message, '===', assert.strictEqual);
  }
};

// 10. The strict non-equality assertion tests for strict inequality, as
// determined by !==.  assert.notStrictEqual(actual, expected, message_opt);

assert.notStrictEqual = function notStrictEqual(actual, expected, message) {
  if (actual === expected) {
    fail(actual, expected, message, '!==', assert.notStrictEqual);
  }
};

function expectedException(actual, expected) {
  if (!actual || !expected) {
    return false;
  }

  if (Object.prototype.toString.call(expected) == '[object RegExp]') {
    return expected.test(actual);
  } else if (actual instanceof expected) {
    return true;
  } else if (expected.call({}, actual) === true) {
    return true;
  }

  return false;
}

function _throws(shouldThrow, block, expected, message) {
  var actual;

  if (util.isString(expected)) {
    message = expected;
    expected = null;
  }

  try {
    block();
  } catch (e) {
    actual = e;
  }

  message = (expected && expected.name ? ' (' + expected.name + ').' : '.') +
            (message ? ' ' + message : '.');

  if (shouldThrow && !actual) {
    fail(actual, expected, 'Missing expected exception' + message);
  }

  if (!shouldThrow && expectedException(actual, expected)) {
    fail(actual, expected, 'Got unwanted exception' + message);
  }

  if ((shouldThrow && actual && expected &&
      !expectedException(actual, expected)) || (!shouldThrow && actual)) {
    throw actual;
  }
}

// 11. Expected to throw an error:
// assert.throws(block, Error_opt, message_opt);

assert.throws = function(block, /*optional*/error, /*optional*/message) {
  _throws.apply(this, [true].concat(pSlice.call(arguments)));
};

// EXTENSION! This is annoying to write outside this module.
assert.doesNotThrow = function(block, /*optional*/message) {
  _throws.apply(this, [false].concat(pSlice.call(arguments)));
};

assert.ifError = function(err) { if (err) {throw err;}};

var objectKeys = Object.keys || function (obj) {
  var keys = [];
  for (var key in obj) {
    if (hasOwn.call(obj, key)) keys.push(key);
  }
  return keys;
};

},{"util/":17}],14:[function(require,module,exports){
if (typeof Object.create === 'function') {
  // implementation from standard node.js 'util' module
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    ctor.prototype = Object.create(superCtor.prototype, {
      constructor: {
        value: ctor,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
  };
} else {
  // old school shim for old browsers
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    var TempCtor = function () {}
    TempCtor.prototype = superCtor.prototype
    ctor.prototype = new TempCtor()
    ctor.prototype.constructor = ctor
  }
}

},{}],15:[function(require,module,exports){
// shim for using process in browser

var process = module.exports = {};
var queue = [];
var draining = false;

function drainQueue() {
    if (draining) {
        return;
    }
    draining = true;
    var currentQueue;
    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        var i = -1;
        while (++i < len) {
            currentQueue[i]();
        }
        len = queue.length;
    }
    draining = false;
}
process.nextTick = function (fun) {
    queue.push(fun);
    if (!draining) {
        setTimeout(drainQueue, 0);
    }
};

process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

// TODO(shtylman)
process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],16:[function(require,module,exports){
module.exports = function isBuffer(arg) {
  return arg && typeof arg === 'object'
    && typeof arg.copy === 'function'
    && typeof arg.fill === 'function'
    && typeof arg.readUInt8 === 'function';
}
},{}],17:[function(require,module,exports){
(function (process,global){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

var formatRegExp = /%[sdj%]/g;
exports.format = function(f) {
  if (!isString(f)) {
    var objects = [];
    for (var i = 0; i < arguments.length; i++) {
      objects.push(inspect(arguments[i]));
    }
    return objects.join(' ');
  }

  var i = 1;
  var args = arguments;
  var len = args.length;
  var str = String(f).replace(formatRegExp, function(x) {
    if (x === '%%') return '%';
    if (i >= len) return x;
    switch (x) {
      case '%s': return String(args[i++]);
      case '%d': return Number(args[i++]);
      case '%j':
        try {
          return JSON.stringify(args[i++]);
        } catch (_) {
          return '[Circular]';
        }
      default:
        return x;
    }
  });
  for (var x = args[i]; i < len; x = args[++i]) {
    if (isNull(x) || !isObject(x)) {
      str += ' ' + x;
    } else {
      str += ' ' + inspect(x);
    }
  }
  return str;
};


// Mark that a method should not be used.
// Returns a modified function which warns once by default.
// If --no-deprecation is set, then it is a no-op.
exports.deprecate = function(fn, msg) {
  // Allow for deprecating things in the process of starting up.
  if (isUndefined(global.process)) {
    return function() {
      return exports.deprecate(fn, msg).apply(this, arguments);
    };
  }

  if (process.noDeprecation === true) {
    return fn;
  }

  var warned = false;
  function deprecated() {
    if (!warned) {
      if (process.throwDeprecation) {
        throw new Error(msg);
      } else if (process.traceDeprecation) {
        console.trace(msg);
      } else {
        console.error(msg);
      }
      warned = true;
    }
    return fn.apply(this, arguments);
  }

  return deprecated;
};


var debugs = {};
var debugEnviron;
exports.debuglog = function(set) {
  if (isUndefined(debugEnviron))
    debugEnviron = process.env.NODE_DEBUG || '';
  set = set.toUpperCase();
  if (!debugs[set]) {
    if (new RegExp('\\b' + set + '\\b', 'i').test(debugEnviron)) {
      var pid = process.pid;
      debugs[set] = function() {
        var msg = exports.format.apply(exports, arguments);
        console.error('%s %d: %s', set, pid, msg);
      };
    } else {
      debugs[set] = function() {};
    }
  }
  return debugs[set];
};


/**
 * Echos the value of a value. Trys to print the value out
 * in the best way possible given the different types.
 *
 * @param {Object} obj The object to print out.
 * @param {Object} opts Optional options object that alters the output.
 */
/* legacy: obj, showHidden, depth, colors*/
function inspect(obj, opts) {
  // default options
  var ctx = {
    seen: [],
    stylize: stylizeNoColor
  };
  // legacy...
  if (arguments.length >= 3) ctx.depth = arguments[2];
  if (arguments.length >= 4) ctx.colors = arguments[3];
  if (isBoolean(opts)) {
    // legacy...
    ctx.showHidden = opts;
  } else if (opts) {
    // got an "options" object
    exports._extend(ctx, opts);
  }
  // set default options
  if (isUndefined(ctx.showHidden)) ctx.showHidden = false;
  if (isUndefined(ctx.depth)) ctx.depth = 2;
  if (isUndefined(ctx.colors)) ctx.colors = false;
  if (isUndefined(ctx.customInspect)) ctx.customInspect = true;
  if (ctx.colors) ctx.stylize = stylizeWithColor;
  return formatValue(ctx, obj, ctx.depth);
}
exports.inspect = inspect;


// http://en.wikipedia.org/wiki/ANSI_escape_code#graphics
inspect.colors = {
  'bold' : [1, 22],
  'italic' : [3, 23],
  'underline' : [4, 24],
  'inverse' : [7, 27],
  'white' : [37, 39],
  'grey' : [90, 39],
  'black' : [30, 39],
  'blue' : [34, 39],
  'cyan' : [36, 39],
  'green' : [32, 39],
  'magenta' : [35, 39],
  'red' : [31, 39],
  'yellow' : [33, 39]
};

// Don't use 'blue' not visible on cmd.exe
inspect.styles = {
  'special': 'cyan',
  'number': 'yellow',
  'boolean': 'yellow',
  'undefined': 'grey',
  'null': 'bold',
  'string': 'green',
  'date': 'magenta',
  // "name": intentionally not styling
  'regexp': 'red'
};


function stylizeWithColor(str, styleType) {
  var style = inspect.styles[styleType];

  if (style) {
    return '\u001b[' + inspect.colors[style][0] + 'm' + str +
           '\u001b[' + inspect.colors[style][1] + 'm';
  } else {
    return str;
  }
}


function stylizeNoColor(str, styleType) {
  return str;
}


function arrayToHash(array) {
  var hash = {};

  array.forEach(function(val, idx) {
    hash[val] = true;
  });

  return hash;
}


function formatValue(ctx, value, recurseTimes) {
  // Provide a hook for user-specified inspect functions.
  // Check that value is an object with an inspect function on it
  if (ctx.customInspect &&
      value &&
      isFunction(value.inspect) &&
      // Filter out the util module, it's inspect function is special
      value.inspect !== exports.inspect &&
      // Also filter out any prototype objects using the circular check.
      !(value.constructor && value.constructor.prototype === value)) {
    var ret = value.inspect(recurseTimes, ctx);
    if (!isString(ret)) {
      ret = formatValue(ctx, ret, recurseTimes);
    }
    return ret;
  }

  // Primitive types cannot have properties
  var primitive = formatPrimitive(ctx, value);
  if (primitive) {
    return primitive;
  }

  // Look up the keys of the object.
  var keys = Object.keys(value);
  var visibleKeys = arrayToHash(keys);

  if (ctx.showHidden) {
    keys = Object.getOwnPropertyNames(value);
  }

  // IE doesn't make error fields non-enumerable
  // http://msdn.microsoft.com/en-us/library/ie/dww52sbt(v=vs.94).aspx
  if (isError(value)
      && (keys.indexOf('message') >= 0 || keys.indexOf('description') >= 0)) {
    return formatError(value);
  }

  // Some type of object without properties can be shortcutted.
  if (keys.length === 0) {
    if (isFunction(value)) {
      var name = value.name ? ': ' + value.name : '';
      return ctx.stylize('[Function' + name + ']', 'special');
    }
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    }
    if (isDate(value)) {
      return ctx.stylize(Date.prototype.toString.call(value), 'date');
    }
    if (isError(value)) {
      return formatError(value);
    }
  }

  var base = '', array = false, braces = ['{', '}'];

  // Make Array say that they are Array
  if (isArray(value)) {
    array = true;
    braces = ['[', ']'];
  }

  // Make functions say that they are functions
  if (isFunction(value)) {
    var n = value.name ? ': ' + value.name : '';
    base = ' [Function' + n + ']';
  }

  // Make RegExps say that they are RegExps
  if (isRegExp(value)) {
    base = ' ' + RegExp.prototype.toString.call(value);
  }

  // Make dates with properties first say the date
  if (isDate(value)) {
    base = ' ' + Date.prototype.toUTCString.call(value);
  }

  // Make error with message first say the error
  if (isError(value)) {
    base = ' ' + formatError(value);
  }

  if (keys.length === 0 && (!array || value.length == 0)) {
    return braces[0] + base + braces[1];
  }

  if (recurseTimes < 0) {
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    } else {
      return ctx.stylize('[Object]', 'special');
    }
  }

  ctx.seen.push(value);

  var output;
  if (array) {
    output = formatArray(ctx, value, recurseTimes, visibleKeys, keys);
  } else {
    output = keys.map(function(key) {
      return formatProperty(ctx, value, recurseTimes, visibleKeys, key, array);
    });
  }

  ctx.seen.pop();

  return reduceToSingleString(output, base, braces);
}


function formatPrimitive(ctx, value) {
  if (isUndefined(value))
    return ctx.stylize('undefined', 'undefined');
  if (isString(value)) {
    var simple = '\'' + JSON.stringify(value).replace(/^"|"$/g, '')
                                             .replace(/'/g, "\\'")
                                             .replace(/\\"/g, '"') + '\'';
    return ctx.stylize(simple, 'string');
  }
  if (isNumber(value))
    return ctx.stylize('' + value, 'number');
  if (isBoolean(value))
    return ctx.stylize('' + value, 'boolean');
  // For some reason typeof null is "object", so special case here.
  if (isNull(value))
    return ctx.stylize('null', 'null');
}


function formatError(value) {
  return '[' + Error.prototype.toString.call(value) + ']';
}


function formatArray(ctx, value, recurseTimes, visibleKeys, keys) {
  var output = [];
  for (var i = 0, l = value.length; i < l; ++i) {
    if (hasOwnProperty(value, String(i))) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
          String(i), true));
    } else {
      output.push('');
    }
  }
  keys.forEach(function(key) {
    if (!key.match(/^\d+$/)) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
          key, true));
    }
  });
  return output;
}


function formatProperty(ctx, value, recurseTimes, visibleKeys, key, array) {
  var name, str, desc;
  desc = Object.getOwnPropertyDescriptor(value, key) || { value: value[key] };
  if (desc.get) {
    if (desc.set) {
      str = ctx.stylize('[Getter/Setter]', 'special');
    } else {
      str = ctx.stylize('[Getter]', 'special');
    }
  } else {
    if (desc.set) {
      str = ctx.stylize('[Setter]', 'special');
    }
  }
  if (!hasOwnProperty(visibleKeys, key)) {
    name = '[' + key + ']';
  }
  if (!str) {
    if (ctx.seen.indexOf(desc.value) < 0) {
      if (isNull(recurseTimes)) {
        str = formatValue(ctx, desc.value, null);
      } else {
        str = formatValue(ctx, desc.value, recurseTimes - 1);
      }
      if (str.indexOf('\n') > -1) {
        if (array) {
          str = str.split('\n').map(function(line) {
            return '  ' + line;
          }).join('\n').substr(2);
        } else {
          str = '\n' + str.split('\n').map(function(line) {
            return '   ' + line;
          }).join('\n');
        }
      }
    } else {
      str = ctx.stylize('[Circular]', 'special');
    }
  }
  if (isUndefined(name)) {
    if (array && key.match(/^\d+$/)) {
      return str;
    }
    name = JSON.stringify('' + key);
    if (name.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)) {
      name = name.substr(1, name.length - 2);
      name = ctx.stylize(name, 'name');
    } else {
      name = name.replace(/'/g, "\\'")
                 .replace(/\\"/g, '"')
                 .replace(/(^"|"$)/g, "'");
      name = ctx.stylize(name, 'string');
    }
  }

  return name + ': ' + str;
}


function reduceToSingleString(output, base, braces) {
  var numLinesEst = 0;
  var length = output.reduce(function(prev, cur) {
    numLinesEst++;
    if (cur.indexOf('\n') >= 0) numLinesEst++;
    return prev + cur.replace(/\u001b\[\d\d?m/g, '').length + 1;
  }, 0);

  if (length > 60) {
    return braces[0] +
           (base === '' ? '' : base + '\n ') +
           ' ' +
           output.join(',\n  ') +
           ' ' +
           braces[1];
  }

  return braces[0] + base + ' ' + output.join(', ') + ' ' + braces[1];
}


// NOTE: These type checking functions intentionally don't use `instanceof`
// because it is fragile and can be easily faked with `Object.create()`.
function isArray(ar) {
  return Array.isArray(ar);
}
exports.isArray = isArray;

function isBoolean(arg) {
  return typeof arg === 'boolean';
}
exports.isBoolean = isBoolean;

function isNull(arg) {
  return arg === null;
}
exports.isNull = isNull;

function isNullOrUndefined(arg) {
  return arg == null;
}
exports.isNullOrUndefined = isNullOrUndefined;

function isNumber(arg) {
  return typeof arg === 'number';
}
exports.isNumber = isNumber;

function isString(arg) {
  return typeof arg === 'string';
}
exports.isString = isString;

function isSymbol(arg) {
  return typeof arg === 'symbol';
}
exports.isSymbol = isSymbol;

function isUndefined(arg) {
  return arg === void 0;
}
exports.isUndefined = isUndefined;

function isRegExp(re) {
  return isObject(re) && objectToString(re) === '[object RegExp]';
}
exports.isRegExp = isRegExp;

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}
exports.isObject = isObject;

function isDate(d) {
  return isObject(d) && objectToString(d) === '[object Date]';
}
exports.isDate = isDate;

function isError(e) {
  return isObject(e) &&
      (objectToString(e) === '[object Error]' || e instanceof Error);
}
exports.isError = isError;

function isFunction(arg) {
  return typeof arg === 'function';
}
exports.isFunction = isFunction;

function isPrimitive(arg) {
  return arg === null ||
         typeof arg === 'boolean' ||
         typeof arg === 'number' ||
         typeof arg === 'string' ||
         typeof arg === 'symbol' ||  // ES6 symbol
         typeof arg === 'undefined';
}
exports.isPrimitive = isPrimitive;

exports.isBuffer = require('./support/isBuffer');

function objectToString(o) {
  return Object.prototype.toString.call(o);
}


function pad(n) {
  return n < 10 ? '0' + n.toString(10) : n.toString(10);
}


var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep',
              'Oct', 'Nov', 'Dec'];

// 26 Feb 16:19:34
function timestamp() {
  var d = new Date();
  var time = [pad(d.getHours()),
              pad(d.getMinutes()),
              pad(d.getSeconds())].join(':');
  return [d.getDate(), months[d.getMonth()], time].join(' ');
}


// log is just a thin wrapper to console.log that prepends a timestamp
exports.log = function() {
  console.log('%s - %s', timestamp(), exports.format.apply(exports, arguments));
};


/**
 * Inherit the prototype methods from one constructor into another.
 *
 * The Function.prototype.inherits from lang.js rewritten as a standalone
 * function (not on Function.prototype). NOTE: If this file is to be loaded
 * during bootstrapping this function needs to be rewritten using some native
 * functions as prototype setup using normal JavaScript does not work as
 * expected during bootstrapping (see mirror.js in r114903).
 *
 * @param {function} ctor Constructor function which needs to inherit the
 *     prototype.
 * @param {function} superCtor Constructor function to inherit prototype from.
 */
exports.inherits = require('inherits');

exports._extend = function(origin, add) {
  // Don't do anything if add isn't an object
  if (!add || !isObject(add)) return origin;

  var keys = Object.keys(add);
  var i = keys.length;
  while (i--) {
    origin[keys[i]] = add[keys[i]];
  }
  return origin;
};

function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

}).call(this,require('_process'),typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./support/isBuffer":16,"_process":15,"inherits":14}]},{},[3]);
