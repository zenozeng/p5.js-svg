(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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

},{"util/":8}],2:[function(require,module,exports){
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

},{}],3:[function(require,module,exports){
// shim for using process in browser

var process = module.exports = {};
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = setTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    clearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        setTimeout(drainQueue, 0);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

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

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],4:[function(require,module,exports){
/*!!
 *  Canvas 2 Svg v1.0.9
 *  A low level canvas to SVG converter. Uses a mock canvas context to build an SVG document.
 *
 *  Licensed under the MIT license:
 *  http://www.opensource.org/licenses/mit-license.php
 *
 *  Author:
 *  Kerry Liu
 *
 *  Copyright (c) 2014 Gliffy Inc.
 */

;(function() {
    "use strict";

    var STYLES, ctx, CanvasGradient, CanvasPattern, namedEntities;

    //helper function to format a string
    function format(str, args) {
        var keys = Object.keys(args), i;
        for (i=0; i<keys.length; i++) {
            str = str.replace(new RegExp("\\{" + keys[i] + "\\}", "gi"), args[keys[i]]);
        }
        return str;
    }

    //helper function that generates a random string
    function randomString(holder) {
        var chars, randomstring, i;
        if (!holder) {
            throw new Error("cannot create a random attribute name for an undefined object");
        }
        chars = "ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";
        randomstring = "";
        do {
            randomstring = "";
            for (i = 0; i < 12; i++) {
                randomstring += chars[Math.floor(Math.random() * chars.length)];
            }
        } while (holder[randomstring]);
        return randomstring;
    }

    //helper function to map named to numbered entities
    function createNamedToNumberedLookup(items, radix) {
        var i, entity, lookup = {}, base10, base16;
        items = items.split(',');
        radix = radix || 10;
        // Map from named to numbered entities.
        for (i = 0; i < items.length; i += 2) {
            entity = '&' + items[i + 1] + ';';
            base10 = parseInt(items[i], radix);
            lookup[entity] = '&#'+base10+';';
        }
        //FF and IE need to create a regex from hex values ie &nbsp; == \xa0
        lookup["\\xa0"] = '&#160;';
        return lookup;
    }

    //helper function to map canvas-textAlign to svg-textAnchor
    function getTextAnchor(textAlign) {
        //TODO: support rtl languages
        var mapping = {"left":"start", "right":"end", "center":"middle", "start":"start", "end":"end"};
        return mapping[textAlign] || mapping.start;
    }

    //helper function to map canvas-textBaseline to svg-dominantBaseline
    function getDominantBaseline(textBaseline) {
        //INFO: not supported in all browsers
        var mapping = {"alphabetic": "alphabetic", "hanging": "hanging", "top":"text-before-edge", "bottom":"text-after-edge", "middle":"central"};
        return mapping[textBaseline] || mapping.alphabetic;
    }

    // Unpack entities lookup where the numbers are in radix 32 to reduce the size
    // entity mapping courtesy of tinymce
    namedEntities = createNamedToNumberedLookup(
        '50,nbsp,51,iexcl,52,cent,53,pound,54,curren,55,yen,56,brvbar,57,sect,58,uml,59,copy,' +
            '5a,ordf,5b,laquo,5c,not,5d,shy,5e,reg,5f,macr,5g,deg,5h,plusmn,5i,sup2,5j,sup3,5k,acute,' +
            '5l,micro,5m,para,5n,middot,5o,cedil,5p,sup1,5q,ordm,5r,raquo,5s,frac14,5t,frac12,5u,frac34,' +
            '5v,iquest,60,Agrave,61,Aacute,62,Acirc,63,Atilde,64,Auml,65,Aring,66,AElig,67,Ccedil,' +
            '68,Egrave,69,Eacute,6a,Ecirc,6b,Euml,6c,Igrave,6d,Iacute,6e,Icirc,6f,Iuml,6g,ETH,6h,Ntilde,' +
            '6i,Ograve,6j,Oacute,6k,Ocirc,6l,Otilde,6m,Ouml,6n,times,6o,Oslash,6p,Ugrave,6q,Uacute,' +
            '6r,Ucirc,6s,Uuml,6t,Yacute,6u,THORN,6v,szlig,70,agrave,71,aacute,72,acirc,73,atilde,74,auml,' +
            '75,aring,76,aelig,77,ccedil,78,egrave,79,eacute,7a,ecirc,7b,euml,7c,igrave,7d,iacute,7e,icirc,' +
            '7f,iuml,7g,eth,7h,ntilde,7i,ograve,7j,oacute,7k,ocirc,7l,otilde,7m,ouml,7n,divide,7o,oslash,' +
            '7p,ugrave,7q,uacute,7r,ucirc,7s,uuml,7t,yacute,7u,thorn,7v,yuml,ci,fnof,sh,Alpha,si,Beta,' +
            'sj,Gamma,sk,Delta,sl,Epsilon,sm,Zeta,sn,Eta,so,Theta,sp,Iota,sq,Kappa,sr,Lambda,ss,Mu,' +
            'st,Nu,su,Xi,sv,Omicron,t0,Pi,t1,Rho,t3,Sigma,t4,Tau,t5,Upsilon,t6,Phi,t7,Chi,t8,Psi,' +
            't9,Omega,th,alpha,ti,beta,tj,gamma,tk,delta,tl,epsilon,tm,zeta,tn,eta,to,theta,tp,iota,' +
            'tq,kappa,tr,lambda,ts,mu,tt,nu,tu,xi,tv,omicron,u0,pi,u1,rho,u2,sigmaf,u3,sigma,u4,tau,' +
            'u5,upsilon,u6,phi,u7,chi,u8,psi,u9,omega,uh,thetasym,ui,upsih,um,piv,812,bull,816,hellip,' +
            '81i,prime,81j,Prime,81u,oline,824,frasl,88o,weierp,88h,image,88s,real,892,trade,89l,alefsym,' +
            '8cg,larr,8ch,uarr,8ci,rarr,8cj,darr,8ck,harr,8dl,crarr,8eg,lArr,8eh,uArr,8ei,rArr,8ej,dArr,' +
            '8ek,hArr,8g0,forall,8g2,part,8g3,exist,8g5,empty,8g7,nabla,8g8,isin,8g9,notin,8gb,ni,8gf,prod,' +
            '8gh,sum,8gi,minus,8gn,lowast,8gq,radic,8gt,prop,8gu,infin,8h0,ang,8h7,and,8h8,or,8h9,cap,8ha,cup,' +
            '8hb,int,8hk,there4,8hs,sim,8i5,cong,8i8,asymp,8j0,ne,8j1,equiv,8j4,le,8j5,ge,8k2,sub,8k3,sup,8k4,' +
            'nsub,8k6,sube,8k7,supe,8kl,oplus,8kn,otimes,8l5,perp,8m5,sdot,8o8,lceil,8o9,rceil,8oa,lfloor,8ob,' +
            'rfloor,8p9,lang,8pa,rang,9ea,loz,9j0,spades,9j3,clubs,9j5,hearts,9j6,diams,ai,OElig,aj,oelig,b0,' +
            'Scaron,b1,scaron,bo,Yuml,m6,circ,ms,tilde,802,ensp,803,emsp,809,thinsp,80c,zwnj,80d,zwj,80e,lrm,' +
            '80f,rlm,80j,ndash,80k,mdash,80o,lsquo,80p,rsquo,80q,sbquo,80s,ldquo,80t,rdquo,80u,bdquo,810,dagger,' +
            '811,Dagger,81g,permil,81p,lsaquo,81q,rsaquo,85c,euro', 32);


    //Some basic mappings for attributes and default values.
    STYLES = {
        "strokeStyle":{
            svgAttr : "stroke", //corresponding svg attribute
            canvas : "#000000", //canvas default
            svg : "none",       //svg default
            apply : "stroke"    //apply on stroke() or fill()
        },
        "fillStyle":{
            svgAttr : "fill",
            canvas : "#000000",
            svg : null, //svg default is black, but we need to special case this to handle canvas stroke without fill
            apply : "fill"
        },
        "lineCap":{
            svgAttr : "stroke-linecap",
            canvas : "butt",
            svg : "butt",
            apply : "stroke"
        },
        "lineJoin":{
            svgAttr : "stroke-linejoin",
            canvas : "miter",
            svg : "miter",
            apply : "stroke"
        },
        "miterLimit":{
            svgAttr : "stroke-miterlimit",
            canvas : 10,
            svg : 4,
            apply : "stroke"
        },
        "lineWidth":{
            svgAttr : "stroke-width",
            canvas : 1,
            svg : 1,
            apply : "stroke"
        },
        "globalAlpha": {
            svgAttr : "opacity",
            canvas : 1,
            svg : 1,
            apply : "fill stroke"
        },
        "font":{
            //font converts to multiple svg attributes, there is custom logic for this
            canvas : "10px sans-serif"
        },
        "shadowColor":{
            canvas : "#000000"
        },
        "shadowOffsetX":{
            canvas : 0
        },
        "shadowOffsetY":{
            canvas : 0
        },
        "shadowBlur":{
            canvas : 0
        },
        "textAlign":{
            canvas : "start"
        },
        "textBaseline":{
            canvas : "alphabetic"
        }
    };

    /**
     *
     * @param gradientNode - reference to the gradient
     * @constructor
     */
    CanvasGradient = function(gradientNode) {
        this.__root = gradientNode;
    };

    /**
     * Adds a color stop to the gradient root
     */
    CanvasGradient.prototype.addColorStop = function(offset, color) {
        var stop = this.__createElement("stop"), regex, matches;
        stop.setAttribute("offset", offset);
        if(color.indexOf("rgba") !== -1) {
            //separate alpha value, since webkit can't handle it
            regex = /rgba\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d?\.?\d*)\s*\)/gi;
            matches = regex.exec(color);
            stop.setAttribute("stop-color", format("rgb({r},{g},{b})", {r:matches[1], g:matches[2], b:matches[3]}));
            stop.setAttribute("stop-opacity", matches[4]);
        } else {
            stop.setAttribute("stop-color", color);
        }
        this.__root.appendChild(stop);
    };

    CanvasPattern = function(pattern, ctx) {
        this.__root = pattern;
        this.__ctx = ctx;
    };

    /**
     * The mock canvas context
     * @param o - options include:
     * width - width of your canvas (defaults to 500)
     * height - height of your canvas (defaults to 500)
     * enableMirroring - enables canvas mirroring (get image data) (defaults to false)
     */
    ctx = function(o) {

        var defaultOptions = { width:500, height:500, enableMirroring : false }, options;

        //keep support for this way of calling C2S: new C2S(width,height)
        if(arguments.length > 1) {
            options = defaultOptions;
            options.width = arguments[0];
            options.height = arguments[1];
        } else if( !o ) {
            options = defaultOptions;
        } else {
            options = o;
        }

        if(!(this instanceof ctx)) {
            //did someone call this without new?
            return new ctx(options);
        }

        //setup options
        this.width = options.width || defaultOptions.width;
        this.height = options.height || defaultOptions.height;
        this.enableMirroring = options.enableMirroring !== undefined ? options.enableMirroring : defaultOptions.enableMirroring;

        this.canvas = this;   ///point back to this instance!
        this.__canvas = document.createElement("canvas");
        this.__ctx = this.__canvas.getContext("2d");

        this.__setDefaultStyles();
        this.__stack = [this.__getStyleState()];
        this.__groupStack = [];

        //the root svg element
        this.__root = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        this.__root.setAttribute("version", 1.1);
        this.__root.setAttribute("xmlns", "http://www.w3.org/2000/svg");
        this.__root.setAttributeNS("http://www.w3.org/2000/xmlns/", "xmlns:xlink", "http://www.w3.org/1999/xlink");
        this.__root.setAttribute("width", this.width);
        this.__root.setAttribute("height", this.height);

        //make sure we don't generate the same ids in defs
        this.__ids = {};

        //defs tag
        this.__defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
        this.__root.appendChild(this.__defs);

        //also add a group child. the svg element can't use the transform attribute
        this.__currentElement = document.createElementNS("http://www.w3.org/2000/svg", "g");
        this.__root.appendChild(this.__currentElement);
    };

    /**
     * Creates the specified svg element
     * @private
     */
    ctx.prototype.__createElement = function(elementName, properties, resetFill) {
        if (typeof properties === "undefined") {
            properties = {};
        }

        var element = document.createElementNS("http://www.w3.org/2000/svg", elementName),
            keys = Object.keys(properties), i, key;
        if(resetFill) {
            //if fill or stroke is not specified, the svg element should not display. By default SVG's fill is black.
            element.setAttribute("fill", "none");
            element.setAttribute("stroke", "none");
        }
        for(i=0; i<keys.length; i++) {
            key = keys[i];
            element.setAttribute(key, properties[key]);
        }
        return element;
    };

    /**
     * Applies default canvas styles to the context
     * @private
     */
    ctx.prototype.__setDefaultStyles = function() {
        //default 2d canvas context properties see:http://www.w3.org/TR/2dcontext/
        var keys = Object.keys(STYLES), i, key;
        for(i=0; i<keys.length; i++) {
            key = keys[i];
            this[key] = STYLES[key].canvas;
        }
    };

    /**
     * Applies styles on restore
     * @param styleState
     * @private
     */
    ctx.prototype.__applyStyleState = function(styleState) {
        var keys = Object.keys(styleState), i, key;
        for(i=0; i<keys.length; i++) {
            key = keys[i];
            this[key] = styleState[key];
        }
    };

    /**
     * Gets the current style state
     * @return {Object}
     * @private
     */
    ctx.prototype.__getStyleState = function() {
        var i, styleState = {}, keys = Object.keys(STYLES), key;
        for(i=0; i<keys.length; i++) {
            key = keys[i];
            styleState[key] = this[key];
        }
        return styleState;
    };

    /**
     * Apples the current styles to the current SVG element. On "ctx.fill" or "ctx.stroke"
     * @param type
     * @private
     */
    ctx.prototype.__applyStyleToCurrentElement = function(type) {
        var keys = Object.keys(STYLES), i, style, value, id, regex, matches;
        for(i=0; i<keys.length; i++) {
            style = STYLES[keys[i]];
            value = this[keys[i]];
            if(style.apply) {
                //is this a gradient or pattern?
                if(style.apply.indexOf("fill")!==-1 && value instanceof CanvasPattern) {
                    //pattern
                    if(value.__ctx) {
                        //copy over defs
                        while(value.__ctx.__defs.childNodes.length) {
                            id = value.__ctx.__defs.childNodes[0].getAttribute("id");
                            this.__ids[id] = id;
                            this.__defs.appendChild(value.__ctx.__defs.childNodes[0]);
                        }
                    }
                    this.__currentElement.setAttribute("fill", format("url(#{id})", {id:value.__root.getAttribute("id")}));
                }
                else if(style.apply.indexOf("fill")!==-1 && value instanceof CanvasGradient) {
                    //gradient
                    this.__currentElement.setAttribute("fill", format("url(#{id})", {id:value.__root.getAttribute("id")}));
                } else if(style.apply.indexOf(type)!==-1 && style.svg !== value) {
                    if((style.svgAttr === "stroke" || style.svgAttr === "fill") && value.indexOf("rgba") !== -1) {
                        //separate alpha value, since illustrator can't handle it
                        regex = /rgba\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d?\.?\d*)\s*\)/gi;
                        matches = regex.exec(value);
                        this.__currentElement.setAttribute(style.svgAttr, format("rgb({r},{g},{b})", {r:matches[1], g:matches[2], b:matches[3]}));
                        this.__currentElement.setAttribute(style.svgAttr+"-opacity", matches[4]);
                    } else {
                        //otherwise only update attribute if right type, and not svg default
                        this.__currentElement.setAttribute(style.svgAttr, value);
                    }
                }
            }
        }

    };

    /**
     * Will return the closest group or svg node. May return the current element.
     * @private
     */
    ctx.prototype.__closestGroupOrSvg = function(node) {
        node = node || this.__currentElement;
        if(node.nodeName === "g" || node.nodeName === "svg") {
            return node;
        } else {
            return this.__closestGroupOrSvg(node.parentNode);
        }
    };

    /**
     * Returns the serialized value of the svg so far
     * @param fixNamedEntities - Standalone SVG doesn't support named entities, which document.createTextNode encodes.
     *                           If true, we attempt to find all named entities and encode it as a numeric entity.
     * @return serialized svg
     */
    ctx.prototype.getSerializedSvg = function(fixNamedEntities) {
        var serialized = new XMLSerializer().serializeToString(this.__root),
            keys, i, key, value, regexp, xmlns;

        //IE search for a duplicate xmnls because they didn't implement setAttributeNS correctly
        xmlns = /xmlns="http:\/\/www\.w3\.org\/2000\/svg".+xmlns="http:\/\/www\.w3\.org\/2000\/svg/gi;
        if(xmlns.test(serialized)) {
            serialized = serialized.replace('xmlns="http://www.w3.org/2000/svg','xmlns:xlink="http://www.w3.org/1999/xlink');
        }

        if(fixNamedEntities) {
            keys = Object.keys(namedEntities);
            //loop over each named entity and replace with the proper equivalent.
            for(i=0; i<keys.length; i++) {
                key = keys[i];
                value = namedEntities[key];
                regexp = new RegExp(key, "gi");
                if(regexp.test(serialized)) {
                    serialized = serialized.replace(regexp, value);
                }
            }
        }

        return serialized;
    };


    /**
     * Returns the root svg
     * @return
     */
    ctx.prototype.getSvg = function() {
        return this.__root;
    };
    /**
     * Will generate a group tag.
     */
    ctx.prototype.save = function() {
        var group = this.__createElement("g"), parent = this.__closestGroupOrSvg();
        this.__groupStack.push(parent);
        parent.appendChild(group);
        this.__currentElement = group;
        this.__stack.push(this.__getStyleState());
    };
    /**
     * Sets current element to parent, or just root if already root
     */
    ctx.prototype.restore = function(){
        this.__currentElement = this.__groupStack.pop();
        var state = this.__stack.pop();
        this.__applyStyleState(state);

    };

    /**
     * Helper method to add transform
     * @private
     */
    ctx.prototype.__addTransform = function(t) {

        //if the current element has siblings, add another group
        var parent = this.__closestGroupOrSvg();
        if(parent.childNodes.length > 0) {
            var group = this.__createElement("g");
            parent.appendChild(group);
            this.__currentElement = group;
        }

        var transform = this.__currentElement.getAttribute("transform");
        if(transform) {
            transform += " ";
        } else {
            transform = "";
        }
        transform += t;
        this.__currentElement.setAttribute("transform", transform);
    };

    /**
     *  scales the current element
     */
    ctx.prototype.scale = function(x, y) {
        if(y === undefined) {
            y = x;
        }
        this.__addTransform(format("scale({x},{y})", {x:x, y:y}));
    };

    /**
     * rotates the current element
     */
    ctx.prototype.rotate = function(angle){
        var degrees = (angle * 180 / Math.PI);
        this.__addTransform(format("rotate({angle},{cx},{cy})", {angle:degrees, cx:0, cy:0}));
    };

    /**
     * translates the current element
     */
    ctx.prototype.translate = function(x, y){
        this.__addTransform(format("translate({x},{y})", {x:x,y:y}));
    };

    /**
     * applies a transform to the current element
     */
    ctx.prototype.transform = function(a, b, c, d, e, f){
        this.__addTransform(format("matrix({a},{b},{c},{d},{e},{f})", {a:a, b:b, c:c, d:d, e:e, f:f}));
    };

    /**
     * Create a new Path Element
     */
    ctx.prototype.beginPath = function(){
        var path, parent;

        // Note that there is only one current default path, it is not part of the drawing state.
        // See also: https://html.spec.whatwg.org/multipage/scripting.html#current-default-path
        this.__currentDefaultPath = "";
        this.__currentPosition = {};

        path = this.__createElement("path", {}, true);
        parent = this.__closestGroupOrSvg();
        parent.appendChild(path);
        this.__currentElement = path;
    };

    /**
     * Helper function to apply currentDefaultPath to current path element
     * @private
     */
    ctx.prototype.__applyCurrentDefaultPath = function() {
        if(this.__currentElement.nodeName === "path") {
            var d = this.__currentDefaultPath;
            this.__currentElement.setAttribute("d", d);
        } else {
            throw new Error("Attempted to apply path command to node " + this.__currentElement.nodeName);
        }
    };

    /**
     * Helper function to add path command
     * @private
     */
    ctx.prototype.__addPathCommand = function(command){
        this.__currentDefaultPath += " ";
        this.__currentDefaultPath += command;
    };

    /**
     * Adds the move command to the current path element,
     * if the currentPathElement is not empty create a new path element
     */
    ctx.prototype.moveTo = function(x,y){
        if(this.__currentElement.nodeName !== "path") {
            this.beginPath();
        }

        // creates a new subpath with the given point
        this.__currentPosition = {x: x, y: y};
        this.__addPathCommand(format("M {x} {y}", {x:x, y:y}));
    };

    /**
     * Closes the current path
     */
    ctx.prototype.closePath = function(){
        this.__addPathCommand("Z");
    };

    /**
     * Adds a line to command
     */
    ctx.prototype.lineTo = function(x, y){
        this.__currentPosition = {x: x, y: y};
        if (this.__currentDefaultPath.indexOf('M') > -1) {
            this.__addPathCommand(format("L {x} {y}", {x:x, y:y}));
        } else {
            this.__addPathCommand(format("M {x} {y}", {x:x, y:y}));
        }
    };

    /**
     * Add a bezier command
     */
    ctx.prototype.bezierCurveTo = function(cp1x, cp1y, cp2x, cp2y, x, y) {
        this.__currentPosition = {x: x, y: y};
        this.__addPathCommand(format("C {cp1x} {cp1y} {cp2x} {cp2y} {x} {y}",
            {cp1x:cp1x, cp1y:cp1y, cp2x:cp2x, cp2y:cp2y, x:x, y:y}));
    };

    /**
     * Adds a quadratic curve to command
     */
    ctx.prototype.quadraticCurveTo = function(cpx, cpy, x, y){
        this.__currentPosition = {x: x, y: y};
        this.__addPathCommand(format("Q {cpx} {cpy} {x} {y}", {cpx:cpx, cpy:cpy, x:x, y:y}));
    };


    /**
     * Return a new normalized vector of given vector
     */
    var normalize = function(vector) {
        var len = Math.sqrt(vector[0] * vector[0] + vector[1] * vector[1]);
        return [vector[0] / len, vector[1] / len];
    };

    /**
     * Adds the arcTo to the current path
     *
     * @see http://www.w3.org/TR/2015/WD-2dcontext-20150514/#dom-context-2d-arcto
     */
    ctx.prototype.arcTo = function(x1, y1, x2, y2, radius) {
        // Let the point (x0, y0) be the last point in the subpath.
        var x0 = this.__currentPosition && this.__currentPosition.x;
        var y0 = this.__currentPosition && this.__currentPosition.y;

        // First ensure there is a subpath for (x1, y1).
        if (typeof x0 == "undefined" || typeof y0 == "undefined") {
            return;
        }

        // Negative values for radius must cause the implementation to throw an IndexSizeError exception.
        if (radius < 0) {
            throw new Error("IndexSizeError: The radius provided (" + radius + ") is negative.");
        }

        // If the point (x0, y0) is equal to the point (x1, y1),
        // or if the point (x1, y1) is equal to the point (x2, y2),
        // or if the radius radius is zero,
        // then the method must add the point (x1, y1) to the subpath,
        // and connect that point to the previous point (x0, y0) by a straight line.
        if (((x0 === x1) && (y0 === y1))
            || ((x1 === x2) && (y1 === y2))
            || (radius === 0)) {
            this.lineTo(x1, y1);
            return;
        }

        // Otherwise, if the points (x0, y0), (x1, y1), and (x2, y2) all lie on a single straight line,
        // then the method must add the point (x1, y1) to the subpath,
        // and connect that point to the previous point (x0, y0) by a straight line.
        var unit_vec_p1_p0 = normalize([x0 - x1, y0 - y1]);
        var unit_vec_p1_p2 = normalize([x2 - x1, y2 - y1]);
        if (unit_vec_p1_p0[0] * unit_vec_p1_p2[1] === unit_vec_p1_p0[1] * unit_vec_p1_p2[0]) {
            this.lineTo(x1, y1);
            return;
        }

        // Otherwise, let The Arc be the shortest arc given by circumference of the circle that has radius radius,
        // and that has one point tangent to the half-infinite line that crosses the point (x0, y0) and ends at the point (x1, y1),
        // and that has a different point tangent to the half-infinite line that ends at the point (x1, y1), and crosses the point (x2, y2).
        // The points at which this circle touches these two lines are called the start and end tangent points respectively.

        // note that both vectors are unit vectors, so the length is 1
        var cos = (unit_vec_p1_p0[0] * unit_vec_p1_p2[0] + unit_vec_p1_p0[1] * unit_vec_p1_p2[1]);
        var theta = Math.acos(Math.abs(cos));

        // Calculate origin
        var unit_vec_p1_origin = normalize([
            unit_vec_p1_p0[0] + unit_vec_p1_p2[0],
            unit_vec_p1_p0[1] + unit_vec_p1_p2[1]
        ]);
        var len_p1_origin = radius / Math.sin(theta / 2);
        var x = x1 + len_p1_origin * unit_vec_p1_origin[0];
        var y = y1 + len_p1_origin * unit_vec_p1_origin[1];

        // Calculate start angle and end angle
        // rotate 90deg clockwise (note that y axis points to its down)
        var unit_vec_origin_start_tangent = [
            -unit_vec_p1_p0[1],
            unit_vec_p1_p0[0]
        ];
        // rotate 90deg counter clockwise (note that y axis points to its down)
        var unit_vec_origin_end_tangent = [
            unit_vec_p1_p2[1],
            -unit_vec_p1_p2[0]
        ];
        var getAngle = function(vector) {
            // get angle (clockwise) between vector and (1, 0)
            var x = vector[0];
            var y = vector[1];
            if (y >= 0) { // note that y axis points to its down
                return Math.acos(x);
            } else {
                return -Math.acos(x);
            }
        };
        var startAngle = getAngle(unit_vec_origin_start_tangent);
        var endAngle = getAngle(unit_vec_origin_end_tangent);

        // Connect the point (x0, y0) to the start tangent point by a straight line
        this.lineTo(x + unit_vec_origin_start_tangent[0] * radius,
                    y + unit_vec_origin_start_tangent[1] * radius);

        // Connect the start tangent point to the end tangent point by arc
        // and adding the end tangent point to the subpath.
        this.arc(x, y, radius, startAngle, endAngle);
    };

    /**
     * Sets the stroke property on the current element
     */
    ctx.prototype.stroke = function(){
        if(this.__currentElement.nodeName === "path") {
            this.__currentElement.setAttribute("paint-order", "fill stroke markers");
        }
        this.__applyCurrentDefaultPath();
        this.__applyStyleToCurrentElement("stroke");
    };

    /**
     * Sets fill properties on the current element
     */
    ctx.prototype.fill = function(){
        if(this.__currentElement.nodeName === "path") {
            this.__currentElement.setAttribute("paint-order", "stroke fill markers");
        }
        this.__applyCurrentDefaultPath();
        this.__applyStyleToCurrentElement("fill");
    };

    /**
     *  Adds a rectangle to the path.
     */
    ctx.prototype.rect = function(x, y, width, height){
        if(this.__currentElement.nodeName !== "path") {
            this.beginPath();
        }
        this.moveTo(x, y);
        this.lineTo(x+width, y);
        this.lineTo(x+width, y+height);
        this.lineTo(x, y+height);
        this.lineTo(x, y);
        this.closePath();
    };


    /**
     * adds a rectangle element
     */
    ctx.prototype.fillRect = function(x, y, width, height){
        var rect, parent;
        rect = this.__createElement("rect", {
            x : x,
            y : y,
            width : width,
            height : height
        }, true);
        parent = this.__closestGroupOrSvg();
        parent.appendChild(rect);
        this.__currentElement = rect;
        this.__applyStyleToCurrentElement("fill");
    };

    /**
     * Draws a rectangle with no fill
     * @param x
     * @param y
     * @param width
     * @param height
     */
    ctx.prototype.strokeRect = function(x, y, width, height){
        var rect, parent;
        rect = this.__createElement("rect", {
            x : x,
            y : y,
            width : width,
            height : height
        }, true);
        parent = this.__closestGroupOrSvg();
        parent.appendChild(rect);
        this.__currentElement = rect;
        this.__applyStyleToCurrentElement("stroke");
    };


    /**
     * "Clears" a canvas by just drawing a white rectangle in the current group.
     */
    ctx.prototype.clearRect = function(x, y, width, height) {
        var rect, parent = this.__closestGroupOrSvg();
        rect = this.__createElement("rect", {
            x : x,
            y : y,
            width : width,
            height : height,
            fill : "#FFFFFF"
        }, true);
        parent.appendChild(rect);
    };

    /**
     * Adds a linear gradient to a defs tag.
     * Returns a canvas gradient object that has a reference to it's parent def
     */
    ctx.prototype.createLinearGradient = function(x1, y1, x2, y2){
        var grad = this.__createElement("linearGradient", {
            id : randomString(this.__ids),
            x1 : x1+"px",
            x2 : x2+"px",
            y1 : y1+"px",
            y2 : y2+"px",
            "gradientUnits" : "userSpaceOnUse"
        }, false);
        this.__defs.appendChild(grad);
        return new CanvasGradient(grad);
    };

    /**
     * Adds a radial gradient to a defs tag.
     * Returns a canvas gradient object that has a reference to it's parent def
     */
    ctx.prototype.createRadialGradient = function(x0, y0, r0, x1, y1, r1){
        var grad = this.__createElement("radialGradient", {
            id : randomString(this.__ids),
            cx : x1+"px",
            cy : y1+"px",
            r  : r1+"px",
            fx : x0+"px",
            fy : y0+"px",
            "gradientUnits" : "userSpaceOnUse"
        }, false);
        this.__defs.appendChild(grad);
        return new CanvasGradient(grad);

    };

    /**
     * Parses the font string and returns svg mapping
     * @private
     */
    ctx.prototype.__parseFont = function() {
        var regex = /^\s*(?=(?:(?:[-a-z]+\s*){0,2}(italic|oblique))?)(?=(?:(?:[-a-z]+\s*){0,2}(small-caps))?)(?=(?:(?:[-a-z]+\s*){0,2}(bold(?:er)?|lighter|[1-9]00))?)(?:(?:normal|\1|\2|\3)\s*){0,3}((?:xx?-)?(?:small|large)|medium|smaller|larger|[.\d]+(?:\%|in|[cem]m|ex|p[ctx]))(?:\s*\/\s*(normal|[.\d]+(?:\%|in|[cem]m|ex|p[ctx])))?\s*([-,\"\sa-z]+?)\s*$/i;
        var fontPart = regex.exec( this.font );
        var data = {
            style : fontPart[1] || 'normal',
            size : fontPart[4] || '10px',
            family : fontPart[6] || 'sans-serif',
            weight: fontPart[3] || 'normal',
            decoration : fontPart[2] || 'normal',
            href : null
        };

        //canvas doesn't support underline natively, but we can pass this attribute
        if(this.__fontUnderline === "underline") {
            data.decoration = "underline";
        }

        //canvas also doesn't support linking, but we can pass this as well
        if(this.__fontHref) {
            data.href = this.__fontHref;
        }

        return data;
    };

    /**
     * Helper to link text fragments
     * @param font
     * @param element
     * @return {*}
     * @private
     */
    ctx.prototype.__wrapTextLink = function(font, element) {
        if(font.href) {
            var a = this.__createElement("a");
            a.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", font.href);
            a.appendChild(element);
            return a;
        }
        return element;
    };

    /**
     * Fills or strokes text
     * @param text
     * @param x
     * @param y
     * @param action - stroke or fill
     * @private
     */
    ctx.prototype.__applyText = function(text, x, y, action) {
        var font = this.__parseFont(),
            parent = this.__closestGroupOrSvg(),
            textElement = this.__createElement("text", {
                "font-family" : font.family,
                "font-size" : font.size,
                "font-style" : font.style,
                "font-weight" : font.weight,
                "text-decoration" : font.decoration,
                "x" : x,
                "y" : y,
                "text-anchor": getTextAnchor(this.textAlign),
                "dominant-baseline": getDominantBaseline(this.textBaseline)
            }, true);

        textElement.appendChild(document.createTextNode(text));
        this.__currentElement = textElement;
        this.__applyStyleToCurrentElement(action);
        parent.appendChild(this.__wrapTextLink(font,textElement));
    };

    /**
     * Creates a text element
     * @param text
     * @param x
     * @param y
     */
    ctx.prototype.fillText = function(text, x, y){
        this.__applyText(text, x, y, "fill");
    };

    /**
     * Strokes text
     * @param text
     * @param x
     * @param y
     */
    ctx.prototype.strokeText = function(text, x, y){
        this.__applyText(text, x, y, "stroke");
    };

    /**
     * No need to implement this for svg.
     * @param text
     * @return {TextMetrics}
     */
    ctx.prototype.measureText = function(text){
        this.__ctx.font = this.font;
        return this.__ctx.measureText(text);
    };

    /**
     *  Arc command!
     */
    ctx.prototype.arc = function(x, y, radius, startAngle, endAngle, counterClockwise) {
        startAngle = startAngle % (2*Math.PI);
        endAngle = endAngle % (2*Math.PI);
        if(startAngle === endAngle) {
            //circle time! subtract some of the angle so svg is happy (svg elliptical arc can't draw a full circle)
            endAngle = ((endAngle + (2*Math.PI)) - 0.001 * (counterClockwise ? -1 : 1)) % (2*Math.PI);
        }
        var endX = x+radius*Math.cos(endAngle),
            endY = y+radius*Math.sin(endAngle),
            startX = x+radius*Math.cos(startAngle),
            startY = y+radius*Math.sin(startAngle),
            sweepFlag = counterClockwise ? 0 : 1,
            largeArcFlag = 0,
            diff = endAngle - startAngle;

        // https://github.com/gliffy/canvas2svg/issues/4
        if(diff < 0) {
            diff += 2*Math.PI;
        }

        if(counterClockwise) {
            largeArcFlag = diff > Math.PI ? 0 : 1;
        } else {
            largeArcFlag = diff > Math.PI ? 1 : 0;
        }

        this.lineTo(startX, startY);
        this.__addPathCommand(format("A {rx} {ry} {xAxisRotation} {largeArcFlag} {sweepFlag} {endX} {endY}",
            {rx:radius, ry:radius, xAxisRotation:0, largeArcFlag:largeArcFlag, sweepFlag:sweepFlag, endX:endX, endY:endY}));

        this.__currentPosition = {x: endX, y: endY};
    };

    /**
     * Generates a ClipPath from the clip command.
     */
    ctx.prototype.clip = function(){
        var group = this.__closestGroupOrSvg(),
            clipPath = this.__createElement("clipPath"),
            id =  randomString(this.__ids),
            newGroup = this.__createElement("g");

        group.removeChild(this.__currentElement);
        clipPath.setAttribute("id", id);
        clipPath.appendChild(this.__currentElement);

        this.__defs.appendChild(clipPath);

        //set the clip path to this group
        group.setAttribute("clip-path", format("url(#{id})", {id:id}));

        //clip paths can be scaled and transformed, we need to add another wrapper group to avoid later transformations
        // to this path
        group.appendChild(newGroup);

        this.__currentElement = newGroup;

    };

    /**
     * Draws a canvas, image or mock context to this canvas.
     * Note that all svg dom manipulation uses node.childNodes rather than node.children for IE support.
     * http://www.whatwg.org/specs/web-apps/current-work/multipage/the-canvas-element.html#dom-context-2d-drawimage
     */
    ctx.prototype.drawImage = function(){
        //convert arguments to a real array
        var args = Array.prototype.slice.call(arguments),
            image=args[0],
            dx, dy, dw, dh, sx=0, sy=0, sw, sh, parent, svg, defs, group,
            currentElement, svgImage, canvas, context, id;

        if(args.length === 3) {
            dx = args[1];
            dy = args[2];
            sw = image.width;
            sh = image.height;
            dw = sw;
            dh = sh;
        } else if(args.length === 5) {
            dx = args[1];
            dy = args[2];
            dw = args[3];
            dh = args[4];
            sw = image.width;
            sh = image.height;
        } else if(args.length === 9) {
            sx = args[1];
            sy = args[2];
            sw = args[3];
            sh = args[4];
            dx = args[5];
            dy = args[6];
            dw = args[7];
            dh = args[8];
        } else {
            throw new Error("Inavlid number of arguments passed to drawImage: " + arguments.length);
        }

        parent = this.__closestGroupOrSvg();
        currentElement = this.__currentElement;

        if(image instanceof ctx) {
            //canvas2svg mock canvas context. In the future we may want to clone nodes instead.
            //also I'm currently ignoring dw, dh, sw, sh, sx, sy for a mock context.
            svg = image.getSvg();
            defs = svg.childNodes[0];
            while(defs.childNodes.length) {
                id = defs.childNodes[0].getAttribute("id");
                this.__ids[id] = id;
                this.__defs.appendChild(defs.childNodes[0]);
            }
            group = svg.childNodes[1];
            parent.appendChild(group);
            this.__currentElement = group;
            this.translate(dx, dy);
            this.__currentElement = currentElement;
        } else if(image.nodeName === "CANVAS" || image.nodeName === "IMG") {
            //canvas or image
            svgImage = this.__createElement("image");
            svgImage.setAttribute("width", dw);
            svgImage.setAttribute("height", dh);
            svgImage.setAttribute("preserveAspectRatio", "none");

            if(sx || sy || sw !== image.width || sh !== image.height) {
                //crop the image using a temporary canvas
                canvas = document.createElement("canvas");
                canvas.width = dw;
                canvas.height = dh;
                context = canvas.getContext("2d");
                context.drawImage(image, sx, sy, sw, sh, 0, 0, dw, dh);
                image = canvas;
            }

            svgImage.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href",
                image.nodeName === "CANVAS" ? image.toDataURL() : image.getAttribute("src"));
            parent.appendChild(svgImage);
            this.__currentElement = svgImage;
            this.translate(dx, dy);
            this.__currentElement = currentElement;
        }
    };

    /**
     * Generates a pattern tag
     */
    ctx.prototype.createPattern = function(image, repetition){
        var pattern = document.createElementNS("http://www.w3.org/2000/svg", "pattern"), id = randomString(this.__ids),
            img;
        pattern.setAttribute("id", id);
        pattern.setAttribute("width", image.width);
        pattern.setAttribute("height", image.height);
        if(image.nodeName === "CANVAS" || image.nodeName === "IMG") {
            img = document.createElementNS("http://www.w3.org/2000/svg", "image");
            img.setAttribute("width", image.width);
            img.setAttribute("height", image.height);
            img.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href",
                image.nodeName === "CANVAS" ? image.toDataURL() : image.getAttribute("src"));
            pattern.appendChild(img);
            this.__defs.appendChild(pattern);
        } else if(image instanceof ctx) {
            pattern.appendChild(image.__root.childNodes[1]);
            this.__defs.appendChild(pattern);
        }
        return new CanvasPattern(pattern, this);
    };

    /**
     * Not yet implemented
     */
    ctx.prototype.drawFocusRing = function(){};
    ctx.prototype.createImageData = function(){};
    ctx.prototype.getImageData = function(){};
    ctx.prototype.putImageData = function(){};
    ctx.prototype.globalCompositeOperation = function(){};
    ctx.prototype.setTransform = function(){};

    //add options for alternative namespace
    module.exports = ctx;

}());

},{}],5:[function(require,module,exports){
var C2S = require('./canvas2svg');

var Context = function(width, height, options) {
    C2S.call(this);
    this.__width = width;
    this.__height = height;
    this.generations = [[]]; // used to collect element references for different generations

    var _this = this;
    this.__imageSmoothingEnabled = true;

    ["mozImageSmoothingEnabled",
     "webkitImageSmoothingEnabled",
     "msImageSmoothingEnabled",
     "imageSmoothingEnabled"].forEach(function(k) {
         Object.defineProperty(_this, k, {
             get: function() {
                 return _this.__imageSmoothingEnabled;
             },
             set: function(val) {
                 _this.__imageSmoothingEnabled = val;
             }
         });
     });

    options = options || {};

    ["fillStyle", "strokeStyle"].forEach(function(prop) {
        var key = "__" + prop;
        Object.defineProperty(_this, prop, {
            get: function() {
                return _this[key];
            },
            set: function(val) {
                if (val.indexOf('NaN') > -1) {
                    console.warn("svgcanvas: invalid value for " + prop + ", fail to set it to " + val);
                    return;
                }
                _this[key] = val;
            }
        });
    });


    if (options.debug) {
        this.__history = []; // method history

        var methods = [];
        for(var key in this) {
            if (typeof this[key] === "function") {
                if (key.indexOf('__') !== 0) {
                    if (key !== 'getSerializedSvg') {
                        methods.push(key);
                    }
                }
            }
        }
        ["__fillStyle", "__strokeStyle"].forEach(function(prop) {
            var key = "__debug__" + prop;
            Object.defineProperty(_this, prop, {
                get: function() {
                    return _this[key];
                },
                set: function(val) {
                    var call = prop.replace(/__/g, '') + " = " + val;
                    _this.__history.push(call);
                    _this[key] = val;
                }
            });
        });
        methods.forEach(function(method) {
            var fn = _this[method];
            _this[method] = function() {
                var call = method + '(' + Array.prototype.slice.call(arguments).join(', ') + ');';

                // keep call history
                _this.__history.push(call);
                if (_this.__history.length > 100) {
                    _this.__history.shift();
                }

                return fn.apply(_this, arguments);
            };
        });
    }
};

Context.prototype = Object.create(C2S.prototype);

Context.prototype.scale = function(x, y) {
    if (x === undefined || y === undefined) {
        return;
    } else {
        C2S.prototype.scale.apply(this, arguments);
    }
};

Context.prototype.__createElement = function(elementName, properties, resetFill) {
    if (!this.__imageSmoothingEnabled) {
        // only shape elements can use the shape-rendering attribute
        if (["circle", "ellipse", "line", "path", "polygon", "polyline", "rect"].indexOf(elementName) > -1) {
            properties = properties || {};
            properties["shape-rendering"] = "crispEdges"; // disable anti-aliasing
        }
    }

    var element = C2S.prototype.__createElement.call(this, elementName, properties, resetFill);
    var currentGeneration = this.generations[this.generations.length - 1];
    currentGeneration.push(element);
    return element;
};

Context.prototype.__gc = function() {
    this.generations.push([]);
    var ctx = this;
    // make sure it happens after current job done
    // for example: in p5.js's redraw use setTimeout will make gc called after both save() and restore() called
    setTimeout(function() {
        if (ctx.__groupStack.length > 0) {
            // we are between ctx.save() and ctx.restore(), skip gc
            return;
        }
        if (ctx.__currentElement.nodeName === 'path') {
            // we are still in path, skip gc
            return;
        }
        // keep only latest generation
        while (ctx.generations.length > 1) {
            var elements = ctx.generations.shift();
            var lastCount = 0;
            var count = elements.length;
            while (count > 0) {
                lastCount = count;
                elements = elements.filter(function(elem) {
                    // in case children may from live generation, gc from bottom to top
                    var children = elem.children || elem.childNodes; // childNodes for IE
                    if (children.length === 0) {
                        elem.parentNode.removeChild(elem);
                        return false;
                    } else {
                        return true;
                    }
                });
                count = elements.length;
                if (count === lastCount) {
                    // could not gc more, exit now
                    // save this elements to live generation
                    var liveGeneration = ctx.generations[ctx.generations.length - 1];
                    elements.forEach(function(elem) {
                        liveGeneration.push(elem);
                    });
                    // exit
                    break;
                }
            }
        }
    }, 0);
};

Context.prototype.clearRect = function(x, y, w, h) {
    if (x === 0 && y === 0 && w === this.__width && h === this.__height) {
        // remove all
        this.generations.forEach(function(elems) {
            elems.forEach(function(elem) {
                if (elem) {
                    elem.parentNode.removeChild(elem);
                }
            });
        });
        this.generations = [[]];
        var g = this.__createElement('g');
        this.__root.appendChild(g);
        this.__currentElement = g;
    } else {
        C2S.prototype.clearRect.call(this, x, y, w, h);
    }
};

Context.prototype.fillRect = function(x, y, w, h) {
    if (x === 0 && y === 0 && w === this.__width && h === this.__height) {
        this.__gc();
    }
    C2S.prototype.fillRect.call(this, x, y, w, h);
};

// Simple version of drawImage
// Note that this version does not handle drawing mock context
Context.prototype.drawImage = function() {
    var canvas = document.createElement('canvas');
    canvas.width = this.__width;
    canvas.height = this.__height;
    var args = arguments;
    var ctx = canvas.getContext('2d');
    ctx.drawImage.apply(ctx, args);
    // Note: don't use foreign object,
    // otherwise the saved SVG may be unusable for other application
    var url = canvas.toDataURL('image/png');
    var image = this.__createElement('image', {
        x: 0,
        y: 0,
        width: canvas.width,
        height: canvas.height,
        preserveAspectRatio: 'none'
    });
    var parent = this.__closestGroupOrSvg();
    image.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", url);
    parent.appendChild(image);
};

Context.prototype.getSerializedSvg = null;

module.exports = Context;

},{"./canvas2svg":4}],6:[function(require,module,exports){
var Context = require('./context');

function SVGCanvas(options) {

    var debug = options && options.debug;

    this.ctx = new Context(100, 100, {debug: debug});
    this.svg = this.ctx.__root;

    // sync attributes to svg
    var svg = this.svg;
    var _this = this;

    var wrapper = document.createElement('div');
    wrapper.style.display = 'inline-block';
    wrapper.appendChild(svg);
    this.wrapper = wrapper;

    Object.defineProperty(this, 'className', {
        get: function() {
            return wrapper.getAttribute('class') || '';
        },
        set: function(val) {
            return wrapper.setAttribute('class', val);
        }
    });

    ["width", "height"].forEach(function(prop) {
        Object.defineProperty(_this, prop, {
            get: function() {
                return svg.getAttribute(prop) | 0;
            },
            set: function(val) {
                if (isNaN(val) || (typeof val === "undefined")) {
                    return;
                }
                _this.ctx['__'+prop] = val;
                svg.setAttribute(prop, val);
                return wrapper[prop] = val;
            }
        });
    });

    ["style", "id"].forEach(function(prop) {
        Object.defineProperty(_this, prop, {
            get: function() {
                return wrapper[prop];
            },
            set: function(val) {
                if (typeof val !== "undefined") {
                    return wrapper[prop] = val;
                }
            }
        });
    });

    ["getBoundingClientRect"].forEach(function(fn) {
        _this[fn] = function() {
            return svg[fn]();
        };
    });
}

SVGCanvas.prototype.getContext = function(type) {
    if (type !== '2d') {
        throw new Error('Unsupported type of context for SVGCanvas');
    }

    return this.ctx;
};

// you should always use URL.revokeObjectURL after your work done
SVGCanvas.prototype.toObjectURL = function() {
    var data = new XMLSerializer().serializeToString(this.svg);
    var svg = new Blob([data], {type: 'image/svg+xml;charset=utf-8'});
    return URL.createObjectURL(svg);
};

SVGCanvas.prototype.toDataURL = function(type, options) {
    var xml = new XMLSerializer().serializeToString(this.svg);

    // documentMode is an IE-only property
    // http://msdn.microsoft.com/en-us/library/ie/cc196988(v=vs.85).aspx
    // http://stackoverflow.com/questions/10964966/detect-ie-version-prior-to-v9-in-javascript
    var isIE = document.documentMode;

    if (isIE) {
        // This is patch from canvas2svg
        // IE search for a duplicate xmnls because they didn't implement setAttributeNS correctly
        var xmlns = /xmlns="http:\/\/www\.w3\.org\/2000\/svg".+xmlns="http:\/\/www\.w3\.org\/2000\/svg/gi;
        if(xmlns.test(xml)) {
            xml = xml.replace('xmlns="http://www.w3.org/2000/svg','xmlns:xlink="http://www.w3.org/1999/xlink');
        }
    }

    var SVGDataURL = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(xml);
    if (type === "image/svg+xml" || !type) {
        return SVGDataURL;
    }
    if (type === "image/jpeg" || type === "image/png") {
        var canvas = document.createElement('canvas');
        canvas.width = this.width;
        canvas.height = this.height;
        var ctx = canvas.getContext('2d');
        var img = new Image();
        img.src = SVGDataURL;
        if (img.complete && img.width > 0 && img.height > 0) {
            // for chrome, it's ready immediately
            ctx.drawImage(img, 0, 0);
            return canvas.toDataURL(type, options);
        } else {
            // for firefox, it's not possible to provide sync api in current thread
            // and web worker doesn't provide canvas API, so
            throw new Error('svgcanvas.toDataURL() for jpeg/png is only available in Chrome.');
        }
    }
    throw new Error('Unknown type for SVGCanvas.prototype.toDataURL, please use image/jpeg | image/png | image/svg+xml.');
};

// will return wrapper element: <div><svg></svg></div>
SVGCanvas.prototype.getElement = function() {
    return this.wrapper;
};

module.exports = SVGCanvas;

},{"./context":5}],7:[function(require,module,exports){
module.exports = function isBuffer(arg) {
  return arg && typeof arg === 'object'
    && typeof arg.copy === 'function'
    && typeof arg.fill === 'function'
    && typeof arg.readUInt8 === 'function';
}
},{}],8:[function(require,module,exports){
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
},{"./support/isBuffer":7,"_process":3,"inherits":2}],9:[function(require,module,exports){
// wrapper for p5.js
module.exports = window.p5;

},{}],10:[function(require,module,exports){
var p5 = require('./p5');
var assert = require('assert');
var _ = window._; // lodash
var SVGCanvas = require('svgcanvas');

// init p5 canvas instance and p5-svg instance
var canvasGraphics, svgGraphics, p5svg, p5canvas;
p5svg = new p5(function(p) {
    p.setup = function() {
        svgGraphics = p.createCanvas(100, 100, p.SVG);
        p.noLoop();
        p.isSVG = true;
    };
}, true);
p5canvas = new p5(function(p) {
    p.setup = function() {
        canvasGraphics = p.createCanvas(100, 100);
        p.noLoop();
        p.isSVG = false;
    };
}, true);

var resetCanvas = function(p) {
    p.clear();
    p.strokeWeight(6); // for using XOR with thin line removed (using 8-connected neighborhood < 5) for diff
    p.fill(200);
    p.stroke(0);
    p.ellipseMode(p.CENTER);
    p.rectMode(p.CORNER);
    p.smooth();
};

// count non transparent pixels
var countPixels = function(imgData) {
    var count = 0;
    for (var i = 3; i < imgData.data.length; i += 4) {
        if (imgData.data[i] > 0) {
            count++;
        }
    }
    return count;
};

var maxPixelDiff = 0;
var diffPixels = function(imgData1, imgData2, diffImgData) {
    for (var i = 0; i < imgData1.data.length; i += 4) {
        var indexes = [i, i+1, i+2, i+3];
        indexes.forEach(function(i) {
            diffImgData.data[i] = 0;
        });
        if(indexes.some(function(i) {
            return Math.abs(imgData1.data[i] - imgData2.data[i]) > maxPixelDiff;
        })) {
            diffImgData.data[i+3] = 255; // set black
        }
    }
};

// remove thin lines using 8-connected neighborhood < 5
var removeThinLines = function(canvas) {
    var ctx = canvas.getContext('2d');
    var width = canvas.width;
    var height = canvas.height;
    var imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    var imgDataCopy = ctx.getImageData(0, 0, canvas.width, canvas.height);

    var getPixelIndex = function(x, y) {
        return (y * width + x) * 4 + 3;
    };

    var getPixel = function(x, y) {
        var alphaIndex = getPixelIndex(x, y);
        return imgDataCopy.data[alphaIndex];
    };

    var setPixel = function(x, y, value) {
        imgData.data[getPixelIndex(x, y)] = value;
    };

    for (var x = 1; x < width - 1; x++) {
        for (var y = 1; y < height - 1; y++) {
            if (getPixel(x, y) == 0) {
                continue; // ignore transparents
            }
            var links = [
                {x: x - 1, y: y - 1},
                {x: x, y: y - 1},
                {x: x + 1, y: y - 1},
                {x: x - 1, y: y},
                {x: x + 1, y: y},
                {x: x - 1, y: y + 1},
                {x: x, y: y + 1},
                {x: x + 1, y: y + 1}
            ].map(function(p) {
                return getPixel(p.x, p.y);
            }).filter(function(val) {
                return val > 0; // not transparent?
            }).length;

            if (links < 5) { // is a thin line
                setPixel(x, y, 0); // make it transparent
            }
        }
    }
    canvas.getContext('2d').putImageData(imgData, 0, 0);
};

// render given function
var render = function(draw) {
    var fnbody = draw.toString();
    fnbody = fnbody.substring(fnbody.indexOf('{') + 1, fnbody.lastIndexOf('}'));
    [p5svg, p5canvas].forEach(function(p) {
        resetCanvas(p);
        with (p) {
            p.canvas.getContext('2d').__history = [];
            eval(fnbody);
        }
    });
};

// prepare dom for tests container
var prepareDom = function(draw) {
    var $container = $('#test-graph');

    var status = {};

    // draw header
    var th = '<div class="th"><div>Rendered in SVG</div><div>Rendered in Canvas<br>Converted to PNG</div><div>Diff Bitmap</div><div>Diff Bitmap with thin line removed (8-connected neighborhood < 5)</div><div></div><div class="function">p5.js</div></div>';
    $container.append(th);

    // the svg result
    var svg = new Image();
    svg.onload = function() {
        status.svg = true;
    };
    svg.src = SVGCanvas.prototype.toDataURL.call({svg: p5svg._renderer.svg},
                                                 "image/svg+xml");
    var _svg = p5svg._renderer.svg.cloneNode(true);
    _svg.id = null;
    _svg.className = 'svg';
    $container.append(_svg);

    // the canvas result
    var canvas = new Image();
    canvas.onload = function() {
        status.canvas = true;
    };
    canvas.src = p5canvas._curElement.elt.toDataURL('image/png');
    $container.append(canvas);

    // diff canvas
    var diffCanvas = document.createElement('canvas');
    diffCanvas.width = 100 * window.devicePixelRatio;
    diffCanvas.height = 100 * window.devicePixelRatio;;
    $container.append(diffCanvas);

    // diff canvas2 for removing thin lines
    var diffCanvas2 = document.createElement('canvas');
    diffCanvas2.width = 100 * window.devicePixelRatio;;
    diffCanvas2.height = 100 * window.devicePixelRatio;;
    $container.append(diffCanvas2);

    // match?
    var $match = $('<div class="match"></div>');
    $container.append($match);

    // p5.js API call history
    var fnbody = draw.toString();
    fnbody = fnbody.substring(fnbody.indexOf('{') + 1, fnbody.lastIndexOf('}'));
    // re-indent
    var indent = fnbody.match(/( +)/)[0].length;
    indent = new RegExp('^[ ]{' + indent + '}', 'gm');
    fnbody = fnbody.replace(indent, '');
    $container.append('<pre class="function">' + fnbody + '</pre>');

    // canvas API call history
    // var history = p5svg.canvas.getContext('2d').__history;
    // $container.append('<div class="canvas-fn">' + history.join('<br>') + '</div>');

    $container.append('<hr>');

    return {
        svg: svg,
        canvas: canvas,
        diffCanvas: diffCanvas,
        diffCanvas2: diffCanvas2,
        $match: $match,
        isReady: function() {
            return status.svg && status.canvas;
        }
    };
};

var testRender = function(draw, callback) {

    testRender.setMaxDiff(0.05); // reset maxDiff
    testRender.setMaxPixelDiff(0); // reset maxPixelDiff

    render(draw);

    var diff = function(el) {

        // wait until ready
        // if (!el.svg.complete || !el.canvas.complete) {
        if (!el.isReady()) {
            // 100 is workround for NS_ERROR_NOT_AVAILABLE in karma
            setTimeout(function() {
                diff(el);
            }, 100);
            return;
        }

        var ctx = el.diffCanvas.getContext('2d');
        var w = 100 * window.devicePixelRatio;
        var h = 100 * window.devicePixelRatio;

        // svg render result
        ctx.clearRect(0, 0, w, h);
        ctx.drawImage(el.svg, 0, 0, w, h);
        var imgData1 = ctx.getImageData(0, 0, w, h);

        // canvas render result
        ctx.clearRect(0, 0, w, h);
        ctx.drawImage(el.canvas, 0, 0, w, h);
        var imgData2 = ctx.getImageData(0, 0, w, h);

        // get diff
        var diffImgData = ctx.getImageData(0, 0, w, h);
        diffPixels(imgData1, imgData2, diffImgData);
        ctx.putImageData(diffImgData, 0, 0);

        // get diff with thin line removed (8-connected neighborhood < 5)
        ctx = el.diffCanvas2.getContext('2d');
        ctx.putImageData(diffImgData, 0, 0);
        removeThinLines(el.diffCanvas2);
        removeThinLines(el.diffCanvas2); // twice
        var diffImgData2 = ctx.getImageData(0, 0, w, h);

        // match?
        var count = Math.max(countPixels(imgData1), countPixels(imgData2));
        var diffCount = countPixels(diffImgData2);
        var rate = diffCount / count;
        var match = rate <= (testRender.maxDiff || 0.05);

        // update $match
        var icon = match ? 'fa-check': 'fa-times';
        el.$match.html('<i class="fa ' + icon + '"></i>');

        var err = null;
        if (!match) {
            err = new Error(JSON.stringify({
                maxPixelDiff: maxPixelDiff,
                maxDiffRate: testRender.maxDiff,
                pixels: count,
                diffPixels: diffCount,
                rate: rate
            }));
        }

        // callback
        callback(err);
    };

    var next = function() {
        // handle testRender.wait(ms);
        if (testRender.waitUntil && (Date.now() < testRender.waitUntil)) {
            setTimeout(next, 100);
            return;
        }
        var el = prepareDom(draw);
        diff(el);
    };

    next();
};

testRender.describe = function(str) {
    $(function() {
        var $container = $('#test-graph');
        $container.append('<h2>' + str + '</h2>');
    });
};

testRender.setMaxDiff = function(max) {
    testRender.maxDiff = max;
};

testRender.setMaxPixelDiff = function(max) {
    maxPixelDiff = max;
};

testRender.wait = function(ms) {
    testRender.waitUntil = Date.now() + ms;
};

// add lock so testRender will wait
testRender.lock = function() {
    testRender.wait(1000 * 1000 * 1000);
};

// remove lock
testRender.unlock = function() {
    testRender.wait(0);
};

module.exports = testRender;

},{"./p5":9,"assert":1,"svgcanvas":6}],11:[function(require,module,exports){
var testRender = require('../../lib/test-render');

window.TESTIMG = window.__karma__ ? "/base/test/unit/filter/light_by_zenozeng.jpg" : "./unit/filter/light_by_zenozeng.jpg";

describe('Filters', function() {

    var tests = {
        // in SVG Renderer, I use feGaussianBlur,
        // but Canvas Renderer uses a pixels based blur (port of processing's blur),
        // so the results may not be exactly same.
        blur: function() {
            testRender.setMaxDiff(1); // ignore diff, see known issue
            testRender.setMaxPixelDiff(2);
            background(255);
            stroke(255, 0, 0);
            strokeWeight(10);
            line(0, 0, 100, 100);
            line(0, 100, 100, 0);
            filter(BLUR, 5);
        },
        gray: function() {
            testRender.setMaxPixelDiff(1);
            background(200, 100, 50);
            filter(GRAY);
        },
        invert: function() {
            testRender.setMaxPixelDiff(1);
            background(255, 0, 0);
            filter(INVERT);
            ellipse(50, 50, 50, 50);
        },
        threshold: function() {
            background(255, 0, 0);
            stroke(255);
            strokeWeight(10);
            line(0, 0, 100, 100);
            filter(THRESHOLD, 0.5);
        },
        opaque: function() {
            testRender.setMaxPixelDiff(1);
            background(255, 0, 0, 127);
            filter(OPAQUE); // Sets the alpha channel to 255
        },
        posterize: function() {
            testRender.lock();
            testRender.setMaxDiff(1); // ignore diff, see https://github.com/zenozeng/p5.js-svg/issues/124
            loadImage(TESTIMG, function(img) {
                image(img, 0, 0);
                filter(POSTERIZE, 2);
                if (_isSafari()) {
                }
                testRender.unlock();
            });
        },
        erode: function() {
            testRender.lock();
            testRender.setMaxDiff(1); // ignore diff, see known issue
            loadImage(TESTIMG, function(img) {
                image(img, 0, 0);
                filter(ERODE);
                testRender.unlock();
            });
        },
        dilate: function() {
            testRender.lock();
            testRender.setMaxDiff(1); // ignore diff, see known issue
            loadImage(TESTIMG, function(img) {
                image(img, 0, 0);
                filter(DILATE);
                testRender.unlock();
            });
        },
        custom: function() {
            testRender.setMaxPixelDiff(1);
            background(200, 100, 50);
            registerSVGFilter('mygray', p5.SVGFilters.gray);
            if (isSVG) {
                filter('mygray');
            } else {
                filter(GRAY);
            }
        }
    };

    Object.keys(tests).forEach(function(key) {
        describe("Filters/" + key, function() {
            it(key + ': SVG API should draw same image as Canvas API', function(done) {
                this.timeout(0);
                testRender.describe("Filters/" + key);
                testRender(tests[key], done);
            });
        });
    });

});

},{"../../lib/test-render":10}],12:[function(require,module,exports){
var assert = require('assert');
var p5 = require('../../lib/p5');

describe('IO/saveFrames', function() {
    it('should capture canvas frames', function(done) {
        new p5(function(p) {
            p.setup = function() {
                p.createCanvas(100, 100);
                p.strokeWeight(3);
                p.saveFrames('hello', 'png', 3, 10, function(frames) {
                    try {
                        assert.ok(frames.length > 1);
                        p.noCanvas();
                        done();
                    } catch (e) {
                        p.noCanvas();
                        done(e);
                    }
                });
            };
            p.draw = function() {
                var i = p.frameCount * 2;
                p.line(0, 0, i, i);
            };
        });
    });

    it('should capture svg frames', function(done) {
        new p5(function(p) {
            p.setup = function() {
                p.createCanvas(100, 100, p.SVG);
                p.strokeWeight(3);
                p.saveFrames('hello', 'svg', 0.5, 10, function(frames) {
                    try {
                        assert.ok(frames.length > 1);
                        p.noCanvas();
                        done();
                    } catch (e) {
                        p.noCanvas();
                        done(e);
                    }
                });
            };
            p.draw = function() {
                var i = p.frameCount * 2;
                p.line(0, 0, i, i);
            };
        });
    });

    it('should capture svg frames even omitting duration and fps', function(done) {
        this.timeout(0);
        new p5(function(p) {
            p.setup = function() {
                p.createCanvas(100, 100, p.SVG);
                p.strokeWeight(3);
                p.saveFrames('hello', 'svg', null, null, function(frames) {
                    try {
                        assert.ok(frames.length > 1);
                        p.noCanvas();
                        done();
                    } catch (e) {
                        p.noCanvas();
                        done(e);
                    }
                });
            };
            p.draw = function() {
                var i = p.frameCount * 2;
                p.line(0, 0, i, i);
            };
        });
    });

    it('should download svg frames', function(done) {
        new p5(function(p) {
            p.setup = function() {
                p.createCanvas(100, 100, p.SVG);
                var _downloadFile = p.downloadFile;
                var count = 0;
                var _done;
                p.downloadFile = function() {
                    count++;
                    if (count > 1) {
                        if (!_done) {
                            p.noCanvas();
                            done();
                            _done = true;
                        }
                    }
                };
                p.saveFrames('hello', 'svg', 0.5, 10);
            };
            p.draw = function() {
                var i = p.frameCount * 2;
                p.line(0, 0, i, i);
            };
        });
    });

    it('should wait all pending jobs done', function(done) {
        this.timeout(0);
        new p5(function(p) {
            p.setup = function() {
                p.createCanvas(100, 100, p.SVG);
                var pending = 0;
                var _makeSVGFrame = p._makeSVGFrame;
                p._makeSVGFrame = function(options) {
                    // slow version
                    pending++;
                    setTimeout(function() {
                        _makeSVGFrame.call(p, options);
                    }, 500);
                };
                p.downloadFile = function() {
                    pending--;
                    if (pending === 0) {
                        p.noCanvas();
                        done();
                    }
                };
                p.saveFrames('hello', 'svg', 0.5, 10);
            };
            p.draw = function() {
                var i = p.frameCount * 2;
                p.line(0, 0, i, i);
            };
        });
    });
});

},{"../../lib/p5":9,"assert":1}],13:[function(require,module,exports){
var assert = require('assert');
var testDownload = require('./test-download.js');
var p5 = require('../../lib/p5');

describe('IO/saveSVG', function() {

    it('should save untitled.svg', function(done) {
        testDownload('untitled', 'svg', function(p) {
            p.saveSVG();
        }, done);
    });
    it('should save hello.svg', function(done) {
        testDownload('hello', 'svg', function(p) {
            p.saveSVG('hello.svg');
        }, done);
    });
    it('should save hello.jpg', function(done) {
        testDownload('hello', 'jpg', function(p) {
            p.saveSVG('hello', 'jpg');
        }, done);
    });
    it('should save hello.jpeg', function(done) {
        testDownload('hello', 'jpeg', function(p) {
            p.saveSVG('hello.jpeg');
        }, done);
    });
    it('should save hello.png', function(done) {
        testDownload('hello', 'png', function(p) {
            p.saveSVG('hello.png');
        }, done);
    });
    it('source is Graphics', function(done) {
        testDownload('source-graphics', 'png', function(p) {
            var pg = p.createGraphics(100, 100, p.SVG);
            pg.background(100);
            p.saveSVG(pg, 'source-graphics.png');
        }, done);
    });
    it('source is <svg>', function(done) {
        testDownload('source-svg', 'png', function(p) {
            var pg = p.createGraphics(100, 100, p.SVG);
            pg.background(100);
            p.saveSVG(pg._renderer.svg, 'source-svg.png');
        }, done);
    });
    it('should throw if given unsupported type', function() {
        new p5(function(p) {
            p.setup = function() {
                p.createCanvas(100, 100, p.SVG);
                p.background(255);
                p.stroke(0, 0, 0);
                p.line(0, 0, 100, 100);
                assert.throws(function() {
                    p.saveSVG('hello.txt');
                });
                p.noCanvas();
            };
        });
    });
});

},{"../../lib/p5":9,"./test-download.js":15,"assert":1}],14:[function(require,module,exports){
var assert = require('assert');
var p5 = require('../../lib/p5');
var testDownload = require('./test-download.js');

describe('IO/save', function() {
    this.timeout(1000 * 5);

    it('save()', function(done) {
        testDownload('untitled', 'svg', function(p) {
            p.save();
        }, done);
    });

    it('save(Graphics)', function(done) {
        testDownload('untitled', 'svg', function(p) {
            p.save(p._defaultGraphics);
        }, done);
    });

    it('save(<svg>)', function(done) {
        testDownload('untitled', 'svg', function(p) {
            p.save(p._renderer.svg);
        }, done);
    });

    it('canvas\'s save should still work', function(done) {
        new p5(function(p) {
            p.setup = function() {
                var _saveCanvas = p5.prototype.saveCanvas;
                p5.prototype.saveCanvas = function() {
                    p5.prototype.saveCanvas = _saveCanvas;
                    done();
                };
                p.save('canvas-save.png');
            };
        });
    });
});

},{"../../lib/p5":9,"./test-download.js":15,"assert":1}],15:[function(require,module,exports){
var assert = require('assert');
var p5 = require('../../lib/p5');

var testDownload = function(filename, ext, fn, done, useCanvas) {
    new p5(function(p) {
        p.setup = function() {
            p.createCanvas(100, 100, useCanvas ? p.P2D : p.SVG);
            p.background(255);
            p.stroke(0, 0, 0);
            p.strokeWeight(3);
            p.line(0, 0, 100, 100);

            p.downloadFile = function(dataURL, _filename, _ext) {
                try {
                    assert.notEqual(dataURL.indexOf('image/octet-stream'), -1);
                    assert.equal(_filename, filename);
                    assert.equal(_ext, ext);
                    p.noCanvas();
                    done();
                } catch(e) {
                    p.noCanvas();
                    done(e);
                }
            };
            fn(p);
        };
    });
};

module.exports = testDownload;

},{"../../lib/p5":9,"assert":1}],16:[function(require,module,exports){
var p5 = require('../../lib/p5');
var testRender = require('../../lib/test-render');
var assert = require('assert');

describe('Rendering', function() {
    this.timeout(0);

    describe('noCanvas', function() {
        it('should remove the <svg> created by createCanvas', function() {
            new p5(function(p) {
                p.setup = function() {
                    p.createCanvas(100, 100, p.SVG);
                    var svg = p._renderer.svg;
                    assert.strictEqual(true, document.body.contains(svg));
                    p.line(0, 0, 100, 100);
                    p.noCanvas();
                    assert.strictEqual(false, document.body.contains(svg));
                };
            });
        });
    });
    describe('createGraphics', function() {
        it('createGraphics: SVG API should draw same image as Canvas API', function(done) {
            testRender.describe('createGraphics');
            testRender(function() {
                pg = createGraphics(400, 400, isSVG ? SVG : P2D);
                background(200);
                pg.background(100);
                pg.noStroke();
                pg.ellipse(pg.width/2, pg.height/2, 50, 50);
                loadGraphics(pg, function(pg) {
                    image(pg, 50, 50);
                    image(pg, 0, 0, 50, 50);
                    ellipse(width/2, height/2, 50, 50);
                }, function(err) {
                    console.error(err);
                });
                testRender.wait(1000); // wait loadGraphics before run diff
            }, done);
        });
    });
    describe('resizeCanvas', function() {
        it('resizeCanvas: should be scaled', function(done) {
            testRender.describe('resizeCanvas: scaled');
            testRender(function() {
                resizeCanvas(200, 200);
                strokeWeight(10);
                ellipse(width/2, height/2, 50, 50);
            }, done);
        });
        it('resizeCanvas: all pixels should be cleared after resize', function(done) {
            testRender.describe('resizeCanvas: all pixels cleared');
            testRender(function() {
                ellipse(width/2, height/2, 50, 50);
                resizeCanvas(200, 200);
                resizeCanvas(100, 100);
                strokeWeight(10);
                ellipse(0, 0, 100, 100);
            }, done);
        });
    });
});

},{"../../lib/p5":9,"../../lib/test-render":10,"assert":1}],17:[function(require,module,exports){
var testRender = require('../../lib/test-render');

describe('Shape/2d_primitives', function() {
    // the tests code are from p5.js's example reference
    var tests = {
        arc: function() {
            arc(50, 55, 50, 50, 0, PI * 0.5);
            noFill();
            arc(50, 55, 60, 60, PI * 0.5, PI * 1.5);
        },
        circle: function() {
            ellipse(56, 46, 55, 55);
        },
        ellipse: function() {
            ellipse(56, 46, 55, 35);
        },
        line: function() {
            strokeWeight(10);
            line(30, 20, 85, 20);
            stroke(126);
            line(85, 20, 85, 75);
            stroke(200);
            line(85, 75, 30, 75);
        },
        point: function() {
            point(30, 20);
            point(85, 20);
            point(85, 75);
            point(30, 75);
        },
        quad: function() {
            quad(38, 31, 86, 20, 69, 63, 30, 76);
        },
        rect: function() {
            rect(30, 20, 55, 55);
        },
        roundRect: function() {
            rect(30, 20, 55, 55, 20, 15, 10, 5);
        },
        triangle: function() {
            triangle(30, 75, 58, 20, 86, 75);
        }
    };

    Object.keys(tests).forEach(function(key) {
        describe(key, function() {
            it(key + ': SVG API should draw same image as Canvas API', function(done) {
                testRender.describe(key);
                testRender(tests[key], done);
            });
        });
    });
});

},{"../../lib/test-render":10}],18:[function(require,module,exports){
var testRender = require('../../lib/test-render');

describe('Shape/Attributes', function() {
    // the tests code are from p5.js's example reference
    var tests = {
        strokeWeight: function() {
            strokeWeight(10);
            line(0, 0, 100, 100);
            strokeWeight(5);
            line(0, 0, 50, 100);
        },
        strokeCap: function() {
            strokeWeight(12.0);
            strokeCap(ROUND);
            line(20, 30, 80, 30);
            strokeCap(SQUARE);
            line(20, 50, 80, 50);
            strokeCap(PROJECT);
            line(20, 70, 80, 70);
        },
        strokeJoinMiter: function() {
            noFill();
            strokeWeight(10.0);
            strokeJoin(MITER);
            beginShape();
            vertex(35, 20);
            vertex(65, 50);
            vertex(35, 80);
            endShape();
        },
        strokeJoinBevel: function() {
            noFill();
            strokeWeight(10.0);
            strokeJoin(BEVEL);
            beginShape();
            vertex(35, 20);
            vertex(65, 50);
            vertex(35, 80);
            endShape();
        },
        strokeJoinRound: function() {
            noFill();
            strokeWeight(10.0);
            strokeJoin(ROUND);
            beginShape();
            vertex(35, 20);
            vertex(65, 50);
            vertex(35, 80);
            endShape();
        },
        ellipseModeRadius: function() {
            ellipseMode(RADIUS);
            fill(255);
            ellipse(50, 50, 30, 30);
        },
        ellipseModeCenter: function() {
            ellipseMode(RADIUS);
            fill(255);
            ellipse(50, 50, 30, 30);
            ellipseMode(CENTER);
            fill(100);
            ellipse(50, 50, 30, 30);
        },
        ellipseModeCorner: function() {
            ellipseMode(RADIUS);
            fill(255);
            ellipse(50, 50, 30, 30);
            ellipseMode(CORNER);
            fill(255);
            ellipse(25, 25, 50, 50);
        },
        ellipseModeCorners: function() {
            ellipseMode(RADIUS);
            fill(255);
            ellipse(50, 50, 30, 30);
            ellipseMode(CORNERS);
            fill(100);
            ellipse(25, 25, 50, 50);
        },
        rectModeCornerAndCorners: function() {
            rectMode(CORNER);
            fill(255);
            rect(25, 25, 50, 50);

            rectMode(CORNERS);
            fill(100);
            rect(25, 25, 50, 50);
        },
        rectModeRadiusAndCenter: function() {
            rectMode(RADIUS);
            fill(255);
            rect(50, 50, 30, 30);

            rectMode(CENTER);
            fill(100);
            rect(50, 50, 30, 30);
        },
        smooth: function() {
            background(0);
            fill(255);
            noStroke();
            smooth();
            ellipse(30, 48, 36, 36);
            noSmooth();
            ellipse(70, 48, 36, 36);
        }
    };

    Object.keys(tests).forEach(function(key) {
        describe(key, function() {
            it(key + ': SVG API should draw same image as Canvas API', function(done) {
                testRender.describe(key);
                testRender(tests[key], done);
            });
        });
    });
});

},{"../../lib/test-render":10}],19:[function(require,module,exports){
var testRender = require('../../lib/test-render');

describe('Shape/Curves', function() {

    var tests = {
        bezier: function() {
            noFill();
            stroke(255, 102, 0);
            stroke(0, 0, 0);
            bezier(85, 20, 10, 10, 90, 90, 15, 80);
        },
        bezierPoint: function() {
            noFill();
            bezier(85, 20, 10, 10, 90, 90, 15, 80);
            fill(255);
            stroke(100);
            steps = 10;
            for (var i = 0; i <= steps; i++) {
                var t = i / steps;
                x = bezierPoint(85, 10, 90, 15, t);
                y = bezierPoint(20, 10, 90, 80, t);
                ellipse(x, y, 5, 5);
            }
        },
        bezierTangent: function() {
            noFill();
            bezier(85, 20, 10, 10, 90, 90, 15, 80);
            steps = 6;
            fill(255);
            strokeWeight(10);
            for (i = 0; i <= steps; i++) {
                t = i / steps;
                x = bezierPoint(85, 10, 90, 15, t);
                y = bezierPoint(20, 10, 90, 80, t);
                tx = bezierTangent(85, 10, 90, 15, t);
                ty = bezierTangent(20, 10, 90, 80, t);
                a = atan2(ty, tx);
                a += PI;
                stroke(255, 102, 0);
                line(x, y, cos(a)*30 + x, sin(a)*30 + y);
                stroke(0);
                // ellipse(x, y, 5, 5);
            }
        },
        curve: function() {
            noFill();
            stroke(255, 102, 0);
            curve(5, 26, 5, 26, 73, 24, 73, 61);
            stroke(0);
            curve(5, 26, 73, 24, 73, 61, 15, 65);
            stroke(255, 102, 0);
            curve(73, 24, 73, 61, 15, 65, 15, 65);
        },
        curvePoint: function() {
            noFill();
            curve(5, 26, 5, 26, 73, 24, 73, 61);
            curve(5, 26, 73, 24, 73, 61, 15, 65);
            fill(255);
            ellipseMode(CENTER);
            steps = 6;
            for (i = 0; i <= steps; i++) {
                t = i / steps;
                x = curvePoint(5, 5, 73, 73, t);
                y = curvePoint(26, 26, 24, 61, t);
                ellipse(x, y, 5, 5);
                x = curvePoint(5, 73, 73, 15, t);
                y = curvePoint(26, 24, 61, 65, t);
                ellipse(x, y, 5, 5);
            }
        },
        curveTangent: function() {
            noFill();
            curve(5, 26, 73, 24, 73, 61, 15, 65);
            steps = 6;
            for (i = 0; i <= steps; i++) {
                t = i / steps;
                x = curvePoint(5, 73, 73, 15, t);
                y = curvePoint(26, 24, 61, 65, t);
                //ellipse(x, y, 5, 5);
                tx = curveTangent(5, 73, 73, 15, t);
                ty = curveTangent(26, 24, 61, 65, t);
                a = atan2(ty, tx);
                a -= PI/2.0;
                line(x, y, cos(a)*8 + x, sin(a)*8 + y);
            }
        },
        curveTightness: function() {
            curveTightness(10);
            beginShape();
            curveVertex(10, 26);
            curveVertex(10, 26);
            curveVertex(83, 24);
            curveVertex(83, 61);
            curveVertex(25, 65);
            curveVertex(25, 65);
            endShape();
        }
    };

    Object.keys(tests).forEach(function(key) {
        describe(key, function() {
            it(key + ': SVG API should draw same image as Canvas API', function(done) {
                testRender.describe(key);
                testRender(tests[key], done);
            });
        });
    });

});

},{"../../lib/test-render":10}],20:[function(require,module,exports){
var testRender = require('../../lib/test-render');

describe('Shape/Vertex', function() {
    var tests = {
        contour: function() {
            translate(50, 50);
            stroke(255, 0, 0);
            beginShape();
            vertex(-40, -40);
            vertex(40, -40);
            vertex(40, 40);
            vertex(-40, 40);
            beginContour();
            vertex(-20, -20);
            vertex(-20, 20);
            vertex(20, 20);
            vertex(20, -20);
            endContour();
            endShape(CLOSE);
            translate(-50, -50);
        },
        bezierVertex: function() {
            beginShape();
            vertex(30, 20);
            bezierVertex(80, 0, 80, 75, 30, 75);
            bezierVertex(50, 80, 60, 25, 30, 20);
            endShape();
        },
        curveVertex: function() {
            noFill();
            beginShape();
            curveVertex(84,  91);
            curveVertex(84,  91);
            curveVertex(68,  19);
            curveVertex(21,  17);
            curveVertex(32, 100);
            curveVertex(32, 100);
            endShape();
        },
        quadraticVertex: function() {
            noFill();
            strokeWeight(4);
            beginShape();
            vertex(20, 20);
            quadraticVertex(80, 20, 50, 50);
            quadraticVertex(20, 80, 80, 80);
            vertex(80, 60);
            endShape();
        }
    };

    Object.keys(tests).forEach(function(key) {
        describe(key, function() {
            it(key + ': SVG API should draw same image as Canvas API', function(done) {
                testRender.describe(key);
                testRender(tests[key], done);
            });
        });
    });
});

},{"../../lib/test-render":10}],21:[function(require,module,exports){
var p5 = require('../../lib/p5');
var assert = require('assert');

describe('SVG Element API', function() {
    it('querySVG', function() {
        new p5(function(p) {
            p.setup = function() {
                p.createCanvas(100, 100, p.SVG);
                p.ellipse(50, 50, 50, 50);
                assert.equal(p.querySVG('path')[0].elt.nodeName.toLowerCase(), 'path');

                var pg = p.createGraphics(100, 100, p.SVG);
                pg.ellipse(60, 60, 50, 50);
                assert.equal(pg.querySVG('path')[0].elt.nodeName.toLowerCase(), 'path');
            };
        });
    });
});

},{"../../lib/p5":9,"assert":1}],22:[function(require,module,exports){
var p5 = require('../../lib/p5');
var assert = require('assert');

var SVGDataURL = 'data:image/svg+xml;charset=utf-8,<svg%20version%3D"1.1"%20xmlns%3D"http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg"%20xmlns%3Axlink%3D"http%3A%2F%2Fwww.w3.org%2F1999%2Fxlink"%20width%3D"100"%20height%3D"100"%20viewBox%3D"0%200%20100%20100"><defs%2F><g%20transform%3D"scale(1%2C1)"%2F><g><path%20fill%3D"none"%20stroke%3D"rgb(0%2C0%2C0)"%20paint-order%3D"fill%20stroke%20markers"%20d%3D"%20M%200%200%20L%20100%20100"%20stroke-opacity%3D"1"%20stroke-linecap%3D"round"%20stroke-miterlimit%3D"10"%20stroke-width%3D"10"%2F><g%20transform%3D"translate(0.5%2C0.5)"><path%20fill%3D"none"%20stroke%3D"rgb(0%2C0%2C0)"%20paint-order%3D"fill%20stroke%20markers"%20d%3D"%20M%200%200%20L%2050%20100"%20stroke-opacity%3D"1"%20stroke-linecap%3D"round"%20stroke-miterlimit%3D"10"%20stroke-width%3D"5"%2F><g%20transform%3D"translate(-0.5%2C-0.5)"%2F><%2Fg><%2Fg><%2Fsvg>';

var SVGHTTPURL = window.__karma__ ? "/base/test/unit/svg/test.svg" : "./unit/svg/test.svg";

describe('SVG Manipulating API', function() {
    it('Manipulate SVG', function(done) {
        new p5(function(p) {
            var svg;
            var svg2;
            p.preload = function() {
                svg = p.loadSVG(SVGDataURL);
                svg2 = p.loadSVG(SVGHTTPURL);
            };
            p.setup = function() {
                svg2.query("path")[0].attribute("stroke-width", 100);
                var pg = p.createGraphics(400, 400, p.SVG);
                pg.image(svg, 0, 0, 400, 400);
                var paths = pg.querySVG('path');
                try {
                    assert.equal(paths.length, 2);
                    paths[0].attribute("stroke-width", 1);
                    assert.equal(paths[0].attribute("stroke-width"), 1);
                    pg.image(svg2, 0, 0);
                    assert.equal(pg.querySVG('path')[2].attribute("stroke-width"),
                                 100);
                    done();
                } catch(e) {
                    done(e);
                }
            };
        });
    });
});

},{"../../lib/p5":9,"assert":1}],23:[function(require,module,exports){
var test = function() {
    mocha.setup('bdd');
    mocha.setup({timeout: 10000, slow: 2000});
    require('./filter/filter');
    require('./svg/element');
    require('./svg/manipulate');
    require('./rendering/rendering');
    require('./io/save-frames');
    require('./io/save');
    require('./io/save-svg');
    require('./shape/2d_primitives');
    require('./shape/attributes');
    require('./shape/curves');
    require('./shape/vertex');

    // Note that since recent version of karma, mocha.run will be called automatically
    // So, we only call mocah.run() if not running inside karma
    if (!window.__karma__) {
        mocha.run();
    }
};


test();

},{"./filter/filter":11,"./io/save":14,"./io/save-frames":12,"./io/save-svg":13,"./rendering/rendering":16,"./shape/2d_primitives":17,"./shape/attributes":18,"./shape/curves":19,"./shape/vertex":20,"./svg/element":21,"./svg/manipulate":22}]},{},[23]);
