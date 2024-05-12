(function () {
	'use strict';

	var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

	function getDefaultExportFromCjs (x) {
		return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
	}

	function getAugmentedNamespace(n) {
	  if (n.__esModule) return n;
	  var f = n.default;
		if (typeof f == "function") {
			var a = function a () {
				if (this instanceof a) {
					var args = [null];
					args.push.apply(args, arguments);
					var Ctor = Function.bind.apply(f, args);
					return new Ctor();
				}
				return f.apply(this, arguments);
			};
			a.prototype = f.prototype;
	  } else a = {};
	  Object.defineProperty(a, '__esModule', {value: true});
		Object.keys(n).forEach(function (k) {
			var d = Object.getOwnPropertyDescriptor(n, k);
			Object.defineProperty(a, k, d.get ? d : {
				enumerable: true,
				get: function () {
					return n[k];
				}
			});
		});
		return a;
	}

	var unit = {};

	var chai$2 = {};

	/*!
	 * assertion-error
	 * Copyright(c) 2013 Jake Luer <jake@qualiancy.com>
	 * MIT Licensed
	 */

	/*!
	 * Return a function that will copy properties from
	 * one object to another excluding any originally
	 * listed. Returned function will create a new `{}`.
	 *
	 * @param {String} excluded properties ...
	 * @return {Function}
	 */

	function exclude () {
	  var excludes = [].slice.call(arguments);

	  function excludeProps (res, obj) {
	    Object.keys(obj).forEach(function (key) {
	      if (!~excludes.indexOf(key)) res[key] = obj[key];
	    });
	  }

	  return function extendExclude () {
	    var args = [].slice.call(arguments)
	      , i = 0
	      , res = {};

	    for (; i < args.length; i++) {
	      excludeProps(res, args[i]);
	    }

	    return res;
	  };
	}
	/*!
	 * Primary Exports
	 */

	var assertionError = AssertionError$1;

	/**
	 * ### AssertionError
	 *
	 * An extension of the JavaScript `Error` constructor for
	 * assertion and validation scenarios.
	 *
	 * @param {String} message
	 * @param {Object} properties to include (optional)
	 * @param {callee} start stack function (optional)
	 */

	function AssertionError$1 (message, _props, ssf) {
	  var extend = exclude('name', 'message', 'stack', 'constructor', 'toJSON')
	    , props = extend(_props || {});

	  // default values
	  this.message = message || 'Unspecified AssertionError';
	  this.showDiff = false;

	  // copy from properties
	  for (var key in props) {
	    this[key] = props[key];
	  }

	  // capture stack trace
	  ssf = ssf || AssertionError$1;
	  if (Error.captureStackTrace) {
	    Error.captureStackTrace(this, ssf);
	  } else {
	    try {
	      throw new Error();
	    } catch(e) {
	      this.stack = e.stack;
	    }
	  }
	}

	/*!
	 * Inherit from Error.prototype
	 */

	AssertionError$1.prototype = Object.create(Error.prototype);

	/*!
	 * Statically set name
	 */

	AssertionError$1.prototype.name = 'AssertionError';

	/*!
	 * Ensure correct constructor
	 */

	AssertionError$1.prototype.constructor = AssertionError$1;

	/**
	 * Allow errors to be converted to JSON for static transfer.
	 *
	 * @param {Boolean} include stack (default: `true`)
	 * @return {Object} object that can be `JSON.stringify`
	 */

	AssertionError$1.prototype.toJSON = function (stack) {
	  var extend = exclude('constructor', 'toJSON', 'stack')
	    , props = extend({ name: this.name }, this);

	  // include stack if exists and not turned off
	  if (false !== stack && this.stack) {
	    props.stack = this.stack;
	  }

	  return props;
	};

	var utils$1 = {};

	/* !
	 * Chai - pathval utility
	 * Copyright(c) 2012-2014 Jake Luer <jake@alogicalparadox.com>
	 * @see https://github.com/logicalparadox/filtr
	 * MIT Licensed
	 */

	/**
	 * ### .hasProperty(object, name)
	 *
	 * This allows checking whether an object has own
	 * or inherited from prototype chain named property.
	 *
	 * Basically does the same thing as the `in`
	 * operator but works properly with null/undefined values
	 * and other primitives.
	 *
	 *     var obj = {
	 *         arr: ['a', 'b', 'c']
	 *       , str: 'Hello'
	 *     }
	 *
	 * The following would be the results.
	 *
	 *     hasProperty(obj, 'str');  // true
	 *     hasProperty(obj, 'constructor');  // true
	 *     hasProperty(obj, 'bar');  // false
	 *
	 *     hasProperty(obj.str, 'length'); // true
	 *     hasProperty(obj.str, 1);  // true
	 *     hasProperty(obj.str, 5);  // false
	 *
	 *     hasProperty(obj.arr, 'length');  // true
	 *     hasProperty(obj.arr, 2);  // true
	 *     hasProperty(obj.arr, 3);  // false
	 *
	 * @param {Object} object
	 * @param {String|Symbol} name
	 * @returns {Boolean} whether it exists
	 * @namespace Utils
	 * @name hasProperty
	 * @api public
	 */

	function hasProperty(obj, name) {
	  if (typeof obj === 'undefined' || obj === null) {
	    return false;
	  }

	  // The `in` operator does not work with primitives.
	  return name in Object(obj);
	}

	/* !
	 * ## parsePath(path)
	 *
	 * Helper function used to parse string object
	 * paths. Use in conjunction with `internalGetPathValue`.
	 *
	 *      var parsed = parsePath('myobject.property.subprop');
	 *
	 * ### Paths:
	 *
	 * * Can be infinitely deep and nested.
	 * * Arrays are also valid using the formal `myobject.document[3].property`.
	 * * Literal dots and brackets (not delimiter) must be backslash-escaped.
	 *
	 * @param {String} path
	 * @returns {Object} parsed
	 * @api private
	 */

	function parsePath(path) {
	  var str = path.replace(/([^\\])\[/g, '$1.[');
	  var parts = str.match(/(\\\.|[^.]+?)+/g);
	  return parts.map(function mapMatches(value) {
	    if (
	      value === 'constructor' ||
	      value === '__proto__' ||
	      value === 'prototype'
	    ) {
	      return {};
	    }
	    var regexp = /^\[(\d+)\]$/;
	    var mArr = regexp.exec(value);
	    var parsed = null;
	    if (mArr) {
	      parsed = { i: parseFloat(mArr[1]) };
	    } else {
	      parsed = { p: value.replace(/\\([.[\]])/g, '$1') };
	    }

	    return parsed;
	  });
	}

	/* !
	 * ## internalGetPathValue(obj, parsed[, pathDepth])
	 *
	 * Helper companion function for `.parsePath` that returns
	 * the value located at the parsed address.
	 *
	 *      var value = getPathValue(obj, parsed);
	 *
	 * @param {Object} object to search against
	 * @param {Object} parsed definition from `parsePath`.
	 * @param {Number} depth (nesting level) of the property we want to retrieve
	 * @returns {Object|Undefined} value
	 * @api private
	 */

	function internalGetPathValue(obj, parsed, pathDepth) {
	  var temporaryValue = obj;
	  var res = null;
	  pathDepth = typeof pathDepth === 'undefined' ? parsed.length : pathDepth;

	  for (var i = 0; i < pathDepth; i++) {
	    var part = parsed[i];
	    if (temporaryValue) {
	      if (typeof part.p === 'undefined') {
	        temporaryValue = temporaryValue[part.i];
	      } else {
	        temporaryValue = temporaryValue[part.p];
	      }

	      if (i === pathDepth - 1) {
	        res = temporaryValue;
	      }
	    }
	  }

	  return res;
	}

	/* !
	 * ## internalSetPathValue(obj, value, parsed)
	 *
	 * Companion function for `parsePath` that sets
	 * the value located at a parsed address.
	 *
	 *  internalSetPathValue(obj, 'value', parsed);
	 *
	 * @param {Object} object to search and define on
	 * @param {*} value to use upon set
	 * @param {Object} parsed definition from `parsePath`
	 * @api private
	 */

	function internalSetPathValue(obj, val, parsed) {
	  var tempObj = obj;
	  var pathDepth = parsed.length;
	  var part = null;
	  // Here we iterate through every part of the path
	  for (var i = 0; i < pathDepth; i++) {
	    var propName = null;
	    var propVal = null;
	    part = parsed[i];

	    // If it's the last part of the path, we set the 'propName' value with the property name
	    if (i === pathDepth - 1) {
	      propName = typeof part.p === 'undefined' ? part.i : part.p;
	      // Now we set the property with the name held by 'propName' on object with the desired val
	      tempObj[propName] = val;
	    } else if (typeof part.p !== 'undefined' && tempObj[part.p]) {
	      tempObj = tempObj[part.p];
	    } else if (typeof part.i !== 'undefined' && tempObj[part.i]) {
	      tempObj = tempObj[part.i];
	    } else {
	      // If the obj doesn't have the property we create one with that name to define it
	      var next = parsed[i + 1];
	      // Here we set the name of the property which will be defined
	      propName = typeof part.p === 'undefined' ? part.i : part.p;
	      // Here we decide if this property will be an array or a new object
	      propVal = typeof next.p === 'undefined' ? [] : {};
	      tempObj[propName] = propVal;
	      tempObj = tempObj[propName];
	    }
	  }
	}

	/**
	 * ### .getPathInfo(object, path)
	 *
	 * This allows the retrieval of property info in an
	 * object given a string path.
	 *
	 * The path info consists of an object with the
	 * following properties:
	 *
	 * * parent - The parent object of the property referenced by `path`
	 * * name - The name of the final property, a number if it was an array indexer
	 * * value - The value of the property, if it exists, otherwise `undefined`
	 * * exists - Whether the property exists or not
	 *
	 * @param {Object} object
	 * @param {String} path
	 * @returns {Object} info
	 * @namespace Utils
	 * @name getPathInfo
	 * @api public
	 */

	function getPathInfo(obj, path) {
	  var parsed = parsePath(path);
	  var last = parsed[parsed.length - 1];
	  var info = {
	    parent:
	      parsed.length > 1 ?
	        internalGetPathValue(obj, parsed, parsed.length - 1) :
	        obj,
	    name: last.p || last.i,
	    value: internalGetPathValue(obj, parsed),
	  };
	  info.exists = hasProperty(info.parent, info.name);

	  return info;
	}

	/**
	 * ### .getPathValue(object, path)
	 *
	 * This allows the retrieval of values in an
	 * object given a string path.
	 *
	 *     var obj = {
	 *         prop1: {
	 *             arr: ['a', 'b', 'c']
	 *           , str: 'Hello'
	 *         }
	 *       , prop2: {
	 *             arr: [ { nested: 'Universe' } ]
	 *           , str: 'Hello again!'
	 *         }
	 *     }
	 *
	 * The following would be the results.
	 *
	 *     getPathValue(obj, 'prop1.str'); // Hello
	 *     getPathValue(obj, 'prop1.att[2]'); // b
	 *     getPathValue(obj, 'prop2.arr[0].nested'); // Universe
	 *
	 * @param {Object} object
	 * @param {String} path
	 * @returns {Object} value or `undefined`
	 * @namespace Utils
	 * @name getPathValue
	 * @api public
	 */

	function getPathValue(obj, path) {
	  var info = getPathInfo(obj, path);
	  return info.value;
	}

	/**
	 * ### .setPathValue(object, path, value)
	 *
	 * Define the value in an object at a given string path.
	 *
	 * ```js
	 * var obj = {
	 *     prop1: {
	 *         arr: ['a', 'b', 'c']
	 *       , str: 'Hello'
	 *     }
	 *   , prop2: {
	 *         arr: [ { nested: 'Universe' } ]
	 *       , str: 'Hello again!'
	 *     }
	 * };
	 * ```
	 *
	 * The following would be acceptable.
	 *
	 * ```js
	 * var properties = require('tea-properties');
	 * properties.set(obj, 'prop1.str', 'Hello Universe!');
	 * properties.set(obj, 'prop1.arr[2]', 'B');
	 * properties.set(obj, 'prop2.arr[0].nested.value', { hello: 'universe' });
	 * ```
	 *
	 * @param {Object} object
	 * @param {String} path
	 * @param {Mixed} value
	 * @api private
	 */

	function setPathValue(obj, path, val) {
	  var parsed = parsePath(path);
	  internalSetPathValue(obj, val, parsed);
	  return obj;
	}

	var pathval = {
	  hasProperty: hasProperty,
	  getPathInfo: getPathInfo,
	  getPathValue: getPathValue,
	  setPathValue: setPathValue,
	};

	/*!
	 * Chai - flag utility
	 * Copyright(c) 2012-2014 Jake Luer <jake@alogicalparadox.com>
	 * MIT Licensed
	 */

	/**
	 * ### .flag(object, key, [value])
	 *
	 * Get or set a flag value on an object. If a
	 * value is provided it will be set, else it will
	 * return the currently set value or `undefined` if
	 * the value is not set.
	 *
	 *     utils.flag(this, 'foo', 'bar'); // setter
	 *     utils.flag(this, 'foo'); // getter, returns `bar`
	 *
	 * @param {Object} object constructed Assertion
	 * @param {String} key
	 * @param {Mixed} value (optional)
	 * @namespace Utils
	 * @name flag
	 * @api private
	 */

	var flag$5 = function flag(obj, key, value) {
	  var flags = obj.__flags || (obj.__flags = Object.create(null));
	  if (arguments.length === 3) {
	    flags[key] = value;
	  } else {
	    return flags[key];
	  }
	};

	/*!
	 * Chai - test utility
	 * Copyright(c) 2012-2014 Jake Luer <jake@alogicalparadox.com>
	 * MIT Licensed
	 */

	/*!
	 * Module dependencies
	 */

	var flag$4 = flag$5;

	/**
	 * ### .test(object, expression)
	 *
	 * Test an object for expression.
	 *
	 * @param {Object} object (constructed Assertion)
	 * @param {Arguments} chai.Assertion.prototype.assert arguments
	 * @namespace Utils
	 * @name test
	 */

	var test$1 = function test(obj, args) {
	  var negate = flag$4(obj, 'negate')
	    , expr = args[0];
	  return negate ? !expr : expr;
	};

	var typeDetect = {exports: {}};

	(function (module, exports) {
		(function (global, factory) {
			module.exports = factory() ;
		}(commonjsGlobal, (function () {
		/* !
		 * type-detect
		 * Copyright(c) 2013 jake luer <jake@alogicalparadox.com>
		 * MIT Licensed
		 */
		var promiseExists = typeof Promise === 'function';

		/* eslint-disable no-undef */
		var globalObject = typeof self === 'object' ? self : commonjsGlobal; // eslint-disable-line id-blacklist

		var symbolExists = typeof Symbol !== 'undefined';
		var mapExists = typeof Map !== 'undefined';
		var setExists = typeof Set !== 'undefined';
		var weakMapExists = typeof WeakMap !== 'undefined';
		var weakSetExists = typeof WeakSet !== 'undefined';
		var dataViewExists = typeof DataView !== 'undefined';
		var symbolIteratorExists = symbolExists && typeof Symbol.iterator !== 'undefined';
		var symbolToStringTagExists = symbolExists && typeof Symbol.toStringTag !== 'undefined';
		var setEntriesExists = setExists && typeof Set.prototype.entries === 'function';
		var mapEntriesExists = mapExists && typeof Map.prototype.entries === 'function';
		var setIteratorPrototype = setEntriesExists && Object.getPrototypeOf(new Set().entries());
		var mapIteratorPrototype = mapEntriesExists && Object.getPrototypeOf(new Map().entries());
		var arrayIteratorExists = symbolIteratorExists && typeof Array.prototype[Symbol.iterator] === 'function';
		var arrayIteratorPrototype = arrayIteratorExists && Object.getPrototypeOf([][Symbol.iterator]());
		var stringIteratorExists = symbolIteratorExists && typeof String.prototype[Symbol.iterator] === 'function';
		var stringIteratorPrototype = stringIteratorExists && Object.getPrototypeOf(''[Symbol.iterator]());
		var toStringLeftSliceLength = 8;
		var toStringRightSliceLength = -1;
		/**
		 * ### typeOf (obj)
		 *
		 * Uses `Object.prototype.toString` to determine the type of an object,
		 * normalising behaviour across engine versions & well optimised.
		 *
		 * @param {Mixed} object
		 * @return {String} object type
		 * @api public
		 */
		function typeDetect(obj) {
		  /* ! Speed optimisation
		   * Pre:
		   *   string literal     x 3,039,035 ops/sec ±1.62% (78 runs sampled)
		   *   boolean literal    x 1,424,138 ops/sec ±4.54% (75 runs sampled)
		   *   number literal     x 1,653,153 ops/sec ±1.91% (82 runs sampled)
		   *   undefined          x 9,978,660 ops/sec ±1.92% (75 runs sampled)
		   *   function           x 2,556,769 ops/sec ±1.73% (77 runs sampled)
		   * Post:
		   *   string literal     x 38,564,796 ops/sec ±1.15% (79 runs sampled)
		   *   boolean literal    x 31,148,940 ops/sec ±1.10% (79 runs sampled)
		   *   number literal     x 32,679,330 ops/sec ±1.90% (78 runs sampled)
		   *   undefined          x 32,363,368 ops/sec ±1.07% (82 runs sampled)
		   *   function           x 31,296,870 ops/sec ±0.96% (83 runs sampled)
		   */
		  var typeofObj = typeof obj;
		  if (typeofObj !== 'object') {
		    return typeofObj;
		  }

		  /* ! Speed optimisation
		   * Pre:
		   *   null               x 28,645,765 ops/sec ±1.17% (82 runs sampled)
		   * Post:
		   *   null               x 36,428,962 ops/sec ±1.37% (84 runs sampled)
		   */
		  if (obj === null) {
		    return 'null';
		  }

		  /* ! Spec Conformance
		   * Test: `Object.prototype.toString.call(window)``
		   *  - Node === "[object global]"
		   *  - Chrome === "[object global]"
		   *  - Firefox === "[object Window]"
		   *  - PhantomJS === "[object Window]"
		   *  - Safari === "[object Window]"
		   *  - IE 11 === "[object Window]"
		   *  - IE Edge === "[object Window]"
		   * Test: `Object.prototype.toString.call(this)``
		   *  - Chrome Worker === "[object global]"
		   *  - Firefox Worker === "[object DedicatedWorkerGlobalScope]"
		   *  - Safari Worker === "[object DedicatedWorkerGlobalScope]"
		   *  - IE 11 Worker === "[object WorkerGlobalScope]"
		   *  - IE Edge Worker === "[object WorkerGlobalScope]"
		   */
		  if (obj === globalObject) {
		    return 'global';
		  }

		  /* ! Speed optimisation
		   * Pre:
		   *   array literal      x 2,888,352 ops/sec ±0.67% (82 runs sampled)
		   * Post:
		   *   array literal      x 22,479,650 ops/sec ±0.96% (81 runs sampled)
		   */
		  if (
		    Array.isArray(obj) &&
		    (symbolToStringTagExists === false || !(Symbol.toStringTag in obj))
		  ) {
		    return 'Array';
		  }

		  // Not caching existence of `window` and related properties due to potential
		  // for `window` to be unset before tests in quasi-browser environments.
		  if (typeof window === 'object' && window !== null) {
		    /* ! Spec Conformance
		     * (https://html.spec.whatwg.org/multipage/browsers.html#location)
		     * WhatWG HTML$7.7.3 - The `Location` interface
		     * Test: `Object.prototype.toString.call(window.location)``
		     *  - IE <=11 === "[object Object]"
		     *  - IE Edge <=13 === "[object Object]"
		     */
		    if (typeof window.location === 'object' && obj === window.location) {
		      return 'Location';
		    }

		    /* ! Spec Conformance
		     * (https://html.spec.whatwg.org/#document)
		     * WhatWG HTML$3.1.1 - The `Document` object
		     * Note: Most browsers currently adher to the W3C DOM Level 2 spec
		     *       (https://www.w3.org/TR/DOM-Level-2-HTML/html.html#ID-26809268)
		     *       which suggests that browsers should use HTMLTableCellElement for
		     *       both TD and TH elements. WhatWG separates these.
		     *       WhatWG HTML states:
		     *         > For historical reasons, Window objects must also have a
		     *         > writable, configurable, non-enumerable property named
		     *         > HTMLDocument whose value is the Document interface object.
		     * Test: `Object.prototype.toString.call(document)``
		     *  - Chrome === "[object HTMLDocument]"
		     *  - Firefox === "[object HTMLDocument]"
		     *  - Safari === "[object HTMLDocument]"
		     *  - IE <=10 === "[object Document]"
		     *  - IE 11 === "[object HTMLDocument]"
		     *  - IE Edge <=13 === "[object HTMLDocument]"
		     */
		    if (typeof window.document === 'object' && obj === window.document) {
		      return 'Document';
		    }

		    if (typeof window.navigator === 'object') {
		      /* ! Spec Conformance
		       * (https://html.spec.whatwg.org/multipage/webappapis.html#mimetypearray)
		       * WhatWG HTML$8.6.1.5 - Plugins - Interface MimeTypeArray
		       * Test: `Object.prototype.toString.call(navigator.mimeTypes)``
		       *  - IE <=10 === "[object MSMimeTypesCollection]"
		       */
		      if (typeof window.navigator.mimeTypes === 'object' &&
		          obj === window.navigator.mimeTypes) {
		        return 'MimeTypeArray';
		      }

		      /* ! Spec Conformance
		       * (https://html.spec.whatwg.org/multipage/webappapis.html#pluginarray)
		       * WhatWG HTML$8.6.1.5 - Plugins - Interface PluginArray
		       * Test: `Object.prototype.toString.call(navigator.plugins)``
		       *  - IE <=10 === "[object MSPluginsCollection]"
		       */
		      if (typeof window.navigator.plugins === 'object' &&
		          obj === window.navigator.plugins) {
		        return 'PluginArray';
		      }
		    }

		    if ((typeof window.HTMLElement === 'function' ||
		        typeof window.HTMLElement === 'object') &&
		        obj instanceof window.HTMLElement) {
		      /* ! Spec Conformance
		      * (https://html.spec.whatwg.org/multipage/webappapis.html#pluginarray)
		      * WhatWG HTML$4.4.4 - The `blockquote` element - Interface `HTMLQuoteElement`
		      * Test: `Object.prototype.toString.call(document.createElement('blockquote'))``
		      *  - IE <=10 === "[object HTMLBlockElement]"
		      */
		      if (obj.tagName === 'BLOCKQUOTE') {
		        return 'HTMLQuoteElement';
		      }

		      /* ! Spec Conformance
		       * (https://html.spec.whatwg.org/#htmltabledatacellelement)
		       * WhatWG HTML$4.9.9 - The `td` element - Interface `HTMLTableDataCellElement`
		       * Note: Most browsers currently adher to the W3C DOM Level 2 spec
		       *       (https://www.w3.org/TR/DOM-Level-2-HTML/html.html#ID-82915075)
		       *       which suggests that browsers should use HTMLTableCellElement for
		       *       both TD and TH elements. WhatWG separates these.
		       * Test: Object.prototype.toString.call(document.createElement('td'))
		       *  - Chrome === "[object HTMLTableCellElement]"
		       *  - Firefox === "[object HTMLTableCellElement]"
		       *  - Safari === "[object HTMLTableCellElement]"
		       */
		      if (obj.tagName === 'TD') {
		        return 'HTMLTableDataCellElement';
		      }

		      /* ! Spec Conformance
		       * (https://html.spec.whatwg.org/#htmltableheadercellelement)
		       * WhatWG HTML$4.9.9 - The `td` element - Interface `HTMLTableHeaderCellElement`
		       * Note: Most browsers currently adher to the W3C DOM Level 2 spec
		       *       (https://www.w3.org/TR/DOM-Level-2-HTML/html.html#ID-82915075)
		       *       which suggests that browsers should use HTMLTableCellElement for
		       *       both TD and TH elements. WhatWG separates these.
		       * Test: Object.prototype.toString.call(document.createElement('th'))
		       *  - Chrome === "[object HTMLTableCellElement]"
		       *  - Firefox === "[object HTMLTableCellElement]"
		       *  - Safari === "[object HTMLTableCellElement]"
		       */
		      if (obj.tagName === 'TH') {
		        return 'HTMLTableHeaderCellElement';
		      }
		    }
		  }

		  /* ! Speed optimisation
		  * Pre:
		  *   Float64Array       x 625,644 ops/sec ±1.58% (80 runs sampled)
		  *   Float32Array       x 1,279,852 ops/sec ±2.91% (77 runs sampled)
		  *   Uint32Array        x 1,178,185 ops/sec ±1.95% (83 runs sampled)
		  *   Uint16Array        x 1,008,380 ops/sec ±2.25% (80 runs sampled)
		  *   Uint8Array         x 1,128,040 ops/sec ±2.11% (81 runs sampled)
		  *   Int32Array         x 1,170,119 ops/sec ±2.88% (80 runs sampled)
		  *   Int16Array         x 1,176,348 ops/sec ±5.79% (86 runs sampled)
		  *   Int8Array          x 1,058,707 ops/sec ±4.94% (77 runs sampled)
		  *   Uint8ClampedArray  x 1,110,633 ops/sec ±4.20% (80 runs sampled)
		  * Post:
		  *   Float64Array       x 7,105,671 ops/sec ±13.47% (64 runs sampled)
		  *   Float32Array       x 5,887,912 ops/sec ±1.46% (82 runs sampled)
		  *   Uint32Array        x 6,491,661 ops/sec ±1.76% (79 runs sampled)
		  *   Uint16Array        x 6,559,795 ops/sec ±1.67% (82 runs sampled)
		  *   Uint8Array         x 6,463,966 ops/sec ±1.43% (85 runs sampled)
		  *   Int32Array         x 5,641,841 ops/sec ±3.49% (81 runs sampled)
		  *   Int16Array         x 6,583,511 ops/sec ±1.98% (80 runs sampled)
		  *   Int8Array          x 6,606,078 ops/sec ±1.74% (81 runs sampled)
		  *   Uint8ClampedArray  x 6,602,224 ops/sec ±1.77% (83 runs sampled)
		  */
		  var stringTag = (symbolToStringTagExists && obj[Symbol.toStringTag]);
		  if (typeof stringTag === 'string') {
		    return stringTag;
		  }

		  var objPrototype = Object.getPrototypeOf(obj);
		  /* ! Speed optimisation
		  * Pre:
		  *   regex literal      x 1,772,385 ops/sec ±1.85% (77 runs sampled)
		  *   regex constructor  x 2,143,634 ops/sec ±2.46% (78 runs sampled)
		  * Post:
		  *   regex literal      x 3,928,009 ops/sec ±0.65% (78 runs sampled)
		  *   regex constructor  x 3,931,108 ops/sec ±0.58% (84 runs sampled)
		  */
		  if (objPrototype === RegExp.prototype) {
		    return 'RegExp';
		  }

		  /* ! Speed optimisation
		  * Pre:
		  *   date               x 2,130,074 ops/sec ±4.42% (68 runs sampled)
		  * Post:
		  *   date               x 3,953,779 ops/sec ±1.35% (77 runs sampled)
		  */
		  if (objPrototype === Date.prototype) {
		    return 'Date';
		  }

		  /* ! Spec Conformance
		   * (http://www.ecma-international.org/ecma-262/6.0/index.html#sec-promise.prototype-@@tostringtag)
		   * ES6$25.4.5.4 - Promise.prototype[@@toStringTag] should be "Promise":
		   * Test: `Object.prototype.toString.call(Promise.resolve())``
		   *  - Chrome <=47 === "[object Object]"
		   *  - Edge <=20 === "[object Object]"
		   *  - Firefox 29-Latest === "[object Promise]"
		   *  - Safari 7.1-Latest === "[object Promise]"
		   */
		  if (promiseExists && objPrototype === Promise.prototype) {
		    return 'Promise';
		  }

		  /* ! Speed optimisation
		  * Pre:
		  *   set                x 2,222,186 ops/sec ±1.31% (82 runs sampled)
		  * Post:
		  *   set                x 4,545,879 ops/sec ±1.13% (83 runs sampled)
		  */
		  if (setExists && objPrototype === Set.prototype) {
		    return 'Set';
		  }

		  /* ! Speed optimisation
		  * Pre:
		  *   map                x 2,396,842 ops/sec ±1.59% (81 runs sampled)
		  * Post:
		  *   map                x 4,183,945 ops/sec ±6.59% (82 runs sampled)
		  */
		  if (mapExists && objPrototype === Map.prototype) {
		    return 'Map';
		  }

		  /* ! Speed optimisation
		  * Pre:
		  *   weakset            x 1,323,220 ops/sec ±2.17% (76 runs sampled)
		  * Post:
		  *   weakset            x 4,237,510 ops/sec ±2.01% (77 runs sampled)
		  */
		  if (weakSetExists && objPrototype === WeakSet.prototype) {
		    return 'WeakSet';
		  }

		  /* ! Speed optimisation
		  * Pre:
		  *   weakmap            x 1,500,260 ops/sec ±2.02% (78 runs sampled)
		  * Post:
		  *   weakmap            x 3,881,384 ops/sec ±1.45% (82 runs sampled)
		  */
		  if (weakMapExists && objPrototype === WeakMap.prototype) {
		    return 'WeakMap';
		  }

		  /* ! Spec Conformance
		   * (http://www.ecma-international.org/ecma-262/6.0/index.html#sec-dataview.prototype-@@tostringtag)
		   * ES6$24.2.4.21 - DataView.prototype[@@toStringTag] should be "DataView":
		   * Test: `Object.prototype.toString.call(new DataView(new ArrayBuffer(1)))``
		   *  - Edge <=13 === "[object Object]"
		   */
		  if (dataViewExists && objPrototype === DataView.prototype) {
		    return 'DataView';
		  }

		  /* ! Spec Conformance
		   * (http://www.ecma-international.org/ecma-262/6.0/index.html#sec-%mapiteratorprototype%-@@tostringtag)
		   * ES6$23.1.5.2.2 - %MapIteratorPrototype%[@@toStringTag] should be "Map Iterator":
		   * Test: `Object.prototype.toString.call(new Map().entries())``
		   *  - Edge <=13 === "[object Object]"
		   */
		  if (mapExists && objPrototype === mapIteratorPrototype) {
		    return 'Map Iterator';
		  }

		  /* ! Spec Conformance
		   * (http://www.ecma-international.org/ecma-262/6.0/index.html#sec-%setiteratorprototype%-@@tostringtag)
		   * ES6$23.2.5.2.2 - %SetIteratorPrototype%[@@toStringTag] should be "Set Iterator":
		   * Test: `Object.prototype.toString.call(new Set().entries())``
		   *  - Edge <=13 === "[object Object]"
		   */
		  if (setExists && objPrototype === setIteratorPrototype) {
		    return 'Set Iterator';
		  }

		  /* ! Spec Conformance
		   * (http://www.ecma-international.org/ecma-262/6.0/index.html#sec-%arrayiteratorprototype%-@@tostringtag)
		   * ES6$22.1.5.2.2 - %ArrayIteratorPrototype%[@@toStringTag] should be "Array Iterator":
		   * Test: `Object.prototype.toString.call([][Symbol.iterator]())``
		   *  - Edge <=13 === "[object Object]"
		   */
		  if (arrayIteratorExists && objPrototype === arrayIteratorPrototype) {
		    return 'Array Iterator';
		  }

		  /* ! Spec Conformance
		   * (http://www.ecma-international.org/ecma-262/6.0/index.html#sec-%stringiteratorprototype%-@@tostringtag)
		   * ES6$21.1.5.2.2 - %StringIteratorPrototype%[@@toStringTag] should be "String Iterator":
		   * Test: `Object.prototype.toString.call(''[Symbol.iterator]())``
		   *  - Edge <=13 === "[object Object]"
		   */
		  if (stringIteratorExists && objPrototype === stringIteratorPrototype) {
		    return 'String Iterator';
		  }

		  /* ! Speed optimisation
		  * Pre:
		  *   object from null   x 2,424,320 ops/sec ±1.67% (76 runs sampled)
		  * Post:
		  *   object from null   x 5,838,000 ops/sec ±0.99% (84 runs sampled)
		  */
		  if (objPrototype === null) {
		    return 'Object';
		  }

		  return Object
		    .prototype
		    .toString
		    .call(obj)
		    .slice(toStringLeftSliceLength, toStringRightSliceLength);
		}

		return typeDetect;

		}))); 
	} (typeDetect));

	var typeDetectExports = typeDetect.exports;

	/*!
	 * Chai - expectTypes utility
	 * Copyright(c) 2012-2014 Jake Luer <jake@alogicalparadox.com>
	 * MIT Licensed
	 */

	/**
	 * ### .expectTypes(obj, types)
	 *
	 * Ensures that the object being tested against is of a valid type.
	 *
	 *     utils.expectTypes(this, ['array', 'object', 'string']);
	 *
	 * @param {Mixed} obj constructed Assertion
	 * @param {Array} type A list of allowed types for this assertion
	 * @namespace Utils
	 * @name expectTypes
	 * @api public
	 */

	var AssertionError = assertionError;
	var flag$3 = flag$5;
	var type$2 = typeDetectExports;

	var expectTypes = function expectTypes(obj, types) {
	  var flagMsg = flag$3(obj, 'message');
	  var ssfi = flag$3(obj, 'ssfi');

	  flagMsg = flagMsg ? flagMsg + ': ' : '';

	  obj = flag$3(obj, 'object');
	  types = types.map(function (t) { return t.toLowerCase(); });
	  types.sort();

	  // Transforms ['lorem', 'ipsum'] into 'a lorem, or an ipsum'
	  var str = types.map(function (t, index) {
	    var art = ~[ 'a', 'e', 'i', 'o', 'u' ].indexOf(t.charAt(0)) ? 'an' : 'a';
	    var or = types.length > 1 && index === types.length - 1 ? 'or ' : '';
	    return or + art + ' ' + t;
	  }).join(', ');

	  var objType = type$2(obj).toLowerCase();

	  if (!types.some(function (expected) { return objType === expected; })) {
	    throw new AssertionError(
	      flagMsg + 'object tested must be ' + str + ', but ' + objType + ' given',
	      undefined,
	      ssfi
	    );
	  }
	};

	/*!
	 * Chai - getActual utility
	 * Copyright(c) 2012-2014 Jake Luer <jake@alogicalparadox.com>
	 * MIT Licensed
	 */

	/**
	 * ### .getActual(object, [actual])
	 *
	 * Returns the `actual` value for an Assertion.
	 *
	 * @param {Object} object (constructed Assertion)
	 * @param {Arguments} chai.Assertion.prototype.assert arguments
	 * @namespace Utils
	 * @name getActual
	 */

	var getActual$1 = function getActual(obj, args) {
	  return args.length > 4 ? args[4] : obj._obj;
	};

	/* !
	 * Chai - getFuncName utility
	 * Copyright(c) 2012-2016 Jake Luer <jake@alogicalparadox.com>
	 * MIT Licensed
	 */

	/**
	 * ### .getFuncName(constructorFn)
	 *
	 * Returns the name of a function.
	 * When a non-function instance is passed, returns `null`.
	 * This also includes a polyfill function if `aFunc.name` is not defined.
	 *
	 * @name getFuncName
	 * @param {Function} funct
	 * @namespace Utils
	 * @api public
	 */

	var toString$2 = Function.prototype.toString;
	var functionNameMatch = /\s*function(?:\s|\s*\/\*[^(?:*\/)]+\*\/\s*)*([^\s\(\/]+)/;
	var maxFunctionSourceLength = 512;
	function getFuncName(aFunc) {
	  if (typeof aFunc !== 'function') {
	    return null;
	  }

	  var name = '';
	  if (typeof Function.prototype.name === 'undefined' && typeof aFunc.name === 'undefined') {
	    // eslint-disable-next-line prefer-reflect
	    var functionSource = toString$2.call(aFunc);
	    // To avoid unconstrained resource consumption due to pathalogically large function names,
	    // we limit the available return value to be less than 512 characters.
	    if (functionSource.indexOf('(') > maxFunctionSourceLength) {
	      return name;
	    }
	    // Here we run a polyfill if Function does not support the `name` property and if aFunc.name is not defined
	    var match = functionSource.match(functionNameMatch);
	    if (match) {
	      name = match[1];
	    }
	  } else {
	    // If we've got a `name` property we just use it
	    name = aFunc.name;
	  }

	  return name;
	}

	var getFuncName_1 = getFuncName;

	var getFuncName$1 = /*@__PURE__*/getDefaultExportFromCjs(getFuncName_1);

	const ansiColors = {
	  bold: ['1', '22'],
	  dim: ['2', '22'],
	  italic: ['3', '23'],
	  underline: ['4', '24'],
	  // 5 & 6 are blinking
	  inverse: ['7', '27'],
	  hidden: ['8', '28'],
	  strike: ['9', '29'],
	  // 10-20 are fonts
	  // 21-29 are resets for 1-9
	  black: ['30', '39'],
	  red: ['31', '39'],
	  green: ['32', '39'],
	  yellow: ['33', '39'],
	  blue: ['34', '39'],
	  magenta: ['35', '39'],
	  cyan: ['36', '39'],
	  white: ['37', '39'],

	  brightblack: ['30;1', '39'],
	  brightred: ['31;1', '39'],
	  brightgreen: ['32;1', '39'],
	  brightyellow: ['33;1', '39'],
	  brightblue: ['34;1', '39'],
	  brightmagenta: ['35;1', '39'],
	  brightcyan: ['36;1', '39'],
	  brightwhite: ['37;1', '39'],

	  grey: ['90', '39'],
	};

	const styles = {
	  special: 'cyan',
	  number: 'yellow',
	  bigint: 'yellow',
	  boolean: 'yellow',
	  undefined: 'grey',
	  null: 'bold',
	  string: 'green',
	  symbol: 'green',
	  date: 'magenta',
	  regexp: 'red',
	};

	const truncator = '…';

	function colorise(value, styleType) {
	  const color = ansiColors[styles[styleType]] || ansiColors[styleType];
	  if (!color) {
	    return String(value)
	  }
	  return `\u001b[${color[0]}m${String(value)}\u001b[${color[1]}m`
	}

	function normaliseOptions({
	  showHidden = false,
	  depth = 2,
	  colors = false,
	  customInspect = true,
	  showProxy = false,
	  maxArrayLength = Infinity,
	  breakLength = Infinity,
	  seen = [],
	  // eslint-disable-next-line no-shadow
	  truncate = Infinity,
	  stylize = String,
	} = {}) {
	  const options = {
	    showHidden: Boolean(showHidden),
	    depth: Number(depth),
	    colors: Boolean(colors),
	    customInspect: Boolean(customInspect),
	    showProxy: Boolean(showProxy),
	    maxArrayLength: Number(maxArrayLength),
	    breakLength: Number(breakLength),
	    truncate: Number(truncate),
	    seen,
	    stylize,
	  };
	  if (options.colors) {
	    options.stylize = colorise;
	  }
	  return options
	}

	function truncate(string, length, tail = truncator) {
	  string = String(string);
	  const tailLength = tail.length;
	  const stringLength = string.length;
	  if (tailLength > length && stringLength > tailLength) {
	    return tail
	  }
	  if (stringLength > length && stringLength > tailLength) {
	    return `${string.slice(0, length - tailLength)}${tail}`
	  }
	  return string
	}

	// eslint-disable-next-line complexity
	function inspectList(list, options, inspectItem, separator = ', ') {
	  inspectItem = inspectItem || options.inspect;
	  const size = list.length;
	  if (size === 0) return ''
	  const originalLength = options.truncate;
	  let output = '';
	  let peek = '';
	  let truncated = '';
	  for (let i = 0; i < size; i += 1) {
	    const last = i + 1 === list.length;
	    const secondToLast = i + 2 === list.length;
	    truncated = `${truncator}(${list.length - i})`;
	    const value = list[i];

	    // If there is more than one remaining we need to account for a separator of `, `
	    options.truncate = originalLength - output.length - (last ? 0 : separator.length);
	    const string = peek || inspectItem(value, options) + (last ? '' : separator);
	    const nextLength = output.length + string.length;
	    const truncatedLength = nextLength + truncated.length;

	    // If this is the last element, and adding it would
	    // take us over length, but adding the truncator wouldn't - then break now
	    if (last && nextLength > originalLength && output.length + truncated.length <= originalLength) {
	      break
	    }

	    // If this isn't the last or second to last element to scan,
	    // but the string is already over length then break here
	    if (!last && !secondToLast && truncatedLength > originalLength) {
	      break
	    }

	    // Peek at the next string to determine if we should
	    // break early before adding this item to the output
	    peek = last ? '' : inspectItem(list[i + 1], options) + (secondToLast ? '' : separator);

	    // If we have one element left, but this element and
	    // the next takes over length, the break early
	    if (!last && secondToLast && truncatedLength > originalLength && nextLength + peek.length > originalLength) {
	      break
	    }

	    output += string;

	    // If the next element takes us to length -
	    // but there are more after that, then we should truncate now
	    if (!last && !secondToLast && nextLength + peek.length >= originalLength) {
	      truncated = `${truncator}(${list.length - i - 1})`;
	      break
	    }

	    truncated = '';
	  }
	  return `${output}${truncated}`
	}

	function quoteComplexKey(key) {
	  if (key.match(/^[a-zA-Z_][a-zA-Z_0-9]*$/)) {
	    return key
	  }
	  return JSON.stringify(key)
	    .replace(/'/g, "\\'")
	    .replace(/\\"/g, '"')
	    .replace(/(^"|"$)/g, "'")
	}

	function inspectProperty([key, value], options) {
	  options.truncate -= 2;
	  if (typeof key === 'string') {
	    key = quoteComplexKey(key);
	  } else if (typeof key !== 'number') {
	    key = `[${options.inspect(key, options)}]`;
	  }
	  options.truncate -= key.length;
	  value = options.inspect(value, options);
	  return `${key}: ${value}`
	}

	function inspectArray(array, options) {
	  // Object.keys will always output the Array indices first, so we can slice by
	  // `array.length` to get non-index properties
	  const nonIndexProperties = Object.keys(array).slice(array.length);
	  if (!array.length && !nonIndexProperties.length) return '[]'
	  options.truncate -= 4;
	  const listContents = inspectList(array, options);
	  options.truncate -= listContents.length;
	  let propertyContents = '';
	  if (nonIndexProperties.length) {
	    propertyContents = inspectList(
	      nonIndexProperties.map(key => [key, array[key]]),
	      options,
	      inspectProperty
	    );
	  }
	  return `[ ${listContents}${propertyContents ? `, ${propertyContents}` : ''} ]`
	}

	const getArrayName = array => {
	  // We need to special case Node.js' Buffers, which report to be Uint8Array
	  if (typeof Buffer === 'function' && array instanceof Buffer) {
	    return 'Buffer'
	  }
	  if (array[Symbol.toStringTag]) {
	    return array[Symbol.toStringTag]
	  }
	  return getFuncName$1(array.constructor)
	};

	function inspectTypedArray(array, options) {
	  const name = getArrayName(array);
	  options.truncate -= name.length + 4;
	  // Object.keys will always output the Array indices first, so we can slice by
	  // `array.length` to get non-index properties
	  const nonIndexProperties = Object.keys(array).slice(array.length);
	  if (!array.length && !nonIndexProperties.length) return `${name}[]`
	  // As we know TypedArrays only contain Unsigned Integers, we can skip inspecting each one and simply
	  // stylise the toString() value of them
	  let output = '';
	  for (let i = 0; i < array.length; i++) {
	    const string = `${options.stylize(truncate(array[i], options.truncate), 'number')}${
      i === array.length - 1 ? '' : ', '
    }`;
	    options.truncate -= string.length;
	    if (array[i] !== array.length && options.truncate <= 3) {
	      output += `${truncator}(${array.length - array[i] + 1})`;
	      break
	    }
	    output += string;
	  }
	  let propertyContents = '';
	  if (nonIndexProperties.length) {
	    propertyContents = inspectList(
	      nonIndexProperties.map(key => [key, array[key]]),
	      options,
	      inspectProperty
	    );
	  }
	  return `${name}[ ${output}${propertyContents ? `, ${propertyContents}` : ''} ]`
	}

	function inspectDate(dateObject, options) {
	  const stringRepresentation = dateObject.toJSON();

	  if (stringRepresentation === null) {
	    return 'Invalid Date'
	  }

	  const split = stringRepresentation.split('T');
	  const date = split[0];
	  // If we need to - truncate the time portion, but never the date
	  return options.stylize(`${date}T${truncate(split[1], options.truncate - date.length - 1)}`, 'date')
	}

	function inspectFunction(func, options) {
	  const name = getFuncName$1(func);
	  if (!name) {
	    return options.stylize('[Function]', 'special')
	  }
	  return options.stylize(`[Function ${truncate(name, options.truncate - 11)}]`, 'special')
	}

	function inspectMapEntry([key, value], options) {
	  options.truncate -= 4;
	  key = options.inspect(key, options);
	  options.truncate -= key.length;
	  value = options.inspect(value, options);
	  return `${key} => ${value}`
	}

	// IE11 doesn't support `map.entries()`
	function mapToEntries(map) {
	  const entries = [];
	  map.forEach((value, key) => {
	    entries.push([key, value]);
	  });
	  return entries
	}

	function inspectMap(map, options) {
	  const size = map.size - 1;
	  if (size <= 0) {
	    return 'Map{}'
	  }
	  options.truncate -= 7;
	  return `Map{ ${inspectList(mapToEntries(map), options, inspectMapEntry)} }`
	}

	const isNaN$2 = Number.isNaN || (i => i !== i); // eslint-disable-line no-self-compare
	function inspectNumber(number, options) {
	  if (isNaN$2(number)) {
	    return options.stylize('NaN', 'number')
	  }
	  if (number === Infinity) {
	    return options.stylize('Infinity', 'number')
	  }
	  if (number === -Infinity) {
	    return options.stylize('-Infinity', 'number')
	  }
	  if (number === 0) {
	    return options.stylize(1 / number === Infinity ? '+0' : '-0', 'number')
	  }
	  return options.stylize(truncate(number, options.truncate), 'number')
	}

	function inspectBigInt(number, options) {
	  let nums = truncate(number.toString(), options.truncate - 1);
	  if (nums !== truncator) nums += 'n';
	  return options.stylize(nums, 'bigint')
	}

	function inspectRegExp(value, options) {
	  const flags = value.toString().split('/')[2];
	  const sourceLength = options.truncate - (2 + flags.length);
	  const source = value.source;
	  return options.stylize(`/${truncate(source, sourceLength)}/${flags}`, 'regexp')
	}

	// IE11 doesn't support `Array.from(set)`
	function arrayFromSet(set) {
	  const values = [];
	  set.forEach(value => {
	    values.push(value);
	  });
	  return values
	}

	function inspectSet(set, options) {
	  if (set.size === 0) return 'Set{}'
	  options.truncate -= 7;
	  return `Set{ ${inspectList(arrayFromSet(set), options)} }`
	}

	const stringEscapeChars = new RegExp(
	  "['\\u0000-\\u001f\\u007f-\\u009f\\u00ad\\u0600-\\u0604\\u070f\\u17b4\\u17b5" +
	    '\\u200c-\\u200f\\u2028-\\u202f\\u2060-\\u206f\\ufeff\\ufff0-\\uffff]',
	  'g'
	);

	const escapeCharacters = {
	  '\b': '\\b',
	  '\t': '\\t',
	  '\n': '\\n',
	  '\f': '\\f',
	  '\r': '\\r',
	  "'": "\\'",
	  '\\': '\\\\',
	};
	const hex = 16;
	const unicodeLength = 4;
	function escape(char) {
	  return escapeCharacters[char] || `\\u${`0000${char.charCodeAt(0).toString(hex)}`.slice(-unicodeLength)}`
	}

	function inspectString(string, options) {
	  if (stringEscapeChars.test(string)) {
	    string = string.replace(stringEscapeChars, escape);
	  }
	  return options.stylize(`'${truncate(string, options.truncate - 2)}'`, 'string')
	}

	function inspectSymbol(value) {
	  if ('description' in Symbol.prototype) {
	    return value.description ? `Symbol(${value.description})` : 'Symbol()'
	  }
	  return value.toString()
	}

	let getPromiseValue = () => 'Promise{…}';
	try {
	  const { getPromiseDetails, kPending, kRejected } = process.binding('util');
	  if (Array.isArray(getPromiseDetails(Promise.resolve()))) {
	    getPromiseValue = (value, options) => {
	      const [state, innerValue] = getPromiseDetails(value);
	      if (state === kPending) {
	        return 'Promise{<pending>}'
	      }
	      return `Promise${state === kRejected ? '!' : ''}{${options.inspect(innerValue, options)}}`
	    };
	  }
	} catch (notNode) {
	  /* ignore */
	}
	var inspectPromise = getPromiseValue;

	function inspectObject$1(object, options) {
	  const properties = Object.getOwnPropertyNames(object);
	  const symbols = Object.getOwnPropertySymbols ? Object.getOwnPropertySymbols(object) : [];
	  if (properties.length === 0 && symbols.length === 0) {
	    return '{}'
	  }
	  options.truncate -= 4;
	  options.seen = options.seen || [];
	  if (options.seen.indexOf(object) >= 0) {
	    return '[Circular]'
	  }
	  options.seen.push(object);
	  const propertyContents = inspectList(
	    properties.map(key => [key, object[key]]),
	    options,
	    inspectProperty
	  );
	  const symbolContents = inspectList(
	    symbols.map(key => [key, object[key]]),
	    options,
	    inspectProperty
	  );
	  options.seen.pop();
	  let sep = '';
	  if (propertyContents && symbolContents) {
	    sep = ', ';
	  }
	  return `{ ${propertyContents}${sep}${symbolContents} }`
	}

	const toStringTag = typeof Symbol !== 'undefined' && Symbol.toStringTag ? Symbol.toStringTag : false;

	function inspectClass(value, options) {
	  let name = '';
	  if (toStringTag && toStringTag in value) {
	    name = value[toStringTag];
	  }
	  name = name || getFuncName$1(value.constructor);
	  // Babel transforms anonymous classes to the name `_class`
	  if (!name || name === '_class') {
	    name = '<Anonymous Class>';
	  }
	  options.truncate -= name.length;
	  return `${name}${inspectObject$1(value, options)}`
	}

	function inspectArguments(args, options) {
	  if (args.length === 0) return 'Arguments[]'
	  options.truncate -= 13;
	  return `Arguments[ ${inspectList(args, options)} ]`
	}

	const errorKeys = [
	  'stack',
	  'line',
	  'column',
	  'name',
	  'message',
	  'fileName',
	  'lineNumber',
	  'columnNumber',
	  'number',
	  'description',
	];

	function inspectObject(error, options) {
	  const properties = Object.getOwnPropertyNames(error).filter(key => errorKeys.indexOf(key) === -1);
	  const name = error.name;
	  options.truncate -= name.length;
	  let message = '';
	  if (typeof error.message === 'string') {
	    message = truncate(error.message, options.truncate);
	  } else {
	    properties.unshift('message');
	  }
	  message = message ? `: ${message}` : '';
	  options.truncate -= message.length + 5;
	  const propertyContents = inspectList(
	    properties.map(key => [key, error[key]]),
	    options,
	    inspectProperty
	  );
	  return `${name}${message}${propertyContents ? ` { ${propertyContents} }` : ''}`
	}

	function inspectAttribute([key, value], options) {
	  options.truncate -= 3;
	  if (!value) {
	    return `${options.stylize(key, 'yellow')}`
	  }
	  return `${options.stylize(key, 'yellow')}=${options.stylize(`"${value}"`, 'string')}`
	}

	function inspectHTMLCollection(collection, options) {
	  // eslint-disable-next-line no-use-before-define
	  return inspectList(collection, options, inspectHTML, '\n')
	}

	function inspectHTML(element, options) {
	  const properties = element.getAttributeNames();
	  const name = element.tagName.toLowerCase();
	  const head = options.stylize(`<${name}`, 'special');
	  const headClose = options.stylize(`>`, 'special');
	  const tail = options.stylize(`</${name}>`, 'special');
	  options.truncate -= name.length * 2 + 5;
	  let propertyContents = '';
	  if (properties.length > 0) {
	    propertyContents += ' ';
	    propertyContents += inspectList(
	      properties.map(key => [key, element.getAttribute(key)]),
	      options,
	      inspectAttribute,
	      ' '
	    );
	  }
	  options.truncate -= propertyContents.length;
	  const truncate = options.truncate;
	  let children = inspectHTMLCollection(element.children, options);
	  if (children && children.length > truncate) {
	    children = `${truncator}(${element.children.length})`;
	  }
	  return `${head}${propertyContents}${headClose}${children}${tail}`
	}

	/* !
	 * loupe
	 * Copyright(c) 2013 Jake Luer <jake@alogicalparadox.com>
	 * MIT Licensed
	 */


	const symbolsSupported = typeof Symbol === 'function' && typeof Symbol.for === 'function';
	const chaiInspect = symbolsSupported ? Symbol.for('chai/inspect') : '@@chai/inspect';
	let nodeInspect = false;
	try {
	  // eslint-disable-next-line global-require
	  const nodeUtil = require('util');
	  nodeInspect = nodeUtil.inspect ? nodeUtil.inspect.custom : false;
	} catch (noNodeInspect) {
	  nodeInspect = false;
	}

	function FakeMap$1() {
	  // eslint-disable-next-line prefer-template
	  this.key = 'chai/loupe__' + Math.random() + Date.now();
	}
	FakeMap$1.prototype = {
	  // eslint-disable-next-line object-shorthand
	  get: function get(key) {
	    return key[this.key]
	  },
	  // eslint-disable-next-line object-shorthand
	  has: function has(key) {
	    return this.key in key
	  },
	  // eslint-disable-next-line object-shorthand
	  set: function set(key, value) {
	    if (Object.isExtensible(key)) {
	      Object.defineProperty(key, this.key, {
	        // eslint-disable-next-line object-shorthand
	        value: value,
	        configurable: true,
	      });
	    }
	  },
	};
	const constructorMap = new (typeof WeakMap === 'function' ? WeakMap : FakeMap$1)();
	const stringTagMap = {};
	const baseTypesMap = {
	  undefined: (value, options) => options.stylize('undefined', 'undefined'),
	  null: (value, options) => options.stylize(null, 'null'),

	  boolean: (value, options) => options.stylize(value, 'boolean'),
	  Boolean: (value, options) => options.stylize(value, 'boolean'),

	  number: inspectNumber,
	  Number: inspectNumber,

	  bigint: inspectBigInt,
	  BigInt: inspectBigInt,

	  string: inspectString,
	  String: inspectString,

	  function: inspectFunction,
	  Function: inspectFunction,

	  symbol: inspectSymbol,
	  // A Symbol polyfill will return `Symbol` not `symbol` from typedetect
	  Symbol: inspectSymbol,

	  Array: inspectArray,
	  Date: inspectDate,
	  Map: inspectMap,
	  Set: inspectSet,
	  RegExp: inspectRegExp,
	  Promise: inspectPromise,

	  // WeakSet, WeakMap are totally opaque to us
	  WeakSet: (value, options) => options.stylize('WeakSet{…}', 'special'),
	  WeakMap: (value, options) => options.stylize('WeakMap{…}', 'special'),

	  Arguments: inspectArguments,
	  Int8Array: inspectTypedArray,
	  Uint8Array: inspectTypedArray,
	  Uint8ClampedArray: inspectTypedArray,
	  Int16Array: inspectTypedArray,
	  Uint16Array: inspectTypedArray,
	  Int32Array: inspectTypedArray,
	  Uint32Array: inspectTypedArray,
	  Float32Array: inspectTypedArray,
	  Float64Array: inspectTypedArray,

	  Generator: () => '',
	  DataView: () => '',
	  ArrayBuffer: () => '',

	  Error: inspectObject,

	  HTMLCollection: inspectHTMLCollection,
	  NodeList: inspectHTMLCollection,
	};

	// eslint-disable-next-line complexity
	const inspectCustom = (value, options, type) => {
	  if (chaiInspect in value && typeof value[chaiInspect] === 'function') {
	    return value[chaiInspect](options)
	  }

	  if (nodeInspect && nodeInspect in value && typeof value[nodeInspect] === 'function') {
	    return value[nodeInspect](options.depth, options)
	  }

	  if ('inspect' in value && typeof value.inspect === 'function') {
	    return value.inspect(options.depth, options)
	  }

	  if ('constructor' in value && constructorMap.has(value.constructor)) {
	    return constructorMap.get(value.constructor)(value, options)
	  }

	  if (stringTagMap[type]) {
	    return stringTagMap[type](value, options)
	  }

	  return ''
	};

	const toString$1 = Object.prototype.toString;

	// eslint-disable-next-line complexity
	function inspect$3(value, options) {
	  options = normaliseOptions(options);
	  options.inspect = inspect$3;
	  const { customInspect } = options;
	  let type = value === null ? 'null' : typeof value;
	  if (type === 'object') {
	    type = toString$1.call(value).slice(8, -1);
	  }

	  // If it is a base value that we already support, then use Loupe's inspector
	  if (baseTypesMap[type]) {
	    return baseTypesMap[type](value, options)
	  }

	  // If `options.customInspect` is set to true then try to use the custom inspector
	  if (customInspect && value) {
	    const output = inspectCustom(value, options, type);
	    if (output) {
	      if (typeof output === 'string') return output
	      return inspect$3(output, options)
	    }
	  }

	  const proto = value ? Object.getPrototypeOf(value) : false;
	  // If it's a plain Object then use Loupe's inspector
	  if (proto === Object.prototype || proto === null) {
	    return inspectObject$1(value, options)
	  }

	  // Specifically account for HTMLElements
	  // eslint-disable-next-line no-undef
	  if (value && typeof HTMLElement === 'function' && value instanceof HTMLElement) {
	    return inspectHTML(value, options)
	  }

	  if ('constructor' in value) {
	    // If it is a class, inspect it like an object but add the constructor name
	    if (value.constructor !== Object) {
	      return inspectClass(value, options)
	    }

	    // If it is an object with an anonymous prototype, display it as an object.
	    return inspectObject$1(value, options)
	  }

	  // last chance to check if it's an object
	  if (value === Object(value)) {
	    return inspectObject$1(value, options)
	  }

	  // We have run out of options! Just stringify the value
	  return options.stylize(String(value), type)
	}

	function registerConstructor(constructor, inspector) {
	  if (constructorMap.has(constructor)) {
	    return false
	  }
	  constructorMap.set(constructor, inspector);
	  return true
	}

	function registerStringTag(stringTag, inspector) {
	  if (stringTag in stringTagMap) {
	    return false
	  }
	  stringTagMap[stringTag] = inspector;
	  return true
	}

	const custom = chaiInspect;

	var loupe$1 = /*#__PURE__*/Object.freeze({
		__proto__: null,
		custom: custom,
		default: inspect$3,
		inspect: inspect$3,
		registerConstructor: registerConstructor,
		registerStringTag: registerStringTag
	});

	var require$$1 = /*@__PURE__*/getAugmentedNamespace(loupe$1);

	var config$6 = {

	  /**
	   * ### config.includeStack
	   *
	   * User configurable property, influences whether stack trace
	   * is included in Assertion error message. Default of false
	   * suppresses stack trace in the error message.
	   *
	   *     chai.config.includeStack = true;  // enable stack on error
	   *
	   * @param {Boolean}
	   * @api public
	   */

	  includeStack: false,

	  /**
	   * ### config.showDiff
	   *
	   * User configurable property, influences whether or not
	   * the `showDiff` flag should be included in the thrown
	   * AssertionErrors. `false` will always be `false`; `true`
	   * will be true when the assertion has requested a diff
	   * be shown.
	   *
	   * @param {Boolean}
	   * @api public
	   */

	  showDiff: true,

	  /**
	   * ### config.truncateThreshold
	   *
	   * User configurable property, sets length threshold for actual and
	   * expected values in assertion errors. If this threshold is exceeded, for
	   * example for large data structures, the value is replaced with something
	   * like `[ Array(3) ]` or `{ Object (prop1, prop2) }`.
	   *
	   * Set it to zero if you want to disable truncating altogether.
	   *
	   * This is especially userful when doing assertions on arrays: having this
	   * set to a reasonable large value makes the failure messages readily
	   * inspectable.
	   *
	   *     chai.config.truncateThreshold = 0;  // disable truncating
	   *
	   * @param {Number}
	   * @api public
	   */

	  truncateThreshold: 40,

	  /**
	   * ### config.useProxy
	   *
	   * User configurable property, defines if chai will use a Proxy to throw
	   * an error when a non-existent property is read, which protects users
	   * from typos when using property-based assertions.
	   *
	   * Set it to false if you want to disable this feature.
	   *
	   *     chai.config.useProxy = false;  // disable use of Proxy
	   *
	   * This feature is automatically disabled regardless of this config value
	   * in environments that don't support proxies.
	   *
	   * @param {Boolean}
	   * @api public
	   */

	  useProxy: true,

	  /**
	   * ### config.proxyExcludedKeys
	   *
	   * User configurable property, defines which properties should be ignored
	   * instead of throwing an error if they do not exist on the assertion.
	   * This is only applied if the environment Chai is running in supports proxies and
	   * if the `useProxy` configuration setting is enabled.
	   * By default, `then` and `inspect` will not throw an error if they do not exist on the
	   * assertion object because the `.inspect` property is read by `util.inspect` (for example, when
	   * using `console.log` on the assertion object) and `.then` is necessary for promise type-checking.
	   *
	   *     // By default these keys will not throw an error if they do not exist on the assertion object
	   *     chai.config.proxyExcludedKeys = ['then', 'inspect'];
	   *
	   * @param {Array}
	   * @api public
	   */

	  proxyExcludedKeys: ['then', 'catch', 'inspect', 'toJSON'],

	  /**
	   * ### config.deepEqual
	   *
	   * User configurable property, defines which a custom function to use for deepEqual
	   * comparisons.
	   * By default, the function used is the one from the `deep-eql` package without custom comparator.
	   *
	   *     // use a custom comparator
	   *     chai.config.deepEqual = (expected, actual) => {
	   *        return chai.util.eql(expected, actual, {
	   *           comparator: (expected, actual) => {
	   *              // for non number comparison, use the default behavior
	   *              if(typeof expected !== 'number') return null;
	   *              // allow a difference of 10 between compared numbers
	   *              return typeof actual === 'number' && Math.abs(actual - expected) < 10
	   *           }
	   *        })
	   *     };
	   *
	   * @param {Function}
	   * @api public
	   */

	  deepEqual: null

	};

	var loupe = require$$1;
	var config$5 = config$6;

	var inspect_1 = inspect$2;

	/**
	 * ### .inspect(obj, [showHidden], [depth], [colors])
	 *
	 * Echoes the value of a value. Tries to print the value out
	 * in the best way possible given the different types.
	 *
	 * @param {Object} obj The object to print out.
	 * @param {Boolean} showHidden Flag that shows hidden (not enumerable)
	 *    properties of objects. Default is false.
	 * @param {Number} depth Depth in which to descend in object. Default is 2.
	 * @param {Boolean} colors Flag to turn on ANSI escape codes to color the
	 *    output. Default is false (no coloring).
	 * @namespace Utils
	 * @name inspect
	 */
	function inspect$2(obj, showHidden, depth, colors) {
	  var options = {
	    colors: colors,
	    depth: (typeof depth === 'undefined' ? 2 : depth),
	    showHidden: showHidden,
	    truncate: config$5.truncateThreshold ? config$5.truncateThreshold : Infinity,
	  };
	  return loupe.inspect(obj, options);
	}

	/*!
	 * Chai - flag utility
	 * Copyright(c) 2012-2014 Jake Luer <jake@alogicalparadox.com>
	 * MIT Licensed
	 */

	/*!
	 * Module dependencies
	 */

	var inspect$1 = inspect_1;
	var config$4 = config$6;

	/**
	 * ### .objDisplay(object)
	 *
	 * Determines if an object or an array matches
	 * criteria to be inspected in-line for error
	 * messages or should be truncated.
	 *
	 * @param {Mixed} javascript object to inspect
	 * @returns {string} stringified object
	 * @name objDisplay
	 * @namespace Utils
	 * @api public
	 */

	var objDisplay$1 = function objDisplay(obj) {
	  var str = inspect$1(obj)
	    , type = Object.prototype.toString.call(obj);

	  if (config$4.truncateThreshold && str.length >= config$4.truncateThreshold) {
	    if (type === '[object Function]') {
	      return !obj.name || obj.name === ''
	        ? '[Function]'
	        : '[Function: ' + obj.name + ']';
	    } else if (type === '[object Array]') {
	      return '[ Array(' + obj.length + ') ]';
	    } else if (type === '[object Object]') {
	      var keys = Object.keys(obj)
	        , kstr = keys.length > 2
	          ? keys.splice(0, 2).join(', ') + ', ...'
	          : keys.join(', ');
	      return '{ Object (' + kstr + ') }';
	    } else {
	      return str;
	    }
	  } else {
	    return str;
	  }
	};

	/*!
	 * Chai - message composition utility
	 * Copyright(c) 2012-2014 Jake Luer <jake@alogicalparadox.com>
	 * MIT Licensed
	 */

	/*!
	 * Module dependencies
	 */

	var flag$2 = flag$5
	  , getActual = getActual$1
	  , objDisplay = objDisplay$1;

	/**
	 * ### .getMessage(object, message, negateMessage)
	 *
	 * Construct the error message based on flags
	 * and template tags. Template tags will return
	 * a stringified inspection of the object referenced.
	 *
	 * Message template tags:
	 * - `#{this}` current asserted object
	 * - `#{act}` actual value
	 * - `#{exp}` expected value
	 *
	 * @param {Object} object (constructed Assertion)
	 * @param {Arguments} chai.Assertion.prototype.assert arguments
	 * @namespace Utils
	 * @name getMessage
	 * @api public
	 */

	var getMessage$1 = function getMessage(obj, args) {
	  var negate = flag$2(obj, 'negate')
	    , val = flag$2(obj, 'object')
	    , expected = args[3]
	    , actual = getActual(obj, args)
	    , msg = negate ? args[2] : args[1]
	    , flagMsg = flag$2(obj, 'message');

	  if(typeof msg === "function") msg = msg();
	  msg = msg || '';
	  msg = msg
	    .replace(/#\{this\}/g, function () { return objDisplay(val); })
	    .replace(/#\{act\}/g, function () { return objDisplay(actual); })
	    .replace(/#\{exp\}/g, function () { return objDisplay(expected); });

	  return flagMsg ? flagMsg + ': ' + msg : msg;
	};

	/*!
	 * Chai - transferFlags utility
	 * Copyright(c) 2012-2014 Jake Luer <jake@alogicalparadox.com>
	 * MIT Licensed
	 */

	/**
	 * ### .transferFlags(assertion, object, includeAll = true)
	 *
	 * Transfer all the flags for `assertion` to `object`. If
	 * `includeAll` is set to `false`, then the base Chai
	 * assertion flags (namely `object`, `ssfi`, `lockSsfi`,
	 * and `message`) will not be transferred.
	 *
	 *
	 *     var newAssertion = new Assertion();
	 *     utils.transferFlags(assertion, newAssertion);
	 *
	 *     var anotherAssertion = new Assertion(myObj);
	 *     utils.transferFlags(assertion, anotherAssertion, false);
	 *
	 * @param {Assertion} assertion the assertion to transfer the flags from
	 * @param {Object} object the object to transfer the flags to; usually a new assertion
	 * @param {Boolean} includeAll
	 * @namespace Utils
	 * @name transferFlags
	 * @api private
	 */

	var transferFlags = function transferFlags(assertion, object, includeAll) {
	  var flags = assertion.__flags || (assertion.__flags = Object.create(null));

	  if (!object.__flags) {
	    object.__flags = Object.create(null);
	  }

	  includeAll = arguments.length === 3 ? includeAll : true;

	  for (var flag in flags) {
	    if (includeAll ||
	        (flag !== 'object' && flag !== 'ssfi' && flag !== 'lockSsfi' && flag != 'message')) {
	      object.__flags[flag] = flags[flag];
	    }
	  }
	};

	var deepEql = {exports: {}};

	/* globals Symbol: false, Uint8Array: false, WeakMap: false */
	/*!
	 * deep-eql
	 * Copyright(c) 2013 Jake Luer <jake@alogicalparadox.com>
	 * MIT Licensed
	 */

	var type$1 = typeDetectExports;
	function FakeMap() {
	  this._key = 'chai/deep-eql__' + Math.random() + Date.now();
	}

	FakeMap.prototype = {
	  get: function get(key) {
	    return key[this._key];
	  },
	  set: function set(key, value) {
	    if (Object.isExtensible(key)) {
	      Object.defineProperty(key, this._key, {
	        value: value,
	        configurable: true,
	      });
	    }
	  },
	};

	var MemoizeMap = typeof WeakMap === 'function' ? WeakMap : FakeMap;
	/*!
	 * Check to see if the MemoizeMap has recorded a result of the two operands
	 *
	 * @param {Mixed} leftHandOperand
	 * @param {Mixed} rightHandOperand
	 * @param {MemoizeMap} memoizeMap
	 * @returns {Boolean|null} result
	*/
	function memoizeCompare(leftHandOperand, rightHandOperand, memoizeMap) {
	  // Technically, WeakMap keys can *only* be objects, not primitives.
	  if (!memoizeMap || isPrimitive(leftHandOperand) || isPrimitive(rightHandOperand)) {
	    return null;
	  }
	  var leftHandMap = memoizeMap.get(leftHandOperand);
	  if (leftHandMap) {
	    var result = leftHandMap.get(rightHandOperand);
	    if (typeof result === 'boolean') {
	      return result;
	    }
	  }
	  return null;
	}

	/*!
	 * Set the result of the equality into the MemoizeMap
	 *
	 * @param {Mixed} leftHandOperand
	 * @param {Mixed} rightHandOperand
	 * @param {MemoizeMap} memoizeMap
	 * @param {Boolean} result
	*/
	function memoizeSet(leftHandOperand, rightHandOperand, memoizeMap, result) {
	  // Technically, WeakMap keys can *only* be objects, not primitives.
	  if (!memoizeMap || isPrimitive(leftHandOperand) || isPrimitive(rightHandOperand)) {
	    return;
	  }
	  var leftHandMap = memoizeMap.get(leftHandOperand);
	  if (leftHandMap) {
	    leftHandMap.set(rightHandOperand, result);
	  } else {
	    leftHandMap = new MemoizeMap();
	    leftHandMap.set(rightHandOperand, result);
	    memoizeMap.set(leftHandOperand, leftHandMap);
	  }
	}

	/*!
	 * Primary Export
	 */

	deepEql.exports = deepEqual;
	deepEql.exports.MemoizeMap = MemoizeMap;

	/**
	 * Assert deeply nested sameValue equality between two objects of any type.
	 *
	 * @param {Mixed} leftHandOperand
	 * @param {Mixed} rightHandOperand
	 * @param {Object} [options] (optional) Additional options
	 * @param {Array} [options.comparator] (optional) Override default algorithm, determining custom equality.
	 * @param {Array} [options.memoize] (optional) Provide a custom memoization object which will cache the results of
	    complex objects for a speed boost. By passing `false` you can disable memoization, but this will cause circular
	    references to blow the stack.
	 * @return {Boolean} equal match
	 */
	function deepEqual(leftHandOperand, rightHandOperand, options) {
	  // If we have a comparator, we can't assume anything; so bail to its check first.
	  if (options && options.comparator) {
	    return extensiveDeepEqual(leftHandOperand, rightHandOperand, options);
	  }

	  var simpleResult = simpleEqual(leftHandOperand, rightHandOperand);
	  if (simpleResult !== null) {
	    return simpleResult;
	  }

	  // Deeper comparisons are pushed through to a larger function
	  return extensiveDeepEqual(leftHandOperand, rightHandOperand, options);
	}

	/**
	 * Many comparisons can be canceled out early via simple equality or primitive checks.
	 * @param {Mixed} leftHandOperand
	 * @param {Mixed} rightHandOperand
	 * @return {Boolean|null} equal match
	 */
	function simpleEqual(leftHandOperand, rightHandOperand) {
	  // Equal references (except for Numbers) can be returned early
	  if (leftHandOperand === rightHandOperand) {
	    // Handle +-0 cases
	    return leftHandOperand !== 0 || 1 / leftHandOperand === 1 / rightHandOperand;
	  }

	  // handle NaN cases
	  if (
	    leftHandOperand !== leftHandOperand && // eslint-disable-line no-self-compare
	    rightHandOperand !== rightHandOperand // eslint-disable-line no-self-compare
	  ) {
	    return true;
	  }

	  // Anything that is not an 'object', i.e. symbols, functions, booleans, numbers,
	  // strings, and undefined, can be compared by reference.
	  if (isPrimitive(leftHandOperand) || isPrimitive(rightHandOperand)) {
	    // Easy out b/c it would have passed the first equality check
	    return false;
	  }
	  return null;
	}

	/*!
	 * The main logic of the `deepEqual` function.
	 *
	 * @param {Mixed} leftHandOperand
	 * @param {Mixed} rightHandOperand
	 * @param {Object} [options] (optional) Additional options
	 * @param {Array} [options.comparator] (optional) Override default algorithm, determining custom equality.
	 * @param {Array} [options.memoize] (optional) Provide a custom memoization object which will cache the results of
	    complex objects for a speed boost. By passing `false` you can disable memoization, but this will cause circular
	    references to blow the stack.
	 * @return {Boolean} equal match
	*/
	function extensiveDeepEqual(leftHandOperand, rightHandOperand, options) {
	  options = options || {};
	  options.memoize = options.memoize === false ? false : options.memoize || new MemoizeMap();
	  var comparator = options && options.comparator;

	  // Check if a memoized result exists.
	  var memoizeResultLeft = memoizeCompare(leftHandOperand, rightHandOperand, options.memoize);
	  if (memoizeResultLeft !== null) {
	    return memoizeResultLeft;
	  }
	  var memoizeResultRight = memoizeCompare(rightHandOperand, leftHandOperand, options.memoize);
	  if (memoizeResultRight !== null) {
	    return memoizeResultRight;
	  }

	  // If a comparator is present, use it.
	  if (comparator) {
	    var comparatorResult = comparator(leftHandOperand, rightHandOperand);
	    // Comparators may return null, in which case we want to go back to default behavior.
	    if (comparatorResult === false || comparatorResult === true) {
	      memoizeSet(leftHandOperand, rightHandOperand, options.memoize, comparatorResult);
	      return comparatorResult;
	    }
	    // To allow comparators to override *any* behavior, we ran them first. Since it didn't decide
	    // what to do, we need to make sure to return the basic tests first before we move on.
	    var simpleResult = simpleEqual(leftHandOperand, rightHandOperand);
	    if (simpleResult !== null) {
	      // Don't memoize this, it takes longer to set/retrieve than to just compare.
	      return simpleResult;
	    }
	  }

	  var leftHandType = type$1(leftHandOperand);
	  if (leftHandType !== type$1(rightHandOperand)) {
	    memoizeSet(leftHandOperand, rightHandOperand, options.memoize, false);
	    return false;
	  }

	  // Temporarily set the operands in the memoize object to prevent blowing the stack
	  memoizeSet(leftHandOperand, rightHandOperand, options.memoize, true);

	  var result = extensiveDeepEqualByType(leftHandOperand, rightHandOperand, leftHandType, options);
	  memoizeSet(leftHandOperand, rightHandOperand, options.memoize, result);
	  return result;
	}

	function extensiveDeepEqualByType(leftHandOperand, rightHandOperand, leftHandType, options) {
	  switch (leftHandType) {
	    case 'String':
	    case 'Number':
	    case 'Boolean':
	    case 'Date':
	      // If these types are their instance types (e.g. `new Number`) then re-deepEqual against their values
	      return deepEqual(leftHandOperand.valueOf(), rightHandOperand.valueOf());
	    case 'Promise':
	    case 'Symbol':
	    case 'function':
	    case 'WeakMap':
	    case 'WeakSet':
	      return leftHandOperand === rightHandOperand;
	    case 'Error':
	      return keysEqual(leftHandOperand, rightHandOperand, [ 'name', 'message', 'code' ], options);
	    case 'Arguments':
	    case 'Int8Array':
	    case 'Uint8Array':
	    case 'Uint8ClampedArray':
	    case 'Int16Array':
	    case 'Uint16Array':
	    case 'Int32Array':
	    case 'Uint32Array':
	    case 'Float32Array':
	    case 'Float64Array':
	    case 'Array':
	      return iterableEqual(leftHandOperand, rightHandOperand, options);
	    case 'RegExp':
	      return regexpEqual(leftHandOperand, rightHandOperand);
	    case 'Generator':
	      return generatorEqual(leftHandOperand, rightHandOperand, options);
	    case 'DataView':
	      return iterableEqual(new Uint8Array(leftHandOperand.buffer), new Uint8Array(rightHandOperand.buffer), options);
	    case 'ArrayBuffer':
	      return iterableEqual(new Uint8Array(leftHandOperand), new Uint8Array(rightHandOperand), options);
	    case 'Set':
	      return entriesEqual(leftHandOperand, rightHandOperand, options);
	    case 'Map':
	      return entriesEqual(leftHandOperand, rightHandOperand, options);
	    case 'Temporal.PlainDate':
	    case 'Temporal.PlainTime':
	    case 'Temporal.PlainDateTime':
	    case 'Temporal.Instant':
	    case 'Temporal.ZonedDateTime':
	    case 'Temporal.PlainYearMonth':
	    case 'Temporal.PlainMonthDay':
	      return leftHandOperand.equals(rightHandOperand);
	    case 'Temporal.Duration':
	      return leftHandOperand.total('nanoseconds') === rightHandOperand.total('nanoseconds');
	    case 'Temporal.TimeZone':
	    case 'Temporal.Calendar':
	      return leftHandOperand.toString() === rightHandOperand.toString();
	    default:
	      return objectEqual(leftHandOperand, rightHandOperand, options);
	  }
	}

	/*!
	 * Compare two Regular Expressions for equality.
	 *
	 * @param {RegExp} leftHandOperand
	 * @param {RegExp} rightHandOperand
	 * @return {Boolean} result
	 */

	function regexpEqual(leftHandOperand, rightHandOperand) {
	  return leftHandOperand.toString() === rightHandOperand.toString();
	}

	/*!
	 * Compare two Sets/Maps for equality. Faster than other equality functions.
	 *
	 * @param {Set} leftHandOperand
	 * @param {Set} rightHandOperand
	 * @param {Object} [options] (Optional)
	 * @return {Boolean} result
	 */

	function entriesEqual(leftHandOperand, rightHandOperand, options) {
	  // IE11 doesn't support Set#entries or Set#@@iterator, so we need manually populate using Set#forEach
	  if (leftHandOperand.size !== rightHandOperand.size) {
	    return false;
	  }
	  if (leftHandOperand.size === 0) {
	    return true;
	  }
	  var leftHandItems = [];
	  var rightHandItems = [];
	  leftHandOperand.forEach(function gatherEntries(key, value) {
	    leftHandItems.push([ key, value ]);
	  });
	  rightHandOperand.forEach(function gatherEntries(key, value) {
	    rightHandItems.push([ key, value ]);
	  });
	  return iterableEqual(leftHandItems.sort(), rightHandItems.sort(), options);
	}

	/*!
	 * Simple equality for flat iterable objects such as Arrays, TypedArrays or Node.js buffers.
	 *
	 * @param {Iterable} leftHandOperand
	 * @param {Iterable} rightHandOperand
	 * @param {Object} [options] (Optional)
	 * @return {Boolean} result
	 */

	function iterableEqual(leftHandOperand, rightHandOperand, options) {
	  var length = leftHandOperand.length;
	  if (length !== rightHandOperand.length) {
	    return false;
	  }
	  if (length === 0) {
	    return true;
	  }
	  var index = -1;
	  while (++index < length) {
	    if (deepEqual(leftHandOperand[index], rightHandOperand[index], options) === false) {
	      return false;
	    }
	  }
	  return true;
	}

	/*!
	 * Simple equality for generator objects such as those returned by generator functions.
	 *
	 * @param {Iterable} leftHandOperand
	 * @param {Iterable} rightHandOperand
	 * @param {Object} [options] (Optional)
	 * @return {Boolean} result
	 */

	function generatorEqual(leftHandOperand, rightHandOperand, options) {
	  return iterableEqual(getGeneratorEntries(leftHandOperand), getGeneratorEntries(rightHandOperand), options);
	}

	/*!
	 * Determine if the given object has an @@iterator function.
	 *
	 * @param {Object} target
	 * @return {Boolean} `true` if the object has an @@iterator function.
	 */
	function hasIteratorFunction(target) {
	  return typeof Symbol !== 'undefined' &&
	    typeof target === 'object' &&
	    typeof Symbol.iterator !== 'undefined' &&
	    typeof target[Symbol.iterator] === 'function';
	}

	/*!
	 * Gets all iterator entries from the given Object. If the Object has no @@iterator function, returns an empty array.
	 * This will consume the iterator - which could have side effects depending on the @@iterator implementation.
	 *
	 * @param {Object} target
	 * @returns {Array} an array of entries from the @@iterator function
	 */
	function getIteratorEntries(target) {
	  if (hasIteratorFunction(target)) {
	    try {
	      return getGeneratorEntries(target[Symbol.iterator]());
	    } catch (iteratorError) {
	      return [];
	    }
	  }
	  return [];
	}

	/*!
	 * Gets all entries from a Generator. This will consume the generator - which could have side effects.
	 *
	 * @param {Generator} target
	 * @returns {Array} an array of entries from the Generator.
	 */
	function getGeneratorEntries(generator) {
	  var generatorResult = generator.next();
	  var accumulator = [ generatorResult.value ];
	  while (generatorResult.done === false) {
	    generatorResult = generator.next();
	    accumulator.push(generatorResult.value);
	  }
	  return accumulator;
	}

	/*!
	 * Gets all own and inherited enumerable keys from a target.
	 *
	 * @param {Object} target
	 * @returns {Array} an array of own and inherited enumerable keys from the target.
	 */
	function getEnumerableKeys(target) {
	  var keys = [];
	  for (var key in target) {
	    keys.push(key);
	  }
	  return keys;
	}

	function getEnumerableSymbols(target) {
	  var keys = [];
	  var allKeys = Object.getOwnPropertySymbols(target);
	  for (var i = 0; i < allKeys.length; i += 1) {
	    var key = allKeys[i];
	    if (Object.getOwnPropertyDescriptor(target, key).enumerable) {
	      keys.push(key);
	    }
	  }
	  return keys;
	}

	/*!
	 * Determines if two objects have matching values, given a set of keys. Defers to deepEqual for the equality check of
	 * each key. If any value of the given key is not equal, the function will return false (early).
	 *
	 * @param {Mixed} leftHandOperand
	 * @param {Mixed} rightHandOperand
	 * @param {Array} keys An array of keys to compare the values of leftHandOperand and rightHandOperand against
	 * @param {Object} [options] (Optional)
	 * @return {Boolean} result
	 */
	function keysEqual(leftHandOperand, rightHandOperand, keys, options) {
	  var length = keys.length;
	  if (length === 0) {
	    return true;
	  }
	  for (var i = 0; i < length; i += 1) {
	    if (deepEqual(leftHandOperand[keys[i]], rightHandOperand[keys[i]], options) === false) {
	      return false;
	    }
	  }
	  return true;
	}

	/*!
	 * Recursively check the equality of two Objects. Once basic sameness has been established it will defer to `deepEqual`
	 * for each enumerable key in the object.
	 *
	 * @param {Mixed} leftHandOperand
	 * @param {Mixed} rightHandOperand
	 * @param {Object} [options] (Optional)
	 * @return {Boolean} result
	 */
	function objectEqual(leftHandOperand, rightHandOperand, options) {
	  var leftHandKeys = getEnumerableKeys(leftHandOperand);
	  var rightHandKeys = getEnumerableKeys(rightHandOperand);
	  var leftHandSymbols = getEnumerableSymbols(leftHandOperand);
	  var rightHandSymbols = getEnumerableSymbols(rightHandOperand);
	  leftHandKeys = leftHandKeys.concat(leftHandSymbols);
	  rightHandKeys = rightHandKeys.concat(rightHandSymbols);

	  if (leftHandKeys.length && leftHandKeys.length === rightHandKeys.length) {
	    if (iterableEqual(mapSymbols(leftHandKeys).sort(), mapSymbols(rightHandKeys).sort()) === false) {
	      return false;
	    }
	    return keysEqual(leftHandOperand, rightHandOperand, leftHandKeys, options);
	  }

	  var leftHandEntries = getIteratorEntries(leftHandOperand);
	  var rightHandEntries = getIteratorEntries(rightHandOperand);
	  if (leftHandEntries.length && leftHandEntries.length === rightHandEntries.length) {
	    leftHandEntries.sort();
	    rightHandEntries.sort();
	    return iterableEqual(leftHandEntries, rightHandEntries, options);
	  }

	  if (leftHandKeys.length === 0 &&
	      leftHandEntries.length === 0 &&
	      rightHandKeys.length === 0 &&
	      rightHandEntries.length === 0) {
	    return true;
	  }

	  return false;
	}

	/*!
	 * Returns true if the argument is a primitive.
	 *
	 * This intentionally returns true for all objects that can be compared by reference,
	 * including functions and symbols.
	 *
	 * @param {Mixed} value
	 * @return {Boolean} result
	 */
	function isPrimitive(value) {
	  return value === null || typeof value !== 'object';
	}

	function mapSymbols(arr) {
	  return arr.map(function mapSymbol(entry) {
	    if (typeof entry === 'symbol') {
	      return entry.toString();
	    }

	    return entry;
	  });
	}

	var deepEqlExports = deepEql.exports;

	var config$3 = config$6;

	/*!
	 * Chai - isProxyEnabled helper
	 * Copyright(c) 2012-2014 Jake Luer <jake@alogicalparadox.com>
	 * MIT Licensed
	 */

	/**
	 * ### .isProxyEnabled()
	 *
	 * Helper function to check if Chai's proxy protection feature is enabled. If
	 * proxies are unsupported or disabled via the user's Chai config, then return
	 * false. Otherwise, return true.
	 *
	 * @namespace Utils
	 * @name isProxyEnabled
	 */

	var isProxyEnabled$1 = function isProxyEnabled() {
	  return config$3.useProxy &&
	    typeof Proxy !== 'undefined' &&
	    typeof Reflect !== 'undefined';
	};

	/*!
	 * Chai - addProperty utility
	 * Copyright(c) 2012-2014 Jake Luer <jake@alogicalparadox.com>
	 * MIT Licensed
	 */

	var addProperty;
	var hasRequiredAddProperty;

	function requireAddProperty () {
		if (hasRequiredAddProperty) return addProperty;
		hasRequiredAddProperty = 1;
		var chai = requireChai();
		var flag = flag$5;
		var isProxyEnabled = isProxyEnabled$1;
		var transferFlags$1 = transferFlags;

		/**
		 * ### .addProperty(ctx, name, getter)
		 *
		 * Adds a property to the prototype of an object.
		 *
		 *     utils.addProperty(chai.Assertion.prototype, 'foo', function () {
		 *       var obj = utils.flag(this, 'object');
		 *       new chai.Assertion(obj).to.be.instanceof(Foo);
		 *     });
		 *
		 * Can also be accessed directly from `chai.Assertion`.
		 *
		 *     chai.Assertion.addProperty('foo', fn);
		 *
		 * Then can be used as any other assertion.
		 *
		 *     expect(myFoo).to.be.foo;
		 *
		 * @param {Object} ctx object to which the property is added
		 * @param {String} name of property to add
		 * @param {Function} getter function to be used for name
		 * @namespace Utils
		 * @name addProperty
		 * @api public
		 */

		addProperty = function addProperty(ctx, name, getter) {
		  getter = getter === undefined ? function () {} : getter;

		  Object.defineProperty(ctx, name,
		    { get: function propertyGetter() {
		        // Setting the `ssfi` flag to `propertyGetter` causes this function to
		        // be the starting point for removing implementation frames from the
		        // stack trace of a failed assertion.
		        //
		        // However, we only want to use this function as the starting point if
		        // the `lockSsfi` flag isn't set and proxy protection is disabled.
		        //
		        // If the `lockSsfi` flag is set, then either this assertion has been
		        // overwritten by another assertion, or this assertion is being invoked
		        // from inside of another assertion. In the first case, the `ssfi` flag
		        // has already been set by the overwriting assertion. In the second
		        // case, the `ssfi` flag has already been set by the outer assertion.
		        //
		        // If proxy protection is enabled, then the `ssfi` flag has already been
		        // set by the proxy getter.
		        if (!isProxyEnabled() && !flag(this, 'lockSsfi')) {
		          flag(this, 'ssfi', propertyGetter);
		        }

		        var result = getter.call(this);
		        if (result !== undefined)
		          return result;

		        var newAssertion = new chai.Assertion();
		        transferFlags$1(this, newAssertion);
		        return newAssertion;
		      }
		    , configurable: true
		  });
		};
		return addProperty;
	}

	var fnLengthDesc = Object.getOwnPropertyDescriptor(function () {}, 'length');

	/*!
	 * Chai - addLengthGuard utility
	 * Copyright(c) 2012-2014 Jake Luer <jake@alogicalparadox.com>
	 * MIT Licensed
	 */

	/**
	 * ### .addLengthGuard(fn, assertionName, isChainable)
	 *
	 * Define `length` as a getter on the given uninvoked method assertion. The
	 * getter acts as a guard against chaining `length` directly off of an uninvoked
	 * method assertion, which is a problem because it references `function`'s
	 * built-in `length` property instead of Chai's `length` assertion. When the
	 * getter catches the user making this mistake, it throws an error with a
	 * helpful message.
	 *
	 * There are two ways in which this mistake can be made. The first way is by
	 * chaining the `length` assertion directly off of an uninvoked chainable
	 * method. In this case, Chai suggests that the user use `lengthOf` instead. The
	 * second way is by chaining the `length` assertion directly off of an uninvoked
	 * non-chainable method. Non-chainable methods must be invoked prior to
	 * chaining. In this case, Chai suggests that the user consult the docs for the
	 * given assertion.
	 *
	 * If the `length` property of functions is unconfigurable, then return `fn`
	 * without modification.
	 *
	 * Note that in ES6, the function's `length` property is configurable, so once
	 * support for legacy environments is dropped, Chai's `length` property can
	 * replace the built-in function's `length` property, and this length guard will
	 * no longer be necessary. In the mean time, maintaining consistency across all
	 * environments is the priority.
	 *
	 * @param {Function} fn
	 * @param {String} assertionName
	 * @param {Boolean} isChainable
	 * @namespace Utils
	 * @name addLengthGuard
	 */

	var addLengthGuard = function addLengthGuard (fn, assertionName, isChainable) {
	  if (!fnLengthDesc.configurable) return fn;

	  Object.defineProperty(fn, 'length', {
	    get: function () {
	      if (isChainable) {
	        throw Error('Invalid Chai property: ' + assertionName + '.length. Due' +
	          ' to a compatibility issue, "length" cannot directly follow "' +
	          assertionName + '". Use "' + assertionName + '.lengthOf" instead.');
	      }

	      throw Error('Invalid Chai property: ' + assertionName + '.length. See' +
	        ' docs for proper usage of "' + assertionName + '".');
	    }
	  });

	  return fn;
	};

	/*!
	 * Chai - getProperties utility
	 * Copyright(c) 2012-2014 Jake Luer <jake@alogicalparadox.com>
	 * MIT Licensed
	 */

	/**
	 * ### .getProperties(object)
	 *
	 * This allows the retrieval of property names of an object, enumerable or not,
	 * inherited or not.
	 *
	 * @param {Object} object
	 * @returns {Array}
	 * @namespace Utils
	 * @name getProperties
	 * @api public
	 */

	var getProperties$1 = function getProperties(object) {
	  var result = Object.getOwnPropertyNames(object);

	  function addProperty(property) {
	    if (result.indexOf(property) === -1) {
	      result.push(property);
	    }
	  }

	  var proto = Object.getPrototypeOf(object);
	  while (proto !== null) {
	    Object.getOwnPropertyNames(proto).forEach(addProperty);
	    proto = Object.getPrototypeOf(proto);
	  }

	  return result;
	};

	var config$2 = config$6;
	var flag$1 = flag$5;
	var getProperties = getProperties$1;
	var isProxyEnabled = isProxyEnabled$1;

	/*!
	 * Chai - proxify utility
	 * Copyright(c) 2012-2014 Jake Luer <jake@alogicalparadox.com>
	 * MIT Licensed
	 */

	/**
	 * ### .proxify(object)
	 *
	 * Return a proxy of given object that throws an error when a non-existent
	 * property is read. By default, the root cause is assumed to be a misspelled
	 * property, and thus an attempt is made to offer a reasonable suggestion from
	 * the list of existing properties. However, if a nonChainableMethodName is
	 * provided, then the root cause is instead a failure to invoke a non-chainable
	 * method prior to reading the non-existent property.
	 *
	 * If proxies are unsupported or disabled via the user's Chai config, then
	 * return object without modification.
	 *
	 * @param {Object} obj
	 * @param {String} nonChainableMethodName
	 * @namespace Utils
	 * @name proxify
	 */

	var builtins = ['__flags', '__methods', '_obj', 'assert'];

	var proxify = function proxify(obj, nonChainableMethodName) {
	  if (!isProxyEnabled()) return obj;

	  return new Proxy(obj, {
	    get: function proxyGetter(target, property) {
	      // This check is here because we should not throw errors on Symbol properties
	      // such as `Symbol.toStringTag`.
	      // The values for which an error should be thrown can be configured using
	      // the `config.proxyExcludedKeys` setting.
	      if (typeof property === 'string' &&
	          config$2.proxyExcludedKeys.indexOf(property) === -1 &&
	          !Reflect.has(target, property)) {
	        // Special message for invalid property access of non-chainable methods.
	        if (nonChainableMethodName) {
	          throw Error('Invalid Chai property: ' + nonChainableMethodName + '.' +
	            property + '. See docs for proper usage of "' +
	            nonChainableMethodName + '".');
	        }

	        // If the property is reasonably close to an existing Chai property,
	        // suggest that property to the user. Only suggest properties with a
	        // distance less than 4.
	        var suggestion = null;
	        var suggestionDistance = 4;
	        getProperties(target).forEach(function(prop) {
	          if (
	            !Object.prototype.hasOwnProperty(prop) &&
	            builtins.indexOf(prop) === -1
	          ) {
	            var dist = stringDistanceCapped(
	              property,
	              prop,
	              suggestionDistance
	            );
	            if (dist < suggestionDistance) {
	              suggestion = prop;
	              suggestionDistance = dist;
	            }
	          }
	        });

	        if (suggestion !== null) {
	          throw Error('Invalid Chai property: ' + property +
	            '. Did you mean "' + suggestion + '"?');
	        } else {
	          throw Error('Invalid Chai property: ' + property);
	        }
	      }

	      // Use this proxy getter as the starting point for removing implementation
	      // frames from the stack trace of a failed assertion. For property
	      // assertions, this prevents the proxy getter from showing up in the stack
	      // trace since it's invoked before the property getter. For method and
	      // chainable method assertions, this flag will end up getting changed to
	      // the method wrapper, which is good since this frame will no longer be in
	      // the stack once the method is invoked. Note that Chai builtin assertion
	      // properties such as `__flags` are skipped since this is only meant to
	      // capture the starting point of an assertion. This step is also skipped
	      // if the `lockSsfi` flag is set, thus indicating that this assertion is
	      // being called from within another assertion. In that case, the `ssfi`
	      // flag is already set to the outer assertion's starting point.
	      if (builtins.indexOf(property) === -1 && !flag$1(target, 'lockSsfi')) {
	        flag$1(target, 'ssfi', proxyGetter);
	      }

	      return Reflect.get(target, property);
	    }
	  });
	};

	/**
	 * # stringDistanceCapped(strA, strB, cap)
	 * Return the Levenshtein distance between two strings, but no more than cap.
	 * @param {string} strA
	 * @param {string} strB
	 * @param {number} number
	 * @return {number} min(string distance between strA and strB, cap)
	 * @api private
	 */

	function stringDistanceCapped(strA, strB, cap) {
	  if (Math.abs(strA.length - strB.length) >= cap) {
	    return cap;
	  }

	  var memo = [];
	  // `memo` is a two-dimensional array containing distances.
	  // memo[i][j] is the distance between strA.slice(0, i) and
	  // strB.slice(0, j).
	  for (var i = 0; i <= strA.length; i++) {
	    memo[i] = Array(strB.length + 1).fill(0);
	    memo[i][0] = i;
	  }
	  for (var j = 0; j < strB.length; j++) {
	    memo[0][j] = j;
	  }

	  for (var i = 1; i <= strA.length; i++) {
	    var ch = strA.charCodeAt(i - 1);
	    for (var j = 1; j <= strB.length; j++) {
	      if (Math.abs(i - j) >= cap) {
	        memo[i][j] = cap;
	        continue;
	      }
	      memo[i][j] = Math.min(
	        memo[i - 1][j] + 1,
	        memo[i][j - 1] + 1,
	        memo[i - 1][j - 1] +
	          (ch === strB.charCodeAt(j - 1) ? 0 : 1)
	      );
	    }
	  }

	  return memo[strA.length][strB.length];
	}

	/*!
	 * Chai - addMethod utility
	 * Copyright(c) 2012-2014 Jake Luer <jake@alogicalparadox.com>
	 * MIT Licensed
	 */

	var addMethod;
	var hasRequiredAddMethod;

	function requireAddMethod () {
		if (hasRequiredAddMethod) return addMethod;
		hasRequiredAddMethod = 1;
		var addLengthGuard$1 = addLengthGuard;
		var chai = requireChai();
		var flag = flag$5;
		var proxify$1 = proxify;
		var transferFlags$1 = transferFlags;

		/**
		 * ### .addMethod(ctx, name, method)
		 *
		 * Adds a method to the prototype of an object.
		 *
		 *     utils.addMethod(chai.Assertion.prototype, 'foo', function (str) {
		 *       var obj = utils.flag(this, 'object');
		 *       new chai.Assertion(obj).to.be.equal(str);
		 *     });
		 *
		 * Can also be accessed directly from `chai.Assertion`.
		 *
		 *     chai.Assertion.addMethod('foo', fn);
		 *
		 * Then can be used as any other assertion.
		 *
		 *     expect(fooStr).to.be.foo('bar');
		 *
		 * @param {Object} ctx object to which the method is added
		 * @param {String} name of method to add
		 * @param {Function} method function to be used for name
		 * @namespace Utils
		 * @name addMethod
		 * @api public
		 */

		addMethod = function addMethod(ctx, name, method) {
		  var methodWrapper = function () {
		    // Setting the `ssfi` flag to `methodWrapper` causes this function to be the
		    // starting point for removing implementation frames from the stack trace of
		    // a failed assertion.
		    //
		    // However, we only want to use this function as the starting point if the
		    // `lockSsfi` flag isn't set.
		    //
		    // If the `lockSsfi` flag is set, then either this assertion has been
		    // overwritten by another assertion, or this assertion is being invoked from
		    // inside of another assertion. In the first case, the `ssfi` flag has
		    // already been set by the overwriting assertion. In the second case, the
		    // `ssfi` flag has already been set by the outer assertion.
		    if (!flag(this, 'lockSsfi')) {
		      flag(this, 'ssfi', methodWrapper);
		    }

		    var result = method.apply(this, arguments);
		    if (result !== undefined)
		      return result;

		    var newAssertion = new chai.Assertion();
		    transferFlags$1(this, newAssertion);
		    return newAssertion;
		  };

		  addLengthGuard$1(methodWrapper, name, false);
		  ctx[name] = proxify$1(methodWrapper, name);
		};
		return addMethod;
	}

	/*!
	 * Chai - overwriteProperty utility
	 * Copyright(c) 2012-2014 Jake Luer <jake@alogicalparadox.com>
	 * MIT Licensed
	 */

	var overwriteProperty;
	var hasRequiredOverwriteProperty;

	function requireOverwriteProperty () {
		if (hasRequiredOverwriteProperty) return overwriteProperty;
		hasRequiredOverwriteProperty = 1;
		var chai = requireChai();
		var flag = flag$5;
		var isProxyEnabled = isProxyEnabled$1;
		var transferFlags$1 = transferFlags;

		/**
		 * ### .overwriteProperty(ctx, name, fn)
		 *
		 * Overwrites an already existing property getter and provides
		 * access to previous value. Must return function to use as getter.
		 *
		 *     utils.overwriteProperty(chai.Assertion.prototype, 'ok', function (_super) {
		 *       return function () {
		 *         var obj = utils.flag(this, 'object');
		 *         if (obj instanceof Foo) {
		 *           new chai.Assertion(obj.name).to.equal('bar');
		 *         } else {
		 *           _super.call(this);
		 *         }
		 *       }
		 *     });
		 *
		 *
		 * Can also be accessed directly from `chai.Assertion`.
		 *
		 *     chai.Assertion.overwriteProperty('foo', fn);
		 *
		 * Then can be used as any other assertion.
		 *
		 *     expect(myFoo).to.be.ok;
		 *
		 * @param {Object} ctx object whose property is to be overwritten
		 * @param {String} name of property to overwrite
		 * @param {Function} getter function that returns a getter function to be used for name
		 * @namespace Utils
		 * @name overwriteProperty
		 * @api public
		 */

		overwriteProperty = function overwriteProperty(ctx, name, getter) {
		  var _get = Object.getOwnPropertyDescriptor(ctx, name)
		    , _super = function () {};

		  if (_get && 'function' === typeof _get.get)
		    _super = _get.get;

		  Object.defineProperty(ctx, name,
		    { get: function overwritingPropertyGetter() {
		        // Setting the `ssfi` flag to `overwritingPropertyGetter` causes this
		        // function to be the starting point for removing implementation frames
		        // from the stack trace of a failed assertion.
		        //
		        // However, we only want to use this function as the starting point if
		        // the `lockSsfi` flag isn't set and proxy protection is disabled.
		        //
		        // If the `lockSsfi` flag is set, then either this assertion has been
		        // overwritten by another assertion, or this assertion is being invoked
		        // from inside of another assertion. In the first case, the `ssfi` flag
		        // has already been set by the overwriting assertion. In the second
		        // case, the `ssfi` flag has already been set by the outer assertion.
		        //
		        // If proxy protection is enabled, then the `ssfi` flag has already been
		        // set by the proxy getter.
		        if (!isProxyEnabled() && !flag(this, 'lockSsfi')) {
		          flag(this, 'ssfi', overwritingPropertyGetter);
		        }

		        // Setting the `lockSsfi` flag to `true` prevents the overwritten
		        // assertion from changing the `ssfi` flag. By this point, the `ssfi`
		        // flag is already set to the correct starting point for this assertion.
		        var origLockSsfi = flag(this, 'lockSsfi');
		        flag(this, 'lockSsfi', true);
		        var result = getter(_super).call(this);
		        flag(this, 'lockSsfi', origLockSsfi);

		        if (result !== undefined) {
		          return result;
		        }

		        var newAssertion = new chai.Assertion();
		        transferFlags$1(this, newAssertion);
		        return newAssertion;
		      }
		    , configurable: true
		  });
		};
		return overwriteProperty;
	}

	/*!
	 * Chai - overwriteMethod utility
	 * Copyright(c) 2012-2014 Jake Luer <jake@alogicalparadox.com>
	 * MIT Licensed
	 */

	var overwriteMethod;
	var hasRequiredOverwriteMethod;

	function requireOverwriteMethod () {
		if (hasRequiredOverwriteMethod) return overwriteMethod;
		hasRequiredOverwriteMethod = 1;
		var addLengthGuard$1 = addLengthGuard;
		var chai = requireChai();
		var flag = flag$5;
		var proxify$1 = proxify;
		var transferFlags$1 = transferFlags;

		/**
		 * ### .overwriteMethod(ctx, name, fn)
		 *
		 * Overwrites an already existing method and provides
		 * access to previous function. Must return function
		 * to be used for name.
		 *
		 *     utils.overwriteMethod(chai.Assertion.prototype, 'equal', function (_super) {
		 *       return function (str) {
		 *         var obj = utils.flag(this, 'object');
		 *         if (obj instanceof Foo) {
		 *           new chai.Assertion(obj.value).to.equal(str);
		 *         } else {
		 *           _super.apply(this, arguments);
		 *         }
		 *       }
		 *     });
		 *
		 * Can also be accessed directly from `chai.Assertion`.
		 *
		 *     chai.Assertion.overwriteMethod('foo', fn);
		 *
		 * Then can be used as any other assertion.
		 *
		 *     expect(myFoo).to.equal('bar');
		 *
		 * @param {Object} ctx object whose method is to be overwritten
		 * @param {String} name of method to overwrite
		 * @param {Function} method function that returns a function to be used for name
		 * @namespace Utils
		 * @name overwriteMethod
		 * @api public
		 */

		overwriteMethod = function overwriteMethod(ctx, name, method) {
		  var _method = ctx[name]
		    , _super = function () {
		      throw new Error(name + ' is not a function');
		    };

		  if (_method && 'function' === typeof _method)
		    _super = _method;

		  var overwritingMethodWrapper = function () {
		    // Setting the `ssfi` flag to `overwritingMethodWrapper` causes this
		    // function to be the starting point for removing implementation frames from
		    // the stack trace of a failed assertion.
		    //
		    // However, we only want to use this function as the starting point if the
		    // `lockSsfi` flag isn't set.
		    //
		    // If the `lockSsfi` flag is set, then either this assertion has been
		    // overwritten by another assertion, or this assertion is being invoked from
		    // inside of another assertion. In the first case, the `ssfi` flag has
		    // already been set by the overwriting assertion. In the second case, the
		    // `ssfi` flag has already been set by the outer assertion.
		    if (!flag(this, 'lockSsfi')) {
		      flag(this, 'ssfi', overwritingMethodWrapper);
		    }

		    // Setting the `lockSsfi` flag to `true` prevents the overwritten assertion
		    // from changing the `ssfi` flag. By this point, the `ssfi` flag is already
		    // set to the correct starting point for this assertion.
		    var origLockSsfi = flag(this, 'lockSsfi');
		    flag(this, 'lockSsfi', true);
		    var result = method(_super).apply(this, arguments);
		    flag(this, 'lockSsfi', origLockSsfi);

		    if (result !== undefined) {
		      return result;
		    }

		    var newAssertion = new chai.Assertion();
		    transferFlags$1(this, newAssertion);
		    return newAssertion;
		  };

		  addLengthGuard$1(overwritingMethodWrapper, name, false);
		  ctx[name] = proxify$1(overwritingMethodWrapper, name);
		};
		return overwriteMethod;
	}

	/*!
	 * Chai - addChainingMethod utility
	 * Copyright(c) 2012-2014 Jake Luer <jake@alogicalparadox.com>
	 * MIT Licensed
	 */

	var addChainableMethod;
	var hasRequiredAddChainableMethod;

	function requireAddChainableMethod () {
		if (hasRequiredAddChainableMethod) return addChainableMethod;
		hasRequiredAddChainableMethod = 1;
		/*!
		 * Module dependencies
		 */

		var addLengthGuard$1 = addLengthGuard;
		var chai = requireChai();
		var flag = flag$5;
		var proxify$1 = proxify;
		var transferFlags$1 = transferFlags;

		/*!
		 * Module variables
		 */

		// Check whether `Object.setPrototypeOf` is supported
		var canSetPrototype = typeof Object.setPrototypeOf === 'function';

		// Without `Object.setPrototypeOf` support, this module will need to add properties to a function.
		// However, some of functions' own props are not configurable and should be skipped.
		var testFn = function() {};
		var excludeNames = Object.getOwnPropertyNames(testFn).filter(function(name) {
		  var propDesc = Object.getOwnPropertyDescriptor(testFn, name);

		  // Note: PhantomJS 1.x includes `callee` as one of `testFn`'s own properties,
		  // but then returns `undefined` as the property descriptor for `callee`. As a
		  // workaround, we perform an otherwise unnecessary type-check for `propDesc`,
		  // and then filter it out if it's not an object as it should be.
		  if (typeof propDesc !== 'object')
		    return true;

		  return !propDesc.configurable;
		});

		// Cache `Function` properties
		var call  = Function.prototype.call,
		    apply = Function.prototype.apply;

		/**
		 * ### .addChainableMethod(ctx, name, method, chainingBehavior)
		 *
		 * Adds a method to an object, such that the method can also be chained.
		 *
		 *     utils.addChainableMethod(chai.Assertion.prototype, 'foo', function (str) {
		 *       var obj = utils.flag(this, 'object');
		 *       new chai.Assertion(obj).to.be.equal(str);
		 *     });
		 *
		 * Can also be accessed directly from `chai.Assertion`.
		 *
		 *     chai.Assertion.addChainableMethod('foo', fn, chainingBehavior);
		 *
		 * The result can then be used as both a method assertion, executing both `method` and
		 * `chainingBehavior`, or as a language chain, which only executes `chainingBehavior`.
		 *
		 *     expect(fooStr).to.be.foo('bar');
		 *     expect(fooStr).to.be.foo.equal('foo');
		 *
		 * @param {Object} ctx object to which the method is added
		 * @param {String} name of method to add
		 * @param {Function} method function to be used for `name`, when called
		 * @param {Function} chainingBehavior function to be called every time the property is accessed
		 * @namespace Utils
		 * @name addChainableMethod
		 * @api public
		 */

		addChainableMethod = function addChainableMethod(ctx, name, method, chainingBehavior) {
		  if (typeof chainingBehavior !== 'function') {
		    chainingBehavior = function () { };
		  }

		  var chainableBehavior = {
		      method: method
		    , chainingBehavior: chainingBehavior
		  };

		  // save the methods so we can overwrite them later, if we need to.
		  if (!ctx.__methods) {
		    ctx.__methods = {};
		  }
		  ctx.__methods[name] = chainableBehavior;

		  Object.defineProperty(ctx, name,
		    { get: function chainableMethodGetter() {
		        chainableBehavior.chainingBehavior.call(this);

		        var chainableMethodWrapper = function () {
		          // Setting the `ssfi` flag to `chainableMethodWrapper` causes this
		          // function to be the starting point for removing implementation
		          // frames from the stack trace of a failed assertion.
		          //
		          // However, we only want to use this function as the starting point if
		          // the `lockSsfi` flag isn't set.
		          //
		          // If the `lockSsfi` flag is set, then this assertion is being
		          // invoked from inside of another assertion. In this case, the `ssfi`
		          // flag has already been set by the outer assertion.
		          //
		          // Note that overwriting a chainable method merely replaces the saved
		          // methods in `ctx.__methods` instead of completely replacing the
		          // overwritten assertion. Therefore, an overwriting assertion won't
		          // set the `ssfi` or `lockSsfi` flags.
		          if (!flag(this, 'lockSsfi')) {
		            flag(this, 'ssfi', chainableMethodWrapper);
		          }

		          var result = chainableBehavior.method.apply(this, arguments);
		          if (result !== undefined) {
		            return result;
		          }

		          var newAssertion = new chai.Assertion();
		          transferFlags$1(this, newAssertion);
		          return newAssertion;
		        };

		        addLengthGuard$1(chainableMethodWrapper, name, true);

		        // Use `Object.setPrototypeOf` if available
		        if (canSetPrototype) {
		          // Inherit all properties from the object by replacing the `Function` prototype
		          var prototype = Object.create(this);
		          // Restore the `call` and `apply` methods from `Function`
		          prototype.call = call;
		          prototype.apply = apply;
		          Object.setPrototypeOf(chainableMethodWrapper, prototype);
		        }
		        // Otherwise, redefine all properties (slow!)
		        else {
		          var asserterNames = Object.getOwnPropertyNames(ctx);
		          asserterNames.forEach(function (asserterName) {
		            if (excludeNames.indexOf(asserterName) !== -1) {
		              return;
		            }

		            var pd = Object.getOwnPropertyDescriptor(ctx, asserterName);
		            Object.defineProperty(chainableMethodWrapper, asserterName, pd);
		          });
		        }

		        transferFlags$1(this, chainableMethodWrapper);
		        return proxify$1(chainableMethodWrapper);
		      }
		    , configurable: true
		  });
		};
		return addChainableMethod;
	}

	/*!
	 * Chai - overwriteChainableMethod utility
	 * Copyright(c) 2012-2014 Jake Luer <jake@alogicalparadox.com>
	 * MIT Licensed
	 */

	var overwriteChainableMethod;
	var hasRequiredOverwriteChainableMethod;

	function requireOverwriteChainableMethod () {
		if (hasRequiredOverwriteChainableMethod) return overwriteChainableMethod;
		hasRequiredOverwriteChainableMethod = 1;
		var chai = requireChai();
		var transferFlags$1 = transferFlags;

		/**
		 * ### .overwriteChainableMethod(ctx, name, method, chainingBehavior)
		 *
		 * Overwrites an already existing chainable method
		 * and provides access to the previous function or
		 * property.  Must return functions to be used for
		 * name.
		 *
		 *     utils.overwriteChainableMethod(chai.Assertion.prototype, 'lengthOf',
		 *       function (_super) {
		 *       }
		 *     , function (_super) {
		 *       }
		 *     );
		 *
		 * Can also be accessed directly from `chai.Assertion`.
		 *
		 *     chai.Assertion.overwriteChainableMethod('foo', fn, fn);
		 *
		 * Then can be used as any other assertion.
		 *
		 *     expect(myFoo).to.have.lengthOf(3);
		 *     expect(myFoo).to.have.lengthOf.above(3);
		 *
		 * @param {Object} ctx object whose method / property is to be overwritten
		 * @param {String} name of method / property to overwrite
		 * @param {Function} method function that returns a function to be used for name
		 * @param {Function} chainingBehavior function that returns a function to be used for property
		 * @namespace Utils
		 * @name overwriteChainableMethod
		 * @api public
		 */

		overwriteChainableMethod = function overwriteChainableMethod(ctx, name, method, chainingBehavior) {
		  var chainableBehavior = ctx.__methods[name];

		  var _chainingBehavior = chainableBehavior.chainingBehavior;
		  chainableBehavior.chainingBehavior = function overwritingChainableMethodGetter() {
		    var result = chainingBehavior(_chainingBehavior).call(this);
		    if (result !== undefined) {
		      return result;
		    }

		    var newAssertion = new chai.Assertion();
		    transferFlags$1(this, newAssertion);
		    return newAssertion;
		  };

		  var _method = chainableBehavior.method;
		  chainableBehavior.method = function overwritingChainableMethodWrapper() {
		    var result = method(_method).apply(this, arguments);
		    if (result !== undefined) {
		      return result;
		    }

		    var newAssertion = new chai.Assertion();
		    transferFlags$1(this, newAssertion);
		    return newAssertion;
		  };
		};
		return overwriteChainableMethod;
	}

	/*!
	 * Chai - compareByInspect utility
	 * Copyright(c) 2011-2016 Jake Luer <jake@alogicalparadox.com>
	 * MIT Licensed
	 */

	/*!
	 * Module dependencies
	 */

	var inspect = inspect_1;

	/**
	 * ### .compareByInspect(mixed, mixed)
	 *
	 * To be used as a compareFunction with Array.prototype.sort. Compares elements
	 * using inspect instead of default behavior of using toString so that Symbols
	 * and objects with irregular/missing toString can still be sorted without a
	 * TypeError.
	 *
	 * @param {Mixed} first element to compare
	 * @param {Mixed} second element to compare
	 * @returns {Number} -1 if 'a' should come before 'b'; otherwise 1
	 * @name compareByInspect
	 * @namespace Utils
	 * @api public
	 */

	var compareByInspect = function compareByInspect(a, b) {
	  return inspect(a) < inspect(b) ? -1 : 1;
	};

	/*!
	 * Chai - getOwnEnumerablePropertySymbols utility
	 * Copyright(c) 2011-2016 Jake Luer <jake@alogicalparadox.com>
	 * MIT Licensed
	 */

	/**
	 * ### .getOwnEnumerablePropertySymbols(object)
	 *
	 * This allows the retrieval of directly-owned enumerable property symbols of an
	 * object. This function is necessary because Object.getOwnPropertySymbols
	 * returns both enumerable and non-enumerable property symbols.
	 *
	 * @param {Object} object
	 * @returns {Array}
	 * @namespace Utils
	 * @name getOwnEnumerablePropertySymbols
	 * @api public
	 */

	var getOwnEnumerablePropertySymbols$1 = function getOwnEnumerablePropertySymbols(obj) {
	  if (typeof Object.getOwnPropertySymbols !== 'function') return [];

	  return Object.getOwnPropertySymbols(obj).filter(function (sym) {
	    return Object.getOwnPropertyDescriptor(obj, sym).enumerable;
	  });
	};

	/*!
	 * Chai - getOwnEnumerableProperties utility
	 * Copyright(c) 2011-2016 Jake Luer <jake@alogicalparadox.com>
	 * MIT Licensed
	 */

	/*!
	 * Module dependencies
	 */

	var getOwnEnumerablePropertySymbols = getOwnEnumerablePropertySymbols$1;

	/**
	 * ### .getOwnEnumerableProperties(object)
	 *
	 * This allows the retrieval of directly-owned enumerable property names and
	 * symbols of an object. This function is necessary because Object.keys only
	 * returns enumerable property names, not enumerable property symbols.
	 *
	 * @param {Object} object
	 * @returns {Array}
	 * @namespace Utils
	 * @name getOwnEnumerableProperties
	 * @api public
	 */

	var getOwnEnumerableProperties = function getOwnEnumerableProperties(obj) {
	  return Object.keys(obj).concat(getOwnEnumerablePropertySymbols(obj));
	};

	/* !
	 * Chai - checkError utility
	 * Copyright(c) 2012-2016 Jake Luer <jake@alogicalparadox.com>
	 * MIT Licensed
	 */

	var getFunctionName = getFuncName_1;
	/**
	 * ### .checkError
	 *
	 * Checks that an error conforms to a given set of criteria and/or retrieves information about it.
	 *
	 * @api public
	 */

	/**
	 * ### .compatibleInstance(thrown, errorLike)
	 *
	 * Checks if two instances are compatible (strict equal).
	 * Returns false if errorLike is not an instance of Error, because instances
	 * can only be compatible if they're both error instances.
	 *
	 * @name compatibleInstance
	 * @param {Error} thrown error
	 * @param {Error|ErrorConstructor} errorLike object to compare against
	 * @namespace Utils
	 * @api public
	 */

	function compatibleInstance(thrown, errorLike) {
	  return errorLike instanceof Error && thrown === errorLike;
	}

	/**
	 * ### .compatibleConstructor(thrown, errorLike)
	 *
	 * Checks if two constructors are compatible.
	 * This function can receive either an error constructor or
	 * an error instance as the `errorLike` argument.
	 * Constructors are compatible if they're the same or if one is
	 * an instance of another.
	 *
	 * @name compatibleConstructor
	 * @param {Error} thrown error
	 * @param {Error|ErrorConstructor} errorLike object to compare against
	 * @namespace Utils
	 * @api public
	 */

	function compatibleConstructor(thrown, errorLike) {
	  if (errorLike instanceof Error) {
	    // If `errorLike` is an instance of any error we compare their constructors
	    return thrown.constructor === errorLike.constructor || thrown instanceof errorLike.constructor;
	  } else if (errorLike.prototype instanceof Error || errorLike === Error) {
	    // If `errorLike` is a constructor that inherits from Error, we compare `thrown` to `errorLike` directly
	    return thrown.constructor === errorLike || thrown instanceof errorLike;
	  }

	  return false;
	}

	/**
	 * ### .compatibleMessage(thrown, errMatcher)
	 *
	 * Checks if an error's message is compatible with a matcher (String or RegExp).
	 * If the message contains the String or passes the RegExp test,
	 * it is considered compatible.
	 *
	 * @name compatibleMessage
	 * @param {Error} thrown error
	 * @param {String|RegExp} errMatcher to look for into the message
	 * @namespace Utils
	 * @api public
	 */

	function compatibleMessage(thrown, errMatcher) {
	  var comparisonString = typeof thrown === 'string' ? thrown : thrown.message;
	  if (errMatcher instanceof RegExp) {
	    return errMatcher.test(comparisonString);
	  } else if (typeof errMatcher === 'string') {
	    return comparisonString.indexOf(errMatcher) !== -1; // eslint-disable-line no-magic-numbers
	  }

	  return false;
	}

	/**
	 * ### .getConstructorName(errorLike)
	 *
	 * Gets the constructor name for an Error instance or constructor itself.
	 *
	 * @name getConstructorName
	 * @param {Error|ErrorConstructor} errorLike
	 * @namespace Utils
	 * @api public
	 */

	function getConstructorName(errorLike) {
	  var constructorName = errorLike;
	  if (errorLike instanceof Error) {
	    constructorName = getFunctionName(errorLike.constructor);
	  } else if (typeof errorLike === 'function') {
	    // If `err` is not an instance of Error it is an error constructor itself or another function.
	    // If we've got a common function we get its name, otherwise we may need to create a new instance
	    // of the error just in case it's a poorly-constructed error. Please see chaijs/chai/issues/45 to know more.
	    constructorName = getFunctionName(errorLike);
	    if (constructorName === '') {
	      var newConstructorName = getFunctionName(new errorLike()); // eslint-disable-line new-cap
	      constructorName = newConstructorName || constructorName;
	    }
	  }

	  return constructorName;
	}

	/**
	 * ### .getMessage(errorLike)
	 *
	 * Gets the error message from an error.
	 * If `err` is a String itself, we return it.
	 * If the error has no message, we return an empty string.
	 *
	 * @name getMessage
	 * @param {Error|String} errorLike
	 * @namespace Utils
	 * @api public
	 */

	function getMessage(errorLike) {
	  var msg = '';
	  if (errorLike && errorLike.message) {
	    msg = errorLike.message;
	  } else if (typeof errorLike === 'string') {
	    msg = errorLike;
	  }

	  return msg;
	}

	var checkError = {
	  compatibleInstance: compatibleInstance,
	  compatibleConstructor: compatibleConstructor,
	  compatibleMessage: compatibleMessage,
	  getMessage: getMessage,
	  getConstructorName: getConstructorName,
	};

	/*!
	 * Chai - isNaN utility
	 * Copyright(c) 2012-2015 Sakthipriyan Vairamani <thechargingvolcano@gmail.com>
	 * MIT Licensed
	 */

	/**
	 * ### .isNaN(value)
	 *
	 * Checks if the given value is NaN or not.
	 *
	 *     utils.isNaN(NaN); // true
	 *
	 * @param {Value} The value which has to be checked if it is NaN
	 * @name isNaN
	 * @api private
	 */

	function isNaN$1(value) {
	  // Refer http://www.ecma-international.org/ecma-262/6.0/#sec-isnan-number
	  // section's NOTE.
	  return value !== value;
	}

	// If ECMAScript 6's Number.isNaN is present, prefer that.
	var _isNaN = Number.isNaN || isNaN$1;

	var type = typeDetectExports;

	var flag = flag$5;

	function isObjectType(obj) {
	  var objectType = type(obj);
	  var objectTypes = ['Array', 'Object', 'function'];

	  return objectTypes.indexOf(objectType) !== -1;
	}

	/**
	 * ### .getOperator(message)
	 *
	 * Extract the operator from error message.
	 * Operator defined is based on below link
	 * https://nodejs.org/api/assert.html#assert_assert.
	 *
	 * Returns the `operator` or `undefined` value for an Assertion.
	 *
	 * @param {Object} object (constructed Assertion)
	 * @param {Arguments} chai.Assertion.prototype.assert arguments
	 * @namespace Utils
	 * @name getOperator
	 * @api public
	 */

	var getOperator = function getOperator(obj, args) {
	  var operator = flag(obj, 'operator');
	  var negate = flag(obj, 'negate');
	  var expected = args[3];
	  var msg = negate ? args[2] : args[1];

	  if (operator) {
	    return operator;
	  }

	  if (typeof msg === 'function') msg = msg();

	  msg = msg || '';
	  if (!msg) {
	    return undefined;
	  }

	  if (/\shave\s/.test(msg)) {
	    return undefined;
	  }

	  var isObject = isObjectType(expected);
	  if (/\snot\s/.test(msg)) {
	    return isObject ? 'notDeepStrictEqual' : 'notStrictEqual';
	  }

	  return isObject ? 'deepStrictEqual' : 'strictEqual';
	};

	/*!
	 * chai
	 * Copyright(c) 2011 Jake Luer <jake@alogicalparadox.com>
	 * MIT Licensed
	 */

	var hasRequiredUtils;

	function requireUtils () {
		if (hasRequiredUtils) return utils$1;
		hasRequiredUtils = 1;
		/*!
		 * Dependencies that are used for multiple exports are required here only once
		 */

		var pathval$1 = pathval;

		/*!
		 * test utility
		 */

		utils$1.test = test$1;

		/*!
		 * type utility
		 */

		utils$1.type = typeDetectExports;

		/*!
		 * expectTypes utility
		 */
		utils$1.expectTypes = expectTypes;

		/*!
		 * message utility
		 */

		utils$1.getMessage = getMessage$1;

		/*!
		 * actual utility
		 */

		utils$1.getActual = getActual$1;

		/*!
		 * Inspect util
		 */

		utils$1.inspect = inspect_1;

		/*!
		 * Object Display util
		 */

		utils$1.objDisplay = objDisplay$1;

		/*!
		 * Flag utility
		 */

		utils$1.flag = flag$5;

		/*!
		 * Flag transferring utility
		 */

		utils$1.transferFlags = transferFlags;

		/*!
		 * Deep equal utility
		 */

		utils$1.eql = deepEqlExports;

		/*!
		 * Deep path info
		 */

		utils$1.getPathInfo = pathval$1.getPathInfo;

		/*!
		 * Check if a property exists
		 */

		utils$1.hasProperty = pathval$1.hasProperty;

		/*!
		 * Function name
		 */

		utils$1.getName = getFuncName_1;

		/*!
		 * add Property
		 */

		utils$1.addProperty = requireAddProperty();

		/*!
		 * add Method
		 */

		utils$1.addMethod = requireAddMethod();

		/*!
		 * overwrite Property
		 */

		utils$1.overwriteProperty = requireOverwriteProperty();

		/*!
		 * overwrite Method
		 */

		utils$1.overwriteMethod = requireOverwriteMethod();

		/*!
		 * Add a chainable method
		 */

		utils$1.addChainableMethod = requireAddChainableMethod();

		/*!
		 * Overwrite chainable method
		 */

		utils$1.overwriteChainableMethod = requireOverwriteChainableMethod();

		/*!
		 * Compare by inspect method
		 */

		utils$1.compareByInspect = compareByInspect;

		/*!
		 * Get own enumerable property symbols method
		 */

		utils$1.getOwnEnumerablePropertySymbols = getOwnEnumerablePropertySymbols$1;

		/*!
		 * Get own enumerable properties method
		 */

		utils$1.getOwnEnumerableProperties = getOwnEnumerableProperties;

		/*!
		 * Checks error against a given set of criteria
		 */

		utils$1.checkError = checkError;

		/*!
		 * Proxify util
		 */

		utils$1.proxify = proxify;

		/*!
		 * addLengthGuard util
		 */

		utils$1.addLengthGuard = addLengthGuard;

		/*!
		 * isProxyEnabled helper
		 */

		utils$1.isProxyEnabled = isProxyEnabled$1;

		/*!
		 * isNaN method
		 */

		utils$1.isNaN = _isNaN;

		/*!
		 * getOperator method
		 */

		utils$1.getOperator = getOperator;
		return utils$1;
	}

	/*!
	 * chai
	 * http://chaijs.com
	 * Copyright(c) 2011-2014 Jake Luer <jake@alogicalparadox.com>
	 * MIT Licensed
	 */

	var config$1 = config$6;

	var assertion = function (_chai, util) {
	  /*!
	   * Module dependencies.
	   */

	  var AssertionError = _chai.AssertionError
	    , flag = util.flag;

	  /*!
	   * Module export.
	   */

	  _chai.Assertion = Assertion;

	  /*!
	   * Assertion Constructor
	   *
	   * Creates object for chaining.
	   *
	   * `Assertion` objects contain metadata in the form of flags. Three flags can
	   * be assigned during instantiation by passing arguments to this constructor:
	   *
	   * - `object`: This flag contains the target of the assertion. For example, in
	   *   the assertion `expect(numKittens).to.equal(7);`, the `object` flag will
	   *   contain `numKittens` so that the `equal` assertion can reference it when
	   *   needed.
	   *
	   * - `message`: This flag contains an optional custom error message to be
	   *   prepended to the error message that's generated by the assertion when it
	   *   fails.
	   *
	   * - `ssfi`: This flag stands for "start stack function indicator". It
	   *   contains a function reference that serves as the starting point for
	   *   removing frames from the stack trace of the error that's created by the
	   *   assertion when it fails. The goal is to provide a cleaner stack trace to
	   *   end users by removing Chai's internal functions. Note that it only works
	   *   in environments that support `Error.captureStackTrace`, and only when
	   *   `Chai.config.includeStack` hasn't been set to `false`.
	   *
	   * - `lockSsfi`: This flag controls whether or not the given `ssfi` flag
	   *   should retain its current value, even as assertions are chained off of
	   *   this object. This is usually set to `true` when creating a new assertion
	   *   from within another assertion. It's also temporarily set to `true` before
	   *   an overwritten assertion gets called by the overwriting assertion.
	   *
	   * - `eql`: This flag contains the deepEqual function to be used by the assertion.
	   *
	   * @param {Mixed} obj target of the assertion
	   * @param {String} msg (optional) custom error message
	   * @param {Function} ssfi (optional) starting point for removing stack frames
	   * @param {Boolean} lockSsfi (optional) whether or not the ssfi flag is locked
	   * @api private
	   */

	  function Assertion (obj, msg, ssfi, lockSsfi) {
	    flag(this, 'ssfi', ssfi || Assertion);
	    flag(this, 'lockSsfi', lockSsfi);
	    flag(this, 'object', obj);
	    flag(this, 'message', msg);
	    flag(this, 'eql', config$1.deepEqual || util.eql);

	    return util.proxify(this);
	  }

	  Object.defineProperty(Assertion, 'includeStack', {
	    get: function() {
	      console.warn('Assertion.includeStack is deprecated, use chai.config.includeStack instead.');
	      return config$1.includeStack;
	    },
	    set: function(value) {
	      console.warn('Assertion.includeStack is deprecated, use chai.config.includeStack instead.');
	      config$1.includeStack = value;
	    }
	  });

	  Object.defineProperty(Assertion, 'showDiff', {
	    get: function() {
	      console.warn('Assertion.showDiff is deprecated, use chai.config.showDiff instead.');
	      return config$1.showDiff;
	    },
	    set: function(value) {
	      console.warn('Assertion.showDiff is deprecated, use chai.config.showDiff instead.');
	      config$1.showDiff = value;
	    }
	  });

	  Assertion.addProperty = function (name, fn) {
	    util.addProperty(this.prototype, name, fn);
	  };

	  Assertion.addMethod = function (name, fn) {
	    util.addMethod(this.prototype, name, fn);
	  };

	  Assertion.addChainableMethod = function (name, fn, chainingBehavior) {
	    util.addChainableMethod(this.prototype, name, fn, chainingBehavior);
	  };

	  Assertion.overwriteProperty = function (name, fn) {
	    util.overwriteProperty(this.prototype, name, fn);
	  };

	  Assertion.overwriteMethod = function (name, fn) {
	    util.overwriteMethod(this.prototype, name, fn);
	  };

	  Assertion.overwriteChainableMethod = function (name, fn, chainingBehavior) {
	    util.overwriteChainableMethod(this.prototype, name, fn, chainingBehavior);
	  };

	  /**
	   * ### .assert(expression, message, negateMessage, expected, actual, showDiff)
	   *
	   * Executes an expression and check expectations. Throws AssertionError for reporting if test doesn't pass.
	   *
	   * @name assert
	   * @param {Philosophical} expression to be tested
	   * @param {String|Function} message or function that returns message to display if expression fails
	   * @param {String|Function} negatedMessage or function that returns negatedMessage to display if negated expression fails
	   * @param {Mixed} expected value (remember to check for negation)
	   * @param {Mixed} actual (optional) will default to `this.obj`
	   * @param {Boolean} showDiff (optional) when set to `true`, assert will display a diff in addition to the message if expression fails
	   * @api private
	   */

	  Assertion.prototype.assert = function (expr, msg, negateMsg, expected, _actual, showDiff) {
	    var ok = util.test(this, arguments);
	    if (false !== showDiff) showDiff = true;
	    if (undefined === expected && undefined === _actual) showDiff = false;
	    if (true !== config$1.showDiff) showDiff = false;

	    if (!ok) {
	      msg = util.getMessage(this, arguments);
	      var actual = util.getActual(this, arguments);
	      var assertionErrorObjectProperties = {
	          actual: actual
	        , expected: expected
	        , showDiff: showDiff
	      };

	      var operator = util.getOperator(this, arguments);
	      if (operator) {
	        assertionErrorObjectProperties.operator = operator;
	      }

	      throw new AssertionError(
	        msg,
	        assertionErrorObjectProperties,
	        (config$1.includeStack) ? this.assert : flag(this, 'ssfi'));
	    }
	  };

	  /*!
	   * ### ._obj
	   *
	   * Quick reference to stored `actual` value for plugin developers.
	   *
	   * @api private
	   */

	  Object.defineProperty(Assertion.prototype, '_obj',
	    { get: function () {
	        return flag(this, 'object');
	      }
	    , set: function (val) {
	        flag(this, 'object', val);
	      }
	  });
	};

	/*!
	 * chai
	 * http://chaijs.com
	 * Copyright(c) 2011-2014 Jake Luer <jake@alogicalparadox.com>
	 * MIT Licensed
	 */

	var assertions = function (chai, _) {
	  var Assertion = chai.Assertion
	    , AssertionError = chai.AssertionError
	    , flag = _.flag;

	  /**
	   * ### Language Chains
	   *
	   * The following are provided as chainable getters to improve the readability
	   * of your assertions.
	   *
	   * **Chains**
	   *
	   * - to
	   * - be
	   * - been
	   * - is
	   * - that
	   * - which
	   * - and
	   * - has
	   * - have
	   * - with
	   * - at
	   * - of
	   * - same
	   * - but
	   * - does
	   * - still
	   * - also
	   *
	   * @name language chains
	   * @namespace BDD
	   * @api public
	   */

	  [ 'to', 'be', 'been', 'is'
	  , 'and', 'has', 'have', 'with'
	  , 'that', 'which', 'at', 'of'
	  , 'same', 'but', 'does', 'still', "also" ].forEach(function (chain) {
	    Assertion.addProperty(chain);
	  });

	  /**
	   * ### .not
	   *
	   * Negates all assertions that follow in the chain.
	   *
	   *     expect(function () {}).to.not.throw();
	   *     expect({a: 1}).to.not.have.property('b');
	   *     expect([1, 2]).to.be.an('array').that.does.not.include(3);
	   *
	   * Just because you can negate any assertion with `.not` doesn't mean you
	   * should. With great power comes great responsibility. It's often best to
	   * assert that the one expected output was produced, rather than asserting
	   * that one of countless unexpected outputs wasn't produced. See individual
	   * assertions for specific guidance.
	   *
	   *     expect(2).to.equal(2); // Recommended
	   *     expect(2).to.not.equal(1); // Not recommended
	   *
	   * @name not
	   * @namespace BDD
	   * @api public
	   */

	  Assertion.addProperty('not', function () {
	    flag(this, 'negate', true);
	  });

	  /**
	   * ### .deep
	   *
	   * Causes all `.equal`, `.include`, `.members`, `.keys`, and `.property`
	   * assertions that follow in the chain to use deep equality instead of strict
	   * (`===`) equality. See the `deep-eql` project page for info on the deep
	   * equality algorithm: https://github.com/chaijs/deep-eql.
	   *
	   *     // Target object deeply (but not strictly) equals `{a: 1}`
	   *     expect({a: 1}).to.deep.equal({a: 1});
	   *     expect({a: 1}).to.not.equal({a: 1});
	   *
	   *     // Target array deeply (but not strictly) includes `{a: 1}`
	   *     expect([{a: 1}]).to.deep.include({a: 1});
	   *     expect([{a: 1}]).to.not.include({a: 1});
	   *
	   *     // Target object deeply (but not strictly) includes `x: {a: 1}`
	   *     expect({x: {a: 1}}).to.deep.include({x: {a: 1}});
	   *     expect({x: {a: 1}}).to.not.include({x: {a: 1}});
	   *
	   *     // Target array deeply (but not strictly) has member `{a: 1}`
	   *     expect([{a: 1}]).to.have.deep.members([{a: 1}]);
	   *     expect([{a: 1}]).to.not.have.members([{a: 1}]);
	   *
	   *     // Target set deeply (but not strictly) has key `{a: 1}`
	   *     expect(new Set([{a: 1}])).to.have.deep.keys([{a: 1}]);
	   *     expect(new Set([{a: 1}])).to.not.have.keys([{a: 1}]);
	   *
	   *     // Target object deeply (but not strictly) has property `x: {a: 1}`
	   *     expect({x: {a: 1}}).to.have.deep.property('x', {a: 1});
	   *     expect({x: {a: 1}}).to.not.have.property('x', {a: 1});
	   *
	   * @name deep
	   * @namespace BDD
	   * @api public
	   */

	  Assertion.addProperty('deep', function () {
	    flag(this, 'deep', true);
	  });

	  /**
	   * ### .nested
	   *
	   * Enables dot- and bracket-notation in all `.property` and `.include`
	   * assertions that follow in the chain.
	   *
	   *     expect({a: {b: ['x', 'y']}}).to.have.nested.property('a.b[1]');
	   *     expect({a: {b: ['x', 'y']}}).to.nested.include({'a.b[1]': 'y'});
	   *
	   * If `.` or `[]` are part of an actual property name, they can be escaped by
	   * adding two backslashes before them.
	   *
	   *     expect({'.a': {'[b]': 'x'}}).to.have.nested.property('\\.a.\\[b\\]');
	   *     expect({'.a': {'[b]': 'x'}}).to.nested.include({'\\.a.\\[b\\]': 'x'});
	   *
	   * `.nested` cannot be combined with `.own`.
	   *
	   * @name nested
	   * @namespace BDD
	   * @api public
	   */

	  Assertion.addProperty('nested', function () {
	    flag(this, 'nested', true);
	  });

	  /**
	   * ### .own
	   *
	   * Causes all `.property` and `.include` assertions that follow in the chain
	   * to ignore inherited properties.
	   *
	   *     Object.prototype.b = 2;
	   *
	   *     expect({a: 1}).to.have.own.property('a');
	   *     expect({a: 1}).to.have.property('b');
	   *     expect({a: 1}).to.not.have.own.property('b');
	   *
	   *     expect({a: 1}).to.own.include({a: 1});
	   *     expect({a: 1}).to.include({b: 2}).but.not.own.include({b: 2});
	   *
	   * `.own` cannot be combined with `.nested`.
	   *
	   * @name own
	   * @namespace BDD
	   * @api public
	   */

	  Assertion.addProperty('own', function () {
	    flag(this, 'own', true);
	  });

	  /**
	   * ### .ordered
	   *
	   * Causes all `.members` assertions that follow in the chain to require that
	   * members be in the same order.
	   *
	   *     expect([1, 2]).to.have.ordered.members([1, 2])
	   *       .but.not.have.ordered.members([2, 1]);
	   *
	   * When `.include` and `.ordered` are combined, the ordering begins at the
	   * start of both arrays.
	   *
	   *     expect([1, 2, 3]).to.include.ordered.members([1, 2])
	   *       .but.not.include.ordered.members([2, 3]);
	   *
	   * @name ordered
	   * @namespace BDD
	   * @api public
	   */

	  Assertion.addProperty('ordered', function () {
	    flag(this, 'ordered', true);
	  });

	  /**
	   * ### .any
	   *
	   * Causes all `.keys` assertions that follow in the chain to only require that
	   * the target have at least one of the given keys. This is the opposite of
	   * `.all`, which requires that the target have all of the given keys.
	   *
	   *     expect({a: 1, b: 2}).to.not.have.any.keys('c', 'd');
	   *
	   * See the `.keys` doc for guidance on when to use `.any` or `.all`.
	   *
	   * @name any
	   * @namespace BDD
	   * @api public
	   */

	  Assertion.addProperty('any', function () {
	    flag(this, 'any', true);
	    flag(this, 'all', false);
	  });

	  /**
	   * ### .all
	   *
	   * Causes all `.keys` assertions that follow in the chain to require that the
	   * target have all of the given keys. This is the opposite of `.any`, which
	   * only requires that the target have at least one of the given keys.
	   *
	   *     expect({a: 1, b: 2}).to.have.all.keys('a', 'b');
	   *
	   * Note that `.all` is used by default when neither `.all` nor `.any` are
	   * added earlier in the chain. However, it's often best to add `.all` anyway
	   * because it improves readability.
	   *
	   * See the `.keys` doc for guidance on when to use `.any` or `.all`.
	   *
	   * @name all
	   * @namespace BDD
	   * @api public
	   */

	  Assertion.addProperty('all', function () {
	    flag(this, 'all', true);
	    flag(this, 'any', false);
	  });

	  /**
	   * ### .a(type[, msg])
	   *
	   * Asserts that the target's type is equal to the given string `type`. Types
	   * are case insensitive. See the `type-detect` project page for info on the
	   * type detection algorithm: https://github.com/chaijs/type-detect.
	   *
	   *     expect('foo').to.be.a('string');
	   *     expect({a: 1}).to.be.an('object');
	   *     expect(null).to.be.a('null');
	   *     expect(undefined).to.be.an('undefined');
	   *     expect(new Error).to.be.an('error');
	   *     expect(Promise.resolve()).to.be.a('promise');
	   *     expect(new Float32Array).to.be.a('float32array');
	   *     expect(Symbol()).to.be.a('symbol');
	   *
	   * `.a` supports objects that have a custom type set via `Symbol.toStringTag`.
	   *
	   *     var myObj = {
	   *       [Symbol.toStringTag]: 'myCustomType'
	   *     };
	   *
	   *     expect(myObj).to.be.a('myCustomType').but.not.an('object');
	   *
	   * It's often best to use `.a` to check a target's type before making more
	   * assertions on the same target. That way, you avoid unexpected behavior from
	   * any assertion that does different things based on the target's type.
	   *
	   *     expect([1, 2, 3]).to.be.an('array').that.includes(2);
	   *     expect([]).to.be.an('array').that.is.empty;
	   *
	   * Add `.not` earlier in the chain to negate `.a`. However, it's often best to
	   * assert that the target is the expected type, rather than asserting that it
	   * isn't one of many unexpected types.
	   *
	   *     expect('foo').to.be.a('string'); // Recommended
	   *     expect('foo').to.not.be.an('array'); // Not recommended
	   *
	   * `.a` accepts an optional `msg` argument which is a custom error message to
	   * show when the assertion fails. The message can also be given as the second
	   * argument to `expect`.
	   *
	   *     expect(1).to.be.a('string', 'nooo why fail??');
	   *     expect(1, 'nooo why fail??').to.be.a('string');
	   *
	   * `.a` can also be used as a language chain to improve the readability of
	   * your assertions.
	   *
	   *     expect({b: 2}).to.have.a.property('b');
	   *
	   * The alias `.an` can be used interchangeably with `.a`.
	   *
	   * @name a
	   * @alias an
	   * @param {String} type
	   * @param {String} msg _optional_
	   * @namespace BDD
	   * @api public
	   */

	  function an (type, msg) {
	    if (msg) flag(this, 'message', msg);
	    type = type.toLowerCase();
	    var obj = flag(this, 'object')
	      , article = ~[ 'a', 'e', 'i', 'o', 'u' ].indexOf(type.charAt(0)) ? 'an ' : 'a ';

	    this.assert(
	        type === _.type(obj).toLowerCase()
	      , 'expected #{this} to be ' + article + type
	      , 'expected #{this} not to be ' + article + type
	    );
	  }

	  Assertion.addChainableMethod('an', an);
	  Assertion.addChainableMethod('a', an);

	  /**
	   * ### .include(val[, msg])
	   *
	   * When the target is a string, `.include` asserts that the given string `val`
	   * is a substring of the target.
	   *
	   *     expect('foobar').to.include('foo');
	   *
	   * When the target is an array, `.include` asserts that the given `val` is a
	   * member of the target.
	   *
	   *     expect([1, 2, 3]).to.include(2);
	   *
	   * When the target is an object, `.include` asserts that the given object
	   * `val`'s properties are a subset of the target's properties.
	   *
	   *     expect({a: 1, b: 2, c: 3}).to.include({a: 1, b: 2});
	   *
	   * When the target is a Set or WeakSet, `.include` asserts that the given `val` is a
	   * member of the target. SameValueZero equality algorithm is used.
	   *
	   *     expect(new Set([1, 2])).to.include(2);
	   *
	   * When the target is a Map, `.include` asserts that the given `val` is one of
	   * the values of the target. SameValueZero equality algorithm is used.
	   *
	   *     expect(new Map([['a', 1], ['b', 2]])).to.include(2);
	   *
	   * Because `.include` does different things based on the target's type, it's
	   * important to check the target's type before using `.include`. See the `.a`
	   * doc for info on testing a target's type.
	   *
	   *     expect([1, 2, 3]).to.be.an('array').that.includes(2);
	   *
	   * By default, strict (`===`) equality is used to compare array members and
	   * object properties. Add `.deep` earlier in the chain to use deep equality
	   * instead (WeakSet targets are not supported). See the `deep-eql` project
	   * page for info on the deep equality algorithm: https://github.com/chaijs/deep-eql.
	   *
	   *     // Target array deeply (but not strictly) includes `{a: 1}`
	   *     expect([{a: 1}]).to.deep.include({a: 1});
	   *     expect([{a: 1}]).to.not.include({a: 1});
	   *
	   *     // Target object deeply (but not strictly) includes `x: {a: 1}`
	   *     expect({x: {a: 1}}).to.deep.include({x: {a: 1}});
	   *     expect({x: {a: 1}}).to.not.include({x: {a: 1}});
	   *
	   * By default, all of the target's properties are searched when working with
	   * objects. This includes properties that are inherited and/or non-enumerable.
	   * Add `.own` earlier in the chain to exclude the target's inherited
	   * properties from the search.
	   *
	   *     Object.prototype.b = 2;
	   *
	   *     expect({a: 1}).to.own.include({a: 1});
	   *     expect({a: 1}).to.include({b: 2}).but.not.own.include({b: 2});
	   *
	   * Note that a target object is always only searched for `val`'s own
	   * enumerable properties.
	   *
	   * `.deep` and `.own` can be combined.
	   *
	   *     expect({a: {b: 2}}).to.deep.own.include({a: {b: 2}});
	   *
	   * Add `.nested` earlier in the chain to enable dot- and bracket-notation when
	   * referencing nested properties.
	   *
	   *     expect({a: {b: ['x', 'y']}}).to.nested.include({'a.b[1]': 'y'});
	   *
	   * If `.` or `[]` are part of an actual property name, they can be escaped by
	   * adding two backslashes before them.
	   *
	   *     expect({'.a': {'[b]': 2}}).to.nested.include({'\\.a.\\[b\\]': 2});
	   *
	   * `.deep` and `.nested` can be combined.
	   *
	   *     expect({a: {b: [{c: 3}]}}).to.deep.nested.include({'a.b[0]': {c: 3}});
	   *
	   * `.own` and `.nested` cannot be combined.
	   *
	   * Add `.not` earlier in the chain to negate `.include`.
	   *
	   *     expect('foobar').to.not.include('taco');
	   *     expect([1, 2, 3]).to.not.include(4);
	   *
	   * However, it's dangerous to negate `.include` when the target is an object.
	   * The problem is that it creates uncertain expectations by asserting that the
	   * target object doesn't have all of `val`'s key/value pairs but may or may
	   * not have some of them. It's often best to identify the exact output that's
	   * expected, and then write an assertion that only accepts that exact output.
	   *
	   * When the target object isn't even expected to have `val`'s keys, it's
	   * often best to assert exactly that.
	   *
	   *     expect({c: 3}).to.not.have.any.keys('a', 'b'); // Recommended
	   *     expect({c: 3}).to.not.include({a: 1, b: 2}); // Not recommended
	   *
	   * When the target object is expected to have `val`'s keys, it's often best to
	   * assert that each of the properties has its expected value, rather than
	   * asserting that each property doesn't have one of many unexpected values.
	   *
	   *     expect({a: 3, b: 4}).to.include({a: 3, b: 4}); // Recommended
	   *     expect({a: 3, b: 4}).to.not.include({a: 1, b: 2}); // Not recommended
	   *
	   * `.include` accepts an optional `msg` argument which is a custom error
	   * message to show when the assertion fails. The message can also be given as
	   * the second argument to `expect`.
	   *
	   *     expect([1, 2, 3]).to.include(4, 'nooo why fail??');
	   *     expect([1, 2, 3], 'nooo why fail??').to.include(4);
	   *
	   * `.include` can also be used as a language chain, causing all `.members` and
	   * `.keys` assertions that follow in the chain to require the target to be a
	   * superset of the expected set, rather than an identical set. Note that
	   * `.members` ignores duplicates in the subset when `.include` is added.
	   *
	   *     // Target object's keys are a superset of ['a', 'b'] but not identical
	   *     expect({a: 1, b: 2, c: 3}).to.include.all.keys('a', 'b');
	   *     expect({a: 1, b: 2, c: 3}).to.not.have.all.keys('a', 'b');
	   *
	   *     // Target array is a superset of [1, 2] but not identical
	   *     expect([1, 2, 3]).to.include.members([1, 2]);
	   *     expect([1, 2, 3]).to.not.have.members([1, 2]);
	   *
	   *     // Duplicates in the subset are ignored
	   *     expect([1, 2, 3]).to.include.members([1, 2, 2, 2]);
	   *
	   * Note that adding `.any` earlier in the chain causes the `.keys` assertion
	   * to ignore `.include`.
	   *
	   *     // Both assertions are identical
	   *     expect({a: 1}).to.include.any.keys('a', 'b');
	   *     expect({a: 1}).to.have.any.keys('a', 'b');
	   *
	   * The aliases `.includes`, `.contain`, and `.contains` can be used
	   * interchangeably with `.include`.
	   *
	   * @name include
	   * @alias contain
	   * @alias includes
	   * @alias contains
	   * @param {Mixed} val
	   * @param {String} msg _optional_
	   * @namespace BDD
	   * @api public
	   */

	  function SameValueZero(a, b) {
	    return (_.isNaN(a) && _.isNaN(b)) || a === b;
	  }

	  function includeChainingBehavior () {
	    flag(this, 'contains', true);
	  }

	  function include (val, msg) {
	    if (msg) flag(this, 'message', msg);

	    var obj = flag(this, 'object')
	      , objType = _.type(obj).toLowerCase()
	      , flagMsg = flag(this, 'message')
	      , negate = flag(this, 'negate')
	      , ssfi = flag(this, 'ssfi')
	      , isDeep = flag(this, 'deep')
	      , descriptor = isDeep ? 'deep ' : ''
	      , isEql = isDeep ? flag(this, 'eql') : SameValueZero;

	    flagMsg = flagMsg ? flagMsg + ': ' : '';

	    var included = false;

	    switch (objType) {
	      case 'string':
	        included = obj.indexOf(val) !== -1;
	        break;

	      case 'weakset':
	        if (isDeep) {
	          throw new AssertionError(
	            flagMsg + 'unable to use .deep.include with WeakSet',
	            undefined,
	            ssfi
	          );
	        }

	        included = obj.has(val);
	        break;

	      case 'map':
	        obj.forEach(function (item) {
	          included = included || isEql(item, val);
	        });
	        break;

	      case 'set':
	        if (isDeep) {
	          obj.forEach(function (item) {
	            included = included || isEql(item, val);
	          });
	        } else {
	          included = obj.has(val);
	        }
	        break;

	      case 'array':
	        if (isDeep) {
	          included = obj.some(function (item) {
	            return isEql(item, val);
	          });
	        } else {
	          included = obj.indexOf(val) !== -1;
	        }
	        break;

	      default:
	        // This block is for asserting a subset of properties in an object.
	        // `_.expectTypes` isn't used here because `.include` should work with
	        // objects with a custom `@@toStringTag`.
	        if (val !== Object(val)) {
	          throw new AssertionError(
	            flagMsg + 'the given combination of arguments ('
	            + objType + ' and '
	            + _.type(val).toLowerCase() + ')'
	            + ' is invalid for this assertion. '
	            + 'You can use an array, a map, an object, a set, a string, '
	            + 'or a weakset instead of a '
	            + _.type(val).toLowerCase(),
	            undefined,
	            ssfi
	          );
	        }

	        var props = Object.keys(val)
	          , firstErr = null
	          , numErrs = 0;

	        props.forEach(function (prop) {
	          var propAssertion = new Assertion(obj);
	          _.transferFlags(this, propAssertion, true);
	          flag(propAssertion, 'lockSsfi', true);

	          if (!negate || props.length === 1) {
	            propAssertion.property(prop, val[prop]);
	            return;
	          }

	          try {
	            propAssertion.property(prop, val[prop]);
	          } catch (err) {
	            if (!_.checkError.compatibleConstructor(err, AssertionError)) {
	              throw err;
	            }
	            if (firstErr === null) firstErr = err;
	            numErrs++;
	          }
	        }, this);

	        // When validating .not.include with multiple properties, we only want
	        // to throw an assertion error if all of the properties are included,
	        // in which case we throw the first property assertion error that we
	        // encountered.
	        if (negate && props.length > 1 && numErrs === props.length) {
	          throw firstErr;
	        }
	        return;
	    }

	    // Assert inclusion in collection or substring in a string.
	    this.assert(
	      included
	      , 'expected #{this} to ' + descriptor + 'include ' + _.inspect(val)
	      , 'expected #{this} to not ' + descriptor + 'include ' + _.inspect(val));
	  }

	  Assertion.addChainableMethod('include', include, includeChainingBehavior);
	  Assertion.addChainableMethod('contain', include, includeChainingBehavior);
	  Assertion.addChainableMethod('contains', include, includeChainingBehavior);
	  Assertion.addChainableMethod('includes', include, includeChainingBehavior);

	  /**
	   * ### .ok
	   *
	   * Asserts that the target is a truthy value (considered `true` in boolean context).
	   * However, it's often best to assert that the target is strictly (`===`) or
	   * deeply equal to its expected value.
	   *
	   *     expect(1).to.equal(1); // Recommended
	   *     expect(1).to.be.ok; // Not recommended
	   *
	   *     expect(true).to.be.true; // Recommended
	   *     expect(true).to.be.ok; // Not recommended
	   *
	   * Add `.not` earlier in the chain to negate `.ok`.
	   *
	   *     expect(0).to.equal(0); // Recommended
	   *     expect(0).to.not.be.ok; // Not recommended
	   *
	   *     expect(false).to.be.false; // Recommended
	   *     expect(false).to.not.be.ok; // Not recommended
	   *
	   *     expect(null).to.be.null; // Recommended
	   *     expect(null).to.not.be.ok; // Not recommended
	   *
	   *     expect(undefined).to.be.undefined; // Recommended
	   *     expect(undefined).to.not.be.ok; // Not recommended
	   *
	   * A custom error message can be given as the second argument to `expect`.
	   *
	   *     expect(false, 'nooo why fail??').to.be.ok;
	   *
	   * @name ok
	   * @namespace BDD
	   * @api public
	   */

	  Assertion.addProperty('ok', function () {
	    this.assert(
	        flag(this, 'object')
	      , 'expected #{this} to be truthy'
	      , 'expected #{this} to be falsy');
	  });

	  /**
	   * ### .true
	   *
	   * Asserts that the target is strictly (`===`) equal to `true`.
	   *
	   *     expect(true).to.be.true;
	   *
	   * Add `.not` earlier in the chain to negate `.true`. However, it's often best
	   * to assert that the target is equal to its expected value, rather than not
	   * equal to `true`.
	   *
	   *     expect(false).to.be.false; // Recommended
	   *     expect(false).to.not.be.true; // Not recommended
	   *
	   *     expect(1).to.equal(1); // Recommended
	   *     expect(1).to.not.be.true; // Not recommended
	   *
	   * A custom error message can be given as the second argument to `expect`.
	   *
	   *     expect(false, 'nooo why fail??').to.be.true;
	   *
	   * @name true
	   * @namespace BDD
	   * @api public
	   */

	  Assertion.addProperty('true', function () {
	    this.assert(
	        true === flag(this, 'object')
	      , 'expected #{this} to be true'
	      , 'expected #{this} to be false'
	      , flag(this, 'negate') ? false : true
	    );
	  });

	  /**
	   * ### .false
	   *
	   * Asserts that the target is strictly (`===`) equal to `false`.
	   *
	   *     expect(false).to.be.false;
	   *
	   * Add `.not` earlier in the chain to negate `.false`. However, it's often
	   * best to assert that the target is equal to its expected value, rather than
	   * not equal to `false`.
	   *
	   *     expect(true).to.be.true; // Recommended
	   *     expect(true).to.not.be.false; // Not recommended
	   *
	   *     expect(1).to.equal(1); // Recommended
	   *     expect(1).to.not.be.false; // Not recommended
	   *
	   * A custom error message can be given as the second argument to `expect`.
	   *
	   *     expect(true, 'nooo why fail??').to.be.false;
	   *
	   * @name false
	   * @namespace BDD
	   * @api public
	   */

	  Assertion.addProperty('false', function () {
	    this.assert(
	        false === flag(this, 'object')
	      , 'expected #{this} to be false'
	      , 'expected #{this} to be true'
	      , flag(this, 'negate') ? true : false
	    );
	  });

	  /**
	   * ### .null
	   *
	   * Asserts that the target is strictly (`===`) equal to `null`.
	   *
	   *     expect(null).to.be.null;
	   *
	   * Add `.not` earlier in the chain to negate `.null`. However, it's often best
	   * to assert that the target is equal to its expected value, rather than not
	   * equal to `null`.
	   *
	   *     expect(1).to.equal(1); // Recommended
	   *     expect(1).to.not.be.null; // Not recommended
	   *
	   * A custom error message can be given as the second argument to `expect`.
	   *
	   *     expect(42, 'nooo why fail??').to.be.null;
	   *
	   * @name null
	   * @namespace BDD
	   * @api public
	   */

	  Assertion.addProperty('null', function () {
	    this.assert(
	        null === flag(this, 'object')
	      , 'expected #{this} to be null'
	      , 'expected #{this} not to be null'
	    );
	  });

	  /**
	   * ### .undefined
	   *
	   * Asserts that the target is strictly (`===`) equal to `undefined`.
	   *
	   *     expect(undefined).to.be.undefined;
	   *
	   * Add `.not` earlier in the chain to negate `.undefined`. However, it's often
	   * best to assert that the target is equal to its expected value, rather than
	   * not equal to `undefined`.
	   *
	   *     expect(1).to.equal(1); // Recommended
	   *     expect(1).to.not.be.undefined; // Not recommended
	   *
	   * A custom error message can be given as the second argument to `expect`.
	   *
	   *     expect(42, 'nooo why fail??').to.be.undefined;
	   *
	   * @name undefined
	   * @namespace BDD
	   * @api public
	   */

	  Assertion.addProperty('undefined', function () {
	    this.assert(
	        undefined === flag(this, 'object')
	      , 'expected #{this} to be undefined'
	      , 'expected #{this} not to be undefined'
	    );
	  });

	  /**
	   * ### .NaN
	   *
	   * Asserts that the target is exactly `NaN`.
	   *
	   *     expect(NaN).to.be.NaN;
	   *
	   * Add `.not` earlier in the chain to negate `.NaN`. However, it's often best
	   * to assert that the target is equal to its expected value, rather than not
	   * equal to `NaN`.
	   *
	   *     expect('foo').to.equal('foo'); // Recommended
	   *     expect('foo').to.not.be.NaN; // Not recommended
	   *
	   * A custom error message can be given as the second argument to `expect`.
	   *
	   *     expect(42, 'nooo why fail??').to.be.NaN;
	   *
	   * @name NaN
	   * @namespace BDD
	   * @api public
	   */

	  Assertion.addProperty('NaN', function () {
	    this.assert(
	        _.isNaN(flag(this, 'object'))
	        , 'expected #{this} to be NaN'
	        , 'expected #{this} not to be NaN'
	    );
	  });

	  /**
	   * ### .exist
	   *
	   * Asserts that the target is not strictly (`===`) equal to either `null` or
	   * `undefined`. However, it's often best to assert that the target is equal to
	   * its expected value.
	   *
	   *     expect(1).to.equal(1); // Recommended
	   *     expect(1).to.exist; // Not recommended
	   *
	   *     expect(0).to.equal(0); // Recommended
	   *     expect(0).to.exist; // Not recommended
	   *
	   * Add `.not` earlier in the chain to negate `.exist`.
	   *
	   *     expect(null).to.be.null; // Recommended
	   *     expect(null).to.not.exist; // Not recommended
	   *
	   *     expect(undefined).to.be.undefined; // Recommended
	   *     expect(undefined).to.not.exist; // Not recommended
	   *
	   * A custom error message can be given as the second argument to `expect`.
	   *
	   *     expect(null, 'nooo why fail??').to.exist;
	   *
	   * The alias `.exists` can be used interchangeably with `.exist`.
	   *
	   * @name exist
	   * @alias exists
	   * @namespace BDD
	   * @api public
	   */

	  function assertExist () {
	    var val = flag(this, 'object');
	    this.assert(
	        val !== null && val !== undefined
	      , 'expected #{this} to exist'
	      , 'expected #{this} to not exist'
	    );
	  }

	  Assertion.addProperty('exist', assertExist);
	  Assertion.addProperty('exists', assertExist);

	  /**
	   * ### .empty
	   *
	   * When the target is a string or array, `.empty` asserts that the target's
	   * `length` property is strictly (`===`) equal to `0`.
	   *
	   *     expect([]).to.be.empty;
	   *     expect('').to.be.empty;
	   *
	   * When the target is a map or set, `.empty` asserts that the target's `size`
	   * property is strictly equal to `0`.
	   *
	   *     expect(new Set()).to.be.empty;
	   *     expect(new Map()).to.be.empty;
	   *
	   * When the target is a non-function object, `.empty` asserts that the target
	   * doesn't have any own enumerable properties. Properties with Symbol-based
	   * keys are excluded from the count.
	   *
	   *     expect({}).to.be.empty;
	   *
	   * Because `.empty` does different things based on the target's type, it's
	   * important to check the target's type before using `.empty`. See the `.a`
	   * doc for info on testing a target's type.
	   *
	   *     expect([]).to.be.an('array').that.is.empty;
	   *
	   * Add `.not` earlier in the chain to negate `.empty`. However, it's often
	   * best to assert that the target contains its expected number of values,
	   * rather than asserting that it's not empty.
	   *
	   *     expect([1, 2, 3]).to.have.lengthOf(3); // Recommended
	   *     expect([1, 2, 3]).to.not.be.empty; // Not recommended
	   *
	   *     expect(new Set([1, 2, 3])).to.have.property('size', 3); // Recommended
	   *     expect(new Set([1, 2, 3])).to.not.be.empty; // Not recommended
	   *
	   *     expect(Object.keys({a: 1})).to.have.lengthOf(1); // Recommended
	   *     expect({a: 1}).to.not.be.empty; // Not recommended
	   *
	   * A custom error message can be given as the second argument to `expect`.
	   *
	   *     expect([1, 2, 3], 'nooo why fail??').to.be.empty;
	   *
	   * @name empty
	   * @namespace BDD
	   * @api public
	   */

	  Assertion.addProperty('empty', function () {
	    var val = flag(this, 'object')
	      , ssfi = flag(this, 'ssfi')
	      , flagMsg = flag(this, 'message')
	      , itemsCount;

	    flagMsg = flagMsg ? flagMsg + ': ' : '';

	    switch (_.type(val).toLowerCase()) {
	      case 'array':
	      case 'string':
	        itemsCount = val.length;
	        break;
	      case 'map':
	      case 'set':
	        itemsCount = val.size;
	        break;
	      case 'weakmap':
	      case 'weakset':
	        throw new AssertionError(
	          flagMsg + '.empty was passed a weak collection',
	          undefined,
	          ssfi
	        );
	      case 'function':
	        var msg = flagMsg + '.empty was passed a function ' + _.getName(val);
	        throw new AssertionError(msg.trim(), undefined, ssfi);
	      default:
	        if (val !== Object(val)) {
	          throw new AssertionError(
	            flagMsg + '.empty was passed non-string primitive ' + _.inspect(val),
	            undefined,
	            ssfi
	          );
	        }
	        itemsCount = Object.keys(val).length;
	    }

	    this.assert(
	        0 === itemsCount
	      , 'expected #{this} to be empty'
	      , 'expected #{this} not to be empty'
	    );
	  });

	  /**
	   * ### .arguments
	   *
	   * Asserts that the target is an `arguments` object.
	   *
	   *     function test () {
	   *       expect(arguments).to.be.arguments;
	   *     }
	   *
	   *     test();
	   *
	   * Add `.not` earlier in the chain to negate `.arguments`. However, it's often
	   * best to assert which type the target is expected to be, rather than
	   * asserting that it’s not an `arguments` object.
	   *
	   *     expect('foo').to.be.a('string'); // Recommended
	   *     expect('foo').to.not.be.arguments; // Not recommended
	   *
	   * A custom error message can be given as the second argument to `expect`.
	   *
	   *     expect({}, 'nooo why fail??').to.be.arguments;
	   *
	   * The alias `.Arguments` can be used interchangeably with `.arguments`.
	   *
	   * @name arguments
	   * @alias Arguments
	   * @namespace BDD
	   * @api public
	   */

	  function checkArguments () {
	    var obj = flag(this, 'object')
	      , type = _.type(obj);
	    this.assert(
	        'Arguments' === type
	      , 'expected #{this} to be arguments but got ' + type
	      , 'expected #{this} to not be arguments'
	    );
	  }

	  Assertion.addProperty('arguments', checkArguments);
	  Assertion.addProperty('Arguments', checkArguments);

	  /**
	   * ### .equal(val[, msg])
	   *
	   * Asserts that the target is strictly (`===`) equal to the given `val`.
	   *
	   *     expect(1).to.equal(1);
	   *     expect('foo').to.equal('foo');
	   *
	   * Add `.deep` earlier in the chain to use deep equality instead. See the
	   * `deep-eql` project page for info on the deep equality algorithm:
	   * https://github.com/chaijs/deep-eql.
	   *
	   *     // Target object deeply (but not strictly) equals `{a: 1}`
	   *     expect({a: 1}).to.deep.equal({a: 1});
	   *     expect({a: 1}).to.not.equal({a: 1});
	   *
	   *     // Target array deeply (but not strictly) equals `[1, 2]`
	   *     expect([1, 2]).to.deep.equal([1, 2]);
	   *     expect([1, 2]).to.not.equal([1, 2]);
	   *
	   * Add `.not` earlier in the chain to negate `.equal`. However, it's often
	   * best to assert that the target is equal to its expected value, rather than
	   * not equal to one of countless unexpected values.
	   *
	   *     expect(1).to.equal(1); // Recommended
	   *     expect(1).to.not.equal(2); // Not recommended
	   *
	   * `.equal` accepts an optional `msg` argument which is a custom error message
	   * to show when the assertion fails. The message can also be given as the
	   * second argument to `expect`.
	   *
	   *     expect(1).to.equal(2, 'nooo why fail??');
	   *     expect(1, 'nooo why fail??').to.equal(2);
	   *
	   * The aliases `.equals` and `eq` can be used interchangeably with `.equal`.
	   *
	   * @name equal
	   * @alias equals
	   * @alias eq
	   * @param {Mixed} val
	   * @param {String} msg _optional_
	   * @namespace BDD
	   * @api public
	   */

	  function assertEqual (val, msg) {
	    if (msg) flag(this, 'message', msg);
	    var obj = flag(this, 'object');
	    if (flag(this, 'deep')) {
	      var prevLockSsfi = flag(this, 'lockSsfi');
	      flag(this, 'lockSsfi', true);
	      this.eql(val);
	      flag(this, 'lockSsfi', prevLockSsfi);
	    } else {
	      this.assert(
	          val === obj
	        , 'expected #{this} to equal #{exp}'
	        , 'expected #{this} to not equal #{exp}'
	        , val
	        , this._obj
	        , true
	      );
	    }
	  }

	  Assertion.addMethod('equal', assertEqual);
	  Assertion.addMethod('equals', assertEqual);
	  Assertion.addMethod('eq', assertEqual);

	  /**
	   * ### .eql(obj[, msg])
	   *
	   * Asserts that the target is deeply equal to the given `obj`. See the
	   * `deep-eql` project page for info on the deep equality algorithm:
	   * https://github.com/chaijs/deep-eql.
	   *
	   *     // Target object is deeply (but not strictly) equal to {a: 1}
	   *     expect({a: 1}).to.eql({a: 1}).but.not.equal({a: 1});
	   *
	   *     // Target array is deeply (but not strictly) equal to [1, 2]
	   *     expect([1, 2]).to.eql([1, 2]).but.not.equal([1, 2]);
	   *
	   * Add `.not` earlier in the chain to negate `.eql`. However, it's often best
	   * to assert that the target is deeply equal to its expected value, rather
	   * than not deeply equal to one of countless unexpected values.
	   *
	   *     expect({a: 1}).to.eql({a: 1}); // Recommended
	   *     expect({a: 1}).to.not.eql({b: 2}); // Not recommended
	   *
	   * `.eql` accepts an optional `msg` argument which is a custom error message
	   * to show when the assertion fails. The message can also be given as the
	   * second argument to `expect`.
	   *
	   *     expect({a: 1}).to.eql({b: 2}, 'nooo why fail??');
	   *     expect({a: 1}, 'nooo why fail??').to.eql({b: 2});
	   *
	   * The alias `.eqls` can be used interchangeably with `.eql`.
	   *
	   * The `.deep.equal` assertion is almost identical to `.eql` but with one
	   * difference: `.deep.equal` causes deep equality comparisons to also be used
	   * for any other assertions that follow in the chain.
	   *
	   * @name eql
	   * @alias eqls
	   * @param {Mixed} obj
	   * @param {String} msg _optional_
	   * @namespace BDD
	   * @api public
	   */

	  function assertEql(obj, msg) {
	    if (msg) flag(this, 'message', msg);
	    var eql = flag(this, 'eql');
	    this.assert(
	        eql(obj, flag(this, 'object'))
	      , 'expected #{this} to deeply equal #{exp}'
	      , 'expected #{this} to not deeply equal #{exp}'
	      , obj
	      , this._obj
	      , true
	    );
	  }

	  Assertion.addMethod('eql', assertEql);
	  Assertion.addMethod('eqls', assertEql);

	  /**
	   * ### .above(n[, msg])
	   *
	   * Asserts that the target is a number or a date greater than the given number or date `n` respectively.
	   * However, it's often best to assert that the target is equal to its expected
	   * value.
	   *
	   *     expect(2).to.equal(2); // Recommended
	   *     expect(2).to.be.above(1); // Not recommended
	   *
	   * Add `.lengthOf` earlier in the chain to assert that the target's `length`
	   * or `size` is greater than the given number `n`.
	   *
	   *     expect('foo').to.have.lengthOf(3); // Recommended
	   *     expect('foo').to.have.lengthOf.above(2); // Not recommended
	   *
	   *     expect([1, 2, 3]).to.have.lengthOf(3); // Recommended
	   *     expect([1, 2, 3]).to.have.lengthOf.above(2); // Not recommended
	   *
	   * Add `.not` earlier in the chain to negate `.above`.
	   *
	   *     expect(2).to.equal(2); // Recommended
	   *     expect(1).to.not.be.above(2); // Not recommended
	   *
	   * `.above` accepts an optional `msg` argument which is a custom error message
	   * to show when the assertion fails. The message can also be given as the
	   * second argument to `expect`.
	   *
	   *     expect(1).to.be.above(2, 'nooo why fail??');
	   *     expect(1, 'nooo why fail??').to.be.above(2);
	   *
	   * The aliases `.gt` and `.greaterThan` can be used interchangeably with
	   * `.above`.
	   *
	   * @name above
	   * @alias gt
	   * @alias greaterThan
	   * @param {Number} n
	   * @param {String} msg _optional_
	   * @namespace BDD
	   * @api public
	   */

	  function assertAbove (n, msg) {
	    if (msg) flag(this, 'message', msg);
	    var obj = flag(this, 'object')
	      , doLength = flag(this, 'doLength')
	      , flagMsg = flag(this, 'message')
	      , msgPrefix = ((flagMsg) ? flagMsg + ': ' : '')
	      , ssfi = flag(this, 'ssfi')
	      , objType = _.type(obj).toLowerCase()
	      , nType = _.type(n).toLowerCase()
	      , errorMessage
	      , shouldThrow = true;

	    if (doLength && objType !== 'map' && objType !== 'set') {
	      new Assertion(obj, flagMsg, ssfi, true).to.have.property('length');
	    }

	    if (!doLength && (objType === 'date' && nType !== 'date')) {
	      errorMessage = msgPrefix + 'the argument to above must be a date';
	    } else if (nType !== 'number' && (doLength || objType === 'number')) {
	      errorMessage = msgPrefix + 'the argument to above must be a number';
	    } else if (!doLength && (objType !== 'date' && objType !== 'number')) {
	      var printObj = (objType === 'string') ? "'" + obj + "'" : obj;
	      errorMessage = msgPrefix + 'expected ' + printObj + ' to be a number or a date';
	    } else {
	      shouldThrow = false;
	    }

	    if (shouldThrow) {
	      throw new AssertionError(errorMessage, undefined, ssfi);
	    }

	    if (doLength) {
	      var descriptor = 'length'
	        , itemsCount;
	      if (objType === 'map' || objType === 'set') {
	        descriptor = 'size';
	        itemsCount = obj.size;
	      } else {
	        itemsCount = obj.length;
	      }
	      this.assert(
	          itemsCount > n
	        , 'expected #{this} to have a ' + descriptor + ' above #{exp} but got #{act}'
	        , 'expected #{this} to not have a ' + descriptor + ' above #{exp}'
	        , n
	        , itemsCount
	      );
	    } else {
	      this.assert(
	          obj > n
	        , 'expected #{this} to be above #{exp}'
	        , 'expected #{this} to be at most #{exp}'
	        , n
	      );
	    }
	  }

	  Assertion.addMethod('above', assertAbove);
	  Assertion.addMethod('gt', assertAbove);
	  Assertion.addMethod('greaterThan', assertAbove);

	  /**
	   * ### .least(n[, msg])
	   *
	   * Asserts that the target is a number or a date greater than or equal to the given
	   * number or date `n` respectively. However, it's often best to assert that the target is equal to
	   * its expected value.
	   *
	   *     expect(2).to.equal(2); // Recommended
	   *     expect(2).to.be.at.least(1); // Not recommended
	   *     expect(2).to.be.at.least(2); // Not recommended
	   *
	   * Add `.lengthOf` earlier in the chain to assert that the target's `length`
	   * or `size` is greater than or equal to the given number `n`.
	   *
	   *     expect('foo').to.have.lengthOf(3); // Recommended
	   *     expect('foo').to.have.lengthOf.at.least(2); // Not recommended
	   *
	   *     expect([1, 2, 3]).to.have.lengthOf(3); // Recommended
	   *     expect([1, 2, 3]).to.have.lengthOf.at.least(2); // Not recommended
	   *
	   * Add `.not` earlier in the chain to negate `.least`.
	   *
	   *     expect(1).to.equal(1); // Recommended
	   *     expect(1).to.not.be.at.least(2); // Not recommended
	   *
	   * `.least` accepts an optional `msg` argument which is a custom error message
	   * to show when the assertion fails. The message can also be given as the
	   * second argument to `expect`.
	   *
	   *     expect(1).to.be.at.least(2, 'nooo why fail??');
	   *     expect(1, 'nooo why fail??').to.be.at.least(2);
	   *
	   * The aliases `.gte` and `.greaterThanOrEqual` can be used interchangeably with
	   * `.least`.
	   *
	   * @name least
	   * @alias gte
	   * @alias greaterThanOrEqual
	   * @param {Number} n
	   * @param {String} msg _optional_
	   * @namespace BDD
	   * @api public
	   */

	  function assertLeast (n, msg) {
	    if (msg) flag(this, 'message', msg);
	    var obj = flag(this, 'object')
	      , doLength = flag(this, 'doLength')
	      , flagMsg = flag(this, 'message')
	      , msgPrefix = ((flagMsg) ? flagMsg + ': ' : '')
	      , ssfi = flag(this, 'ssfi')
	      , objType = _.type(obj).toLowerCase()
	      , nType = _.type(n).toLowerCase()
	      , errorMessage
	      , shouldThrow = true;

	    if (doLength && objType !== 'map' && objType !== 'set') {
	      new Assertion(obj, flagMsg, ssfi, true).to.have.property('length');
	    }

	    if (!doLength && (objType === 'date' && nType !== 'date')) {
	      errorMessage = msgPrefix + 'the argument to least must be a date';
	    } else if (nType !== 'number' && (doLength || objType === 'number')) {
	      errorMessage = msgPrefix + 'the argument to least must be a number';
	    } else if (!doLength && (objType !== 'date' && objType !== 'number')) {
	      var printObj = (objType === 'string') ? "'" + obj + "'" : obj;
	      errorMessage = msgPrefix + 'expected ' + printObj + ' to be a number or a date';
	    } else {
	      shouldThrow = false;
	    }

	    if (shouldThrow) {
	      throw new AssertionError(errorMessage, undefined, ssfi);
	    }

	    if (doLength) {
	      var descriptor = 'length'
	        , itemsCount;
	      if (objType === 'map' || objType === 'set') {
	        descriptor = 'size';
	        itemsCount = obj.size;
	      } else {
	        itemsCount = obj.length;
	      }
	      this.assert(
	          itemsCount >= n
	        , 'expected #{this} to have a ' + descriptor + ' at least #{exp} but got #{act}'
	        , 'expected #{this} to have a ' + descriptor + ' below #{exp}'
	        , n
	        , itemsCount
	      );
	    } else {
	      this.assert(
	          obj >= n
	        , 'expected #{this} to be at least #{exp}'
	        , 'expected #{this} to be below #{exp}'
	        , n
	      );
	    }
	  }

	  Assertion.addMethod('least', assertLeast);
	  Assertion.addMethod('gte', assertLeast);
	  Assertion.addMethod('greaterThanOrEqual', assertLeast);

	  /**
	   * ### .below(n[, msg])
	   *
	   * Asserts that the target is a number or a date less than the given number or date `n` respectively.
	   * However, it's often best to assert that the target is equal to its expected
	   * value.
	   *
	   *     expect(1).to.equal(1); // Recommended
	   *     expect(1).to.be.below(2); // Not recommended
	   *
	   * Add `.lengthOf` earlier in the chain to assert that the target's `length`
	   * or `size` is less than the given number `n`.
	   *
	   *     expect('foo').to.have.lengthOf(3); // Recommended
	   *     expect('foo').to.have.lengthOf.below(4); // Not recommended
	   *
	   *     expect([1, 2, 3]).to.have.length(3); // Recommended
	   *     expect([1, 2, 3]).to.have.lengthOf.below(4); // Not recommended
	   *
	   * Add `.not` earlier in the chain to negate `.below`.
	   *
	   *     expect(2).to.equal(2); // Recommended
	   *     expect(2).to.not.be.below(1); // Not recommended
	   *
	   * `.below` accepts an optional `msg` argument which is a custom error message
	   * to show when the assertion fails. The message can also be given as the
	   * second argument to `expect`.
	   *
	   *     expect(2).to.be.below(1, 'nooo why fail??');
	   *     expect(2, 'nooo why fail??').to.be.below(1);
	   *
	   * The aliases `.lt` and `.lessThan` can be used interchangeably with
	   * `.below`.
	   *
	   * @name below
	   * @alias lt
	   * @alias lessThan
	   * @param {Number} n
	   * @param {String} msg _optional_
	   * @namespace BDD
	   * @api public
	   */

	  function assertBelow (n, msg) {
	    if (msg) flag(this, 'message', msg);
	    var obj = flag(this, 'object')
	      , doLength = flag(this, 'doLength')
	      , flagMsg = flag(this, 'message')
	      , msgPrefix = ((flagMsg) ? flagMsg + ': ' : '')
	      , ssfi = flag(this, 'ssfi')
	      , objType = _.type(obj).toLowerCase()
	      , nType = _.type(n).toLowerCase()
	      , errorMessage
	      , shouldThrow = true;

	    if (doLength && objType !== 'map' && objType !== 'set') {
	      new Assertion(obj, flagMsg, ssfi, true).to.have.property('length');
	    }

	    if (!doLength && (objType === 'date' && nType !== 'date')) {
	      errorMessage = msgPrefix + 'the argument to below must be a date';
	    } else if (nType !== 'number' && (doLength || objType === 'number')) {
	      errorMessage = msgPrefix + 'the argument to below must be a number';
	    } else if (!doLength && (objType !== 'date' && objType !== 'number')) {
	      var printObj = (objType === 'string') ? "'" + obj + "'" : obj;
	      errorMessage = msgPrefix + 'expected ' + printObj + ' to be a number or a date';
	    } else {
	      shouldThrow = false;
	    }

	    if (shouldThrow) {
	      throw new AssertionError(errorMessage, undefined, ssfi);
	    }

	    if (doLength) {
	      var descriptor = 'length'
	        , itemsCount;
	      if (objType === 'map' || objType === 'set') {
	        descriptor = 'size';
	        itemsCount = obj.size;
	      } else {
	        itemsCount = obj.length;
	      }
	      this.assert(
	          itemsCount < n
	        , 'expected #{this} to have a ' + descriptor + ' below #{exp} but got #{act}'
	        , 'expected #{this} to not have a ' + descriptor + ' below #{exp}'
	        , n
	        , itemsCount
	      );
	    } else {
	      this.assert(
	          obj < n
	        , 'expected #{this} to be below #{exp}'
	        , 'expected #{this} to be at least #{exp}'
	        , n
	      );
	    }
	  }

	  Assertion.addMethod('below', assertBelow);
	  Assertion.addMethod('lt', assertBelow);
	  Assertion.addMethod('lessThan', assertBelow);

	  /**
	   * ### .most(n[, msg])
	   *
	   * Asserts that the target is a number or a date less than or equal to the given number
	   * or date `n` respectively. However, it's often best to assert that the target is equal to its
	   * expected value.
	   *
	   *     expect(1).to.equal(1); // Recommended
	   *     expect(1).to.be.at.most(2); // Not recommended
	   *     expect(1).to.be.at.most(1); // Not recommended
	   *
	   * Add `.lengthOf` earlier in the chain to assert that the target's `length`
	   * or `size` is less than or equal to the given number `n`.
	   *
	   *     expect('foo').to.have.lengthOf(3); // Recommended
	   *     expect('foo').to.have.lengthOf.at.most(4); // Not recommended
	   *
	   *     expect([1, 2, 3]).to.have.lengthOf(3); // Recommended
	   *     expect([1, 2, 3]).to.have.lengthOf.at.most(4); // Not recommended
	   *
	   * Add `.not` earlier in the chain to negate `.most`.
	   *
	   *     expect(2).to.equal(2); // Recommended
	   *     expect(2).to.not.be.at.most(1); // Not recommended
	   *
	   * `.most` accepts an optional `msg` argument which is a custom error message
	   * to show when the assertion fails. The message can also be given as the
	   * second argument to `expect`.
	   *
	   *     expect(2).to.be.at.most(1, 'nooo why fail??');
	   *     expect(2, 'nooo why fail??').to.be.at.most(1);
	   *
	   * The aliases `.lte` and `.lessThanOrEqual` can be used interchangeably with
	   * `.most`.
	   *
	   * @name most
	   * @alias lte
	   * @alias lessThanOrEqual
	   * @param {Number} n
	   * @param {String} msg _optional_
	   * @namespace BDD
	   * @api public
	   */

	  function assertMost (n, msg) {
	    if (msg) flag(this, 'message', msg);
	    var obj = flag(this, 'object')
	      , doLength = flag(this, 'doLength')
	      , flagMsg = flag(this, 'message')
	      , msgPrefix = ((flagMsg) ? flagMsg + ': ' : '')
	      , ssfi = flag(this, 'ssfi')
	      , objType = _.type(obj).toLowerCase()
	      , nType = _.type(n).toLowerCase()
	      , errorMessage
	      , shouldThrow = true;

	    if (doLength && objType !== 'map' && objType !== 'set') {
	      new Assertion(obj, flagMsg, ssfi, true).to.have.property('length');
	    }

	    if (!doLength && (objType === 'date' && nType !== 'date')) {
	      errorMessage = msgPrefix + 'the argument to most must be a date';
	    } else if (nType !== 'number' && (doLength || objType === 'number')) {
	      errorMessage = msgPrefix + 'the argument to most must be a number';
	    } else if (!doLength && (objType !== 'date' && objType !== 'number')) {
	      var printObj = (objType === 'string') ? "'" + obj + "'" : obj;
	      errorMessage = msgPrefix + 'expected ' + printObj + ' to be a number or a date';
	    } else {
	      shouldThrow = false;
	    }

	    if (shouldThrow) {
	      throw new AssertionError(errorMessage, undefined, ssfi);
	    }

	    if (doLength) {
	      var descriptor = 'length'
	        , itemsCount;
	      if (objType === 'map' || objType === 'set') {
	        descriptor = 'size';
	        itemsCount = obj.size;
	      } else {
	        itemsCount = obj.length;
	      }
	      this.assert(
	          itemsCount <= n
	        , 'expected #{this} to have a ' + descriptor + ' at most #{exp} but got #{act}'
	        , 'expected #{this} to have a ' + descriptor + ' above #{exp}'
	        , n
	        , itemsCount
	      );
	    } else {
	      this.assert(
	          obj <= n
	        , 'expected #{this} to be at most #{exp}'
	        , 'expected #{this} to be above #{exp}'
	        , n
	      );
	    }
	  }

	  Assertion.addMethod('most', assertMost);
	  Assertion.addMethod('lte', assertMost);
	  Assertion.addMethod('lessThanOrEqual', assertMost);

	  /**
	   * ### .within(start, finish[, msg])
	   *
	   * Asserts that the target is a number or a date greater than or equal to the given
	   * number or date `start`, and less than or equal to the given number or date `finish` respectively.
	   * However, it's often best to assert that the target is equal to its expected
	   * value.
	   *
	   *     expect(2).to.equal(2); // Recommended
	   *     expect(2).to.be.within(1, 3); // Not recommended
	   *     expect(2).to.be.within(2, 3); // Not recommended
	   *     expect(2).to.be.within(1, 2); // Not recommended
	   *
	   * Add `.lengthOf` earlier in the chain to assert that the target's `length`
	   * or `size` is greater than or equal to the given number `start`, and less
	   * than or equal to the given number `finish`.
	   *
	   *     expect('foo').to.have.lengthOf(3); // Recommended
	   *     expect('foo').to.have.lengthOf.within(2, 4); // Not recommended
	   *
	   *     expect([1, 2, 3]).to.have.lengthOf(3); // Recommended
	   *     expect([1, 2, 3]).to.have.lengthOf.within(2, 4); // Not recommended
	   *
	   * Add `.not` earlier in the chain to negate `.within`.
	   *
	   *     expect(1).to.equal(1); // Recommended
	   *     expect(1).to.not.be.within(2, 4); // Not recommended
	   *
	   * `.within` accepts an optional `msg` argument which is a custom error
	   * message to show when the assertion fails. The message can also be given as
	   * the second argument to `expect`.
	   *
	   *     expect(4).to.be.within(1, 3, 'nooo why fail??');
	   *     expect(4, 'nooo why fail??').to.be.within(1, 3);
	   *
	   * @name within
	   * @param {Number} start lower bound inclusive
	   * @param {Number} finish upper bound inclusive
	   * @param {String} msg _optional_
	   * @namespace BDD
	   * @api public
	   */

	  Assertion.addMethod('within', function (start, finish, msg) {
	    if (msg) flag(this, 'message', msg);
	    var obj = flag(this, 'object')
	      , doLength = flag(this, 'doLength')
	      , flagMsg = flag(this, 'message')
	      , msgPrefix = ((flagMsg) ? flagMsg + ': ' : '')
	      , ssfi = flag(this, 'ssfi')
	      , objType = _.type(obj).toLowerCase()
	      , startType = _.type(start).toLowerCase()
	      , finishType = _.type(finish).toLowerCase()
	      , errorMessage
	      , shouldThrow = true
	      , range = (startType === 'date' && finishType === 'date')
	          ? start.toISOString() + '..' + finish.toISOString()
	          : start + '..' + finish;

	    if (doLength && objType !== 'map' && objType !== 'set') {
	      new Assertion(obj, flagMsg, ssfi, true).to.have.property('length');
	    }

	    if (!doLength && (objType === 'date' && (startType !== 'date' || finishType !== 'date'))) {
	      errorMessage = msgPrefix + 'the arguments to within must be dates';
	    } else if ((startType !== 'number' || finishType !== 'number') && (doLength || objType === 'number')) {
	      errorMessage = msgPrefix + 'the arguments to within must be numbers';
	    } else if (!doLength && (objType !== 'date' && objType !== 'number')) {
	      var printObj = (objType === 'string') ? "'" + obj + "'" : obj;
	      errorMessage = msgPrefix + 'expected ' + printObj + ' to be a number or a date';
	    } else {
	      shouldThrow = false;
	    }

	    if (shouldThrow) {
	      throw new AssertionError(errorMessage, undefined, ssfi);
	    }

	    if (doLength) {
	      var descriptor = 'length'
	        , itemsCount;
	      if (objType === 'map' || objType === 'set') {
	        descriptor = 'size';
	        itemsCount = obj.size;
	      } else {
	        itemsCount = obj.length;
	      }
	      this.assert(
	          itemsCount >= start && itemsCount <= finish
	        , 'expected #{this} to have a ' + descriptor + ' within ' + range
	        , 'expected #{this} to not have a ' + descriptor + ' within ' + range
	      );
	    } else {
	      this.assert(
	          obj >= start && obj <= finish
	        , 'expected #{this} to be within ' + range
	        , 'expected #{this} to not be within ' + range
	      );
	    }
	  });

	  /**
	   * ### .instanceof(constructor[, msg])
	   *
	   * Asserts that the target is an instance of the given `constructor`.
	   *
	   *     function Cat () { }
	   *
	   *     expect(new Cat()).to.be.an.instanceof(Cat);
	   *     expect([1, 2]).to.be.an.instanceof(Array);
	   *
	   * Add `.not` earlier in the chain to negate `.instanceof`.
	   *
	   *     expect({a: 1}).to.not.be.an.instanceof(Array);
	   *
	   * `.instanceof` accepts an optional `msg` argument which is a custom error
	   * message to show when the assertion fails. The message can also be given as
	   * the second argument to `expect`.
	   *
	   *     expect(1).to.be.an.instanceof(Array, 'nooo why fail??');
	   *     expect(1, 'nooo why fail??').to.be.an.instanceof(Array);
	   *
	   * Due to limitations in ES5, `.instanceof` may not always work as expected
	   * when using a transpiler such as Babel or TypeScript. In particular, it may
	   * produce unexpected results when subclassing built-in object such as
	   * `Array`, `Error`, and `Map`. See your transpiler's docs for details:
	   *
	   * - ([Babel](https://babeljs.io/docs/usage/caveats/#classes))
	   * - ([TypeScript](https://github.com/Microsoft/TypeScript/wiki/Breaking-Changes#extending-built-ins-like-error-array-and-map-may-no-longer-work))
	   *
	   * The alias `.instanceOf` can be used interchangeably with `.instanceof`.
	   *
	   * @name instanceof
	   * @param {Constructor} constructor
	   * @param {String} msg _optional_
	   * @alias instanceOf
	   * @namespace BDD
	   * @api public
	   */

	  function assertInstanceOf (constructor, msg) {
	    if (msg) flag(this, 'message', msg);

	    var target = flag(this, 'object');
	    var ssfi = flag(this, 'ssfi');
	    var flagMsg = flag(this, 'message');

	    try {
	      var isInstanceOf = target instanceof constructor;
	    } catch (err) {
	      if (err instanceof TypeError) {
	        flagMsg = flagMsg ? flagMsg + ': ' : '';
	        throw new AssertionError(
	          flagMsg + 'The instanceof assertion needs a constructor but '
	            + _.type(constructor) + ' was given.',
	          undefined,
	          ssfi
	        );
	      }
	      throw err;
	    }

	    var name = _.getName(constructor);
	    if (name === null) {
	      name = 'an unnamed constructor';
	    }

	    this.assert(
	        isInstanceOf
	      , 'expected #{this} to be an instance of ' + name
	      , 'expected #{this} to not be an instance of ' + name
	    );
	  }
	  Assertion.addMethod('instanceof', assertInstanceOf);
	  Assertion.addMethod('instanceOf', assertInstanceOf);

	  /**
	   * ### .property(name[, val[, msg]])
	   *
	   * Asserts that the target has a property with the given key `name`.
	   *
	   *     expect({a: 1}).to.have.property('a');
	   *
	   * When `val` is provided, `.property` also asserts that the property's value
	   * is equal to the given `val`.
	   *
	   *     expect({a: 1}).to.have.property('a', 1);
	   *
	   * By default, strict (`===`) equality is used. Add `.deep` earlier in the
	   * chain to use deep equality instead. See the `deep-eql` project page for
	   * info on the deep equality algorithm: https://github.com/chaijs/deep-eql.
	   *
	   *     // Target object deeply (but not strictly) has property `x: {a: 1}`
	   *     expect({x: {a: 1}}).to.have.deep.property('x', {a: 1});
	   *     expect({x: {a: 1}}).to.not.have.property('x', {a: 1});
	   *
	   * The target's enumerable and non-enumerable properties are always included
	   * in the search. By default, both own and inherited properties are included.
	   * Add `.own` earlier in the chain to exclude inherited properties from the
	   * search.
	   *
	   *     Object.prototype.b = 2;
	   *
	   *     expect({a: 1}).to.have.own.property('a');
	   *     expect({a: 1}).to.have.own.property('a', 1);
	   *     expect({a: 1}).to.have.property('b');
	   *     expect({a: 1}).to.not.have.own.property('b');
	   *
	   * `.deep` and `.own` can be combined.
	   *
	   *     expect({x: {a: 1}}).to.have.deep.own.property('x', {a: 1});
	   *
	   * Add `.nested` earlier in the chain to enable dot- and bracket-notation when
	   * referencing nested properties.
	   *
	   *     expect({a: {b: ['x', 'y']}}).to.have.nested.property('a.b[1]');
	   *     expect({a: {b: ['x', 'y']}}).to.have.nested.property('a.b[1]', 'y');
	   *
	   * If `.` or `[]` are part of an actual property name, they can be escaped by
	   * adding two backslashes before them.
	   *
	   *     expect({'.a': {'[b]': 'x'}}).to.have.nested.property('\\.a.\\[b\\]');
	   *
	   * `.deep` and `.nested` can be combined.
	   *
	   *     expect({a: {b: [{c: 3}]}})
	   *       .to.have.deep.nested.property('a.b[0]', {c: 3});
	   *
	   * `.own` and `.nested` cannot be combined.
	   *
	   * Add `.not` earlier in the chain to negate `.property`.
	   *
	   *     expect({a: 1}).to.not.have.property('b');
	   *
	   * However, it's dangerous to negate `.property` when providing `val`. The
	   * problem is that it creates uncertain expectations by asserting that the
	   * target either doesn't have a property with the given key `name`, or that it
	   * does have a property with the given key `name` but its value isn't equal to
	   * the given `val`. It's often best to identify the exact output that's
	   * expected, and then write an assertion that only accepts that exact output.
	   *
	   * When the target isn't expected to have a property with the given key
	   * `name`, it's often best to assert exactly that.
	   *
	   *     expect({b: 2}).to.not.have.property('a'); // Recommended
	   *     expect({b: 2}).to.not.have.property('a', 1); // Not recommended
	   *
	   * When the target is expected to have a property with the given key `name`,
	   * it's often best to assert that the property has its expected value, rather
	   * than asserting that it doesn't have one of many unexpected values.
	   *
	   *     expect({a: 3}).to.have.property('a', 3); // Recommended
	   *     expect({a: 3}).to.not.have.property('a', 1); // Not recommended
	   *
	   * `.property` changes the target of any assertions that follow in the chain
	   * to be the value of the property from the original target object.
	   *
	   *     expect({a: 1}).to.have.property('a').that.is.a('number');
	   *
	   * `.property` accepts an optional `msg` argument which is a custom error
	   * message to show when the assertion fails. The message can also be given as
	   * the second argument to `expect`. When not providing `val`, only use the
	   * second form.
	   *
	   *     // Recommended
	   *     expect({a: 1}).to.have.property('a', 2, 'nooo why fail??');
	   *     expect({a: 1}, 'nooo why fail??').to.have.property('a', 2);
	   *     expect({a: 1}, 'nooo why fail??').to.have.property('b');
	   *
	   *     // Not recommended
	   *     expect({a: 1}).to.have.property('b', undefined, 'nooo why fail??');
	   *
	   * The above assertion isn't the same thing as not providing `val`. Instead,
	   * it's asserting that the target object has a `b` property that's equal to
	   * `undefined`.
	   *
	   * The assertions `.ownProperty` and `.haveOwnProperty` can be used
	   * interchangeably with `.own.property`.
	   *
	   * @name property
	   * @param {String} name
	   * @param {Mixed} val (optional)
	   * @param {String} msg _optional_
	   * @returns value of property for chaining
	   * @namespace BDD
	   * @api public
	   */

	  function assertProperty (name, val, msg) {
	    if (msg) flag(this, 'message', msg);

	    var isNested = flag(this, 'nested')
	      , isOwn = flag(this, 'own')
	      , flagMsg = flag(this, 'message')
	      , obj = flag(this, 'object')
	      , ssfi = flag(this, 'ssfi')
	      , nameType = typeof name;

	    flagMsg = flagMsg ? flagMsg + ': ' : '';

	    if (isNested) {
	      if (nameType !== 'string') {
	        throw new AssertionError(
	          flagMsg + 'the argument to property must be a string when using nested syntax',
	          undefined,
	          ssfi
	        );
	      }
	    } else {
	      if (nameType !== 'string' && nameType !== 'number' && nameType !== 'symbol') {
	        throw new AssertionError(
	          flagMsg + 'the argument to property must be a string, number, or symbol',
	          undefined,
	          ssfi
	        );
	      }
	    }

	    if (isNested && isOwn) {
	      throw new AssertionError(
	        flagMsg + 'The "nested" and "own" flags cannot be combined.',
	        undefined,
	        ssfi
	      );
	    }

	    if (obj === null || obj === undefined) {
	      throw new AssertionError(
	        flagMsg + 'Target cannot be null or undefined.',
	        undefined,
	        ssfi
	      );
	    }

	    var isDeep = flag(this, 'deep')
	      , negate = flag(this, 'negate')
	      , pathInfo = isNested ? _.getPathInfo(obj, name) : null
	      , value = isNested ? pathInfo.value : obj[name]
	      , isEql = isDeep ? flag(this, 'eql') : (val1, val2) => val1 === val2;
	    var descriptor = '';
	    if (isDeep) descriptor += 'deep ';
	    if (isOwn) descriptor += 'own ';
	    if (isNested) descriptor += 'nested ';
	    descriptor += 'property ';

	    var hasProperty;
	    if (isOwn) hasProperty = Object.prototype.hasOwnProperty.call(obj, name);
	    else if (isNested) hasProperty = pathInfo.exists;
	    else hasProperty = _.hasProperty(obj, name);

	    // When performing a negated assertion for both name and val, merely having
	    // a property with the given name isn't enough to cause the assertion to
	    // fail. It must both have a property with the given name, and the value of
	    // that property must equal the given val. Therefore, skip this assertion in
	    // favor of the next.
	    if (!negate || arguments.length === 1) {
	      this.assert(
	          hasProperty
	        , 'expected #{this} to have ' + descriptor + _.inspect(name)
	        , 'expected #{this} to not have ' + descriptor + _.inspect(name));
	    }

	    if (arguments.length > 1) {
	      this.assert(
	          hasProperty && isEql(val, value)
	        , 'expected #{this} to have ' + descriptor + _.inspect(name) + ' of #{exp}, but got #{act}'
	        , 'expected #{this} to not have ' + descriptor + _.inspect(name) + ' of #{act}'
	        , val
	        , value
	      );
	    }

	    flag(this, 'object', value);
	  }

	  Assertion.addMethod('property', assertProperty);

	  function assertOwnProperty (name, value, msg) {
	    flag(this, 'own', true);
	    assertProperty.apply(this, arguments);
	  }

	  Assertion.addMethod('ownProperty', assertOwnProperty);
	  Assertion.addMethod('haveOwnProperty', assertOwnProperty);

	  /**
	   * ### .ownPropertyDescriptor(name[, descriptor[, msg]])
	   *
	   * Asserts that the target has its own property descriptor with the given key
	   * `name`. Enumerable and non-enumerable properties are included in the
	   * search.
	   *
	   *     expect({a: 1}).to.have.ownPropertyDescriptor('a');
	   *
	   * When `descriptor` is provided, `.ownPropertyDescriptor` also asserts that
	   * the property's descriptor is deeply equal to the given `descriptor`. See
	   * the `deep-eql` project page for info on the deep equality algorithm:
	   * https://github.com/chaijs/deep-eql.
	   *
	   *     expect({a: 1}).to.have.ownPropertyDescriptor('a', {
	   *       configurable: true,
	   *       enumerable: true,
	   *       writable: true,
	   *       value: 1,
	   *     });
	   *
	   * Add `.not` earlier in the chain to negate `.ownPropertyDescriptor`.
	   *
	   *     expect({a: 1}).to.not.have.ownPropertyDescriptor('b');
	   *
	   * However, it's dangerous to negate `.ownPropertyDescriptor` when providing
	   * a `descriptor`. The problem is that it creates uncertain expectations by
	   * asserting that the target either doesn't have a property descriptor with
	   * the given key `name`, or that it does have a property descriptor with the
	   * given key `name` but it’s not deeply equal to the given `descriptor`. It's
	   * often best to identify the exact output that's expected, and then write an
	   * assertion that only accepts that exact output.
	   *
	   * When the target isn't expected to have a property descriptor with the given
	   * key `name`, it's often best to assert exactly that.
	   *
	   *     // Recommended
	   *     expect({b: 2}).to.not.have.ownPropertyDescriptor('a');
	   *
	   *     // Not recommended
	   *     expect({b: 2}).to.not.have.ownPropertyDescriptor('a', {
	   *       configurable: true,
	   *       enumerable: true,
	   *       writable: true,
	   *       value: 1,
	   *     });
	   *
	   * When the target is expected to have a property descriptor with the given
	   * key `name`, it's often best to assert that the property has its expected
	   * descriptor, rather than asserting that it doesn't have one of many
	   * unexpected descriptors.
	   *
	   *     // Recommended
	   *     expect({a: 3}).to.have.ownPropertyDescriptor('a', {
	   *       configurable: true,
	   *       enumerable: true,
	   *       writable: true,
	   *       value: 3,
	   *     });
	   *
	   *     // Not recommended
	   *     expect({a: 3}).to.not.have.ownPropertyDescriptor('a', {
	   *       configurable: true,
	   *       enumerable: true,
	   *       writable: true,
	   *       value: 1,
	   *     });
	   *
	   * `.ownPropertyDescriptor` changes the target of any assertions that follow
	   * in the chain to be the value of the property descriptor from the original
	   * target object.
	   *
	   *     expect({a: 1}).to.have.ownPropertyDescriptor('a')
	   *       .that.has.property('enumerable', true);
	   *
	   * `.ownPropertyDescriptor` accepts an optional `msg` argument which is a
	   * custom error message to show when the assertion fails. The message can also
	   * be given as the second argument to `expect`. When not providing
	   * `descriptor`, only use the second form.
	   *
	   *     // Recommended
	   *     expect({a: 1}).to.have.ownPropertyDescriptor('a', {
	   *       configurable: true,
	   *       enumerable: true,
	   *       writable: true,
	   *       value: 2,
	   *     }, 'nooo why fail??');
	   *
	   *     // Recommended
	   *     expect({a: 1}, 'nooo why fail??').to.have.ownPropertyDescriptor('a', {
	   *       configurable: true,
	   *       enumerable: true,
	   *       writable: true,
	   *       value: 2,
	   *     });
	   *
	   *     // Recommended
	   *     expect({a: 1}, 'nooo why fail??').to.have.ownPropertyDescriptor('b');
	   *
	   *     // Not recommended
	   *     expect({a: 1})
	   *       .to.have.ownPropertyDescriptor('b', undefined, 'nooo why fail??');
	   *
	   * The above assertion isn't the same thing as not providing `descriptor`.
	   * Instead, it's asserting that the target object has a `b` property
	   * descriptor that's deeply equal to `undefined`.
	   *
	   * The alias `.haveOwnPropertyDescriptor` can be used interchangeably with
	   * `.ownPropertyDescriptor`.
	   *
	   * @name ownPropertyDescriptor
	   * @alias haveOwnPropertyDescriptor
	   * @param {String} name
	   * @param {Object} descriptor _optional_
	   * @param {String} msg _optional_
	   * @namespace BDD
	   * @api public
	   */

	  function assertOwnPropertyDescriptor (name, descriptor, msg) {
	    if (typeof descriptor === 'string') {
	      msg = descriptor;
	      descriptor = null;
	    }
	    if (msg) flag(this, 'message', msg);
	    var obj = flag(this, 'object');
	    var actualDescriptor = Object.getOwnPropertyDescriptor(Object(obj), name);
	    var eql = flag(this, 'eql');
	    if (actualDescriptor && descriptor) {
	      this.assert(
	          eql(descriptor, actualDescriptor)
	        , 'expected the own property descriptor for ' + _.inspect(name) + ' on #{this} to match ' + _.inspect(descriptor) + ', got ' + _.inspect(actualDescriptor)
	        , 'expected the own property descriptor for ' + _.inspect(name) + ' on #{this} to not match ' + _.inspect(descriptor)
	        , descriptor
	        , actualDescriptor
	        , true
	      );
	    } else {
	      this.assert(
	          actualDescriptor
	        , 'expected #{this} to have an own property descriptor for ' + _.inspect(name)
	        , 'expected #{this} to not have an own property descriptor for ' + _.inspect(name)
	      );
	    }
	    flag(this, 'object', actualDescriptor);
	  }

	  Assertion.addMethod('ownPropertyDescriptor', assertOwnPropertyDescriptor);
	  Assertion.addMethod('haveOwnPropertyDescriptor', assertOwnPropertyDescriptor);

	  /**
	   * ### .lengthOf(n[, msg])
	   *
	   * Asserts that the target's `length` or `size` is equal to the given number
	   * `n`.
	   *
	   *     expect([1, 2, 3]).to.have.lengthOf(3);
	   *     expect('foo').to.have.lengthOf(3);
	   *     expect(new Set([1, 2, 3])).to.have.lengthOf(3);
	   *     expect(new Map([['a', 1], ['b', 2], ['c', 3]])).to.have.lengthOf(3);
	   *
	   * Add `.not` earlier in the chain to negate `.lengthOf`. However, it's often
	   * best to assert that the target's `length` property is equal to its expected
	   * value, rather than not equal to one of many unexpected values.
	   *
	   *     expect('foo').to.have.lengthOf(3); // Recommended
	   *     expect('foo').to.not.have.lengthOf(4); // Not recommended
	   *
	   * `.lengthOf` accepts an optional `msg` argument which is a custom error
	   * message to show when the assertion fails. The message can also be given as
	   * the second argument to `expect`.
	   *
	   *     expect([1, 2, 3]).to.have.lengthOf(2, 'nooo why fail??');
	   *     expect([1, 2, 3], 'nooo why fail??').to.have.lengthOf(2);
	   *
	   * `.lengthOf` can also be used as a language chain, causing all `.above`,
	   * `.below`, `.least`, `.most`, and `.within` assertions that follow in the
	   * chain to use the target's `length` property as the target. However, it's
	   * often best to assert that the target's `length` property is equal to its
	   * expected length, rather than asserting that its `length` property falls
	   * within some range of values.
	   *
	   *     // Recommended
	   *     expect([1, 2, 3]).to.have.lengthOf(3);
	   *
	   *     // Not recommended
	   *     expect([1, 2, 3]).to.have.lengthOf.above(2);
	   *     expect([1, 2, 3]).to.have.lengthOf.below(4);
	   *     expect([1, 2, 3]).to.have.lengthOf.at.least(3);
	   *     expect([1, 2, 3]).to.have.lengthOf.at.most(3);
	   *     expect([1, 2, 3]).to.have.lengthOf.within(2,4);
	   *
	   * Due to a compatibility issue, the alias `.length` can't be chained directly
	   * off of an uninvoked method such as `.a`. Therefore, `.length` can't be used
	   * interchangeably with `.lengthOf` in every situation. It's recommended to
	   * always use `.lengthOf` instead of `.length`.
	   *
	   *     expect([1, 2, 3]).to.have.a.length(3); // incompatible; throws error
	   *     expect([1, 2, 3]).to.have.a.lengthOf(3);  // passes as expected
	   *
	   * @name lengthOf
	   * @alias length
	   * @param {Number} n
	   * @param {String} msg _optional_
	   * @namespace BDD
	   * @api public
	   */

	  function assertLengthChain () {
	    flag(this, 'doLength', true);
	  }

	  function assertLength (n, msg) {
	    if (msg) flag(this, 'message', msg);
	    var obj = flag(this, 'object')
	      , objType = _.type(obj).toLowerCase()
	      , flagMsg = flag(this, 'message')
	      , ssfi = flag(this, 'ssfi')
	      , descriptor = 'length'
	      , itemsCount;

	    switch (objType) {
	      case 'map':
	      case 'set':
	        descriptor = 'size';
	        itemsCount = obj.size;
	        break;
	      default:
	        new Assertion(obj, flagMsg, ssfi, true).to.have.property('length');
	        itemsCount = obj.length;
	    }

	    this.assert(
	        itemsCount == n
	      , 'expected #{this} to have a ' + descriptor + ' of #{exp} but got #{act}'
	      , 'expected #{this} to not have a ' + descriptor + ' of #{act}'
	      , n
	      , itemsCount
	    );
	  }

	  Assertion.addChainableMethod('length', assertLength, assertLengthChain);
	  Assertion.addChainableMethod('lengthOf', assertLength, assertLengthChain);

	  /**
	   * ### .match(re[, msg])
	   *
	   * Asserts that the target matches the given regular expression `re`.
	   *
	   *     expect('foobar').to.match(/^foo/);
	   *
	   * Add `.not` earlier in the chain to negate `.match`.
	   *
	   *     expect('foobar').to.not.match(/taco/);
	   *
	   * `.match` accepts an optional `msg` argument which is a custom error message
	   * to show when the assertion fails. The message can also be given as the
	   * second argument to `expect`.
	   *
	   *     expect('foobar').to.match(/taco/, 'nooo why fail??');
	   *     expect('foobar', 'nooo why fail??').to.match(/taco/);
	   *
	   * The alias `.matches` can be used interchangeably with `.match`.
	   *
	   * @name match
	   * @alias matches
	   * @param {RegExp} re
	   * @param {String} msg _optional_
	   * @namespace BDD
	   * @api public
	   */
	  function assertMatch(re, msg) {
	    if (msg) flag(this, 'message', msg);
	    var obj = flag(this, 'object');
	    this.assert(
	        re.exec(obj)
	      , 'expected #{this} to match ' + re
	      , 'expected #{this} not to match ' + re
	    );
	  }

	  Assertion.addMethod('match', assertMatch);
	  Assertion.addMethod('matches', assertMatch);

	  /**
	   * ### .string(str[, msg])
	   *
	   * Asserts that the target string contains the given substring `str`.
	   *
	   *     expect('foobar').to.have.string('bar');
	   *
	   * Add `.not` earlier in the chain to negate `.string`.
	   *
	   *     expect('foobar').to.not.have.string('taco');
	   *
	   * `.string` accepts an optional `msg` argument which is a custom error
	   * message to show when the assertion fails. The message can also be given as
	   * the second argument to `expect`.
	   *
	   *     expect('foobar').to.have.string('taco', 'nooo why fail??');
	   *     expect('foobar', 'nooo why fail??').to.have.string('taco');
	   *
	   * @name string
	   * @param {String} str
	   * @param {String} msg _optional_
	   * @namespace BDD
	   * @api public
	   */

	  Assertion.addMethod('string', function (str, msg) {
	    if (msg) flag(this, 'message', msg);
	    var obj = flag(this, 'object')
	      , flagMsg = flag(this, 'message')
	      , ssfi = flag(this, 'ssfi');
	    new Assertion(obj, flagMsg, ssfi, true).is.a('string');

	    this.assert(
	        ~obj.indexOf(str)
	      , 'expected #{this} to contain ' + _.inspect(str)
	      , 'expected #{this} to not contain ' + _.inspect(str)
	    );
	  });

	  /**
	   * ### .keys(key1[, key2[, ...]])
	   *
	   * Asserts that the target object, array, map, or set has the given keys. Only
	   * the target's own inherited properties are included in the search.
	   *
	   * When the target is an object or array, keys can be provided as one or more
	   * string arguments, a single array argument, or a single object argument. In
	   * the latter case, only the keys in the given object matter; the values are
	   * ignored.
	   *
	   *     expect({a: 1, b: 2}).to.have.all.keys('a', 'b');
	   *     expect(['x', 'y']).to.have.all.keys(0, 1);
	   *
	   *     expect({a: 1, b: 2}).to.have.all.keys(['a', 'b']);
	   *     expect(['x', 'y']).to.have.all.keys([0, 1]);
	   *
	   *     expect({a: 1, b: 2}).to.have.all.keys({a: 4, b: 5}); // ignore 4 and 5
	   *     expect(['x', 'y']).to.have.all.keys({0: 4, 1: 5}); // ignore 4 and 5
	   *
	   * When the target is a map or set, each key must be provided as a separate
	   * argument.
	   *
	   *     expect(new Map([['a', 1], ['b', 2]])).to.have.all.keys('a', 'b');
	   *     expect(new Set(['a', 'b'])).to.have.all.keys('a', 'b');
	   *
	   * Because `.keys` does different things based on the target's type, it's
	   * important to check the target's type before using `.keys`. See the `.a` doc
	   * for info on testing a target's type.
	   *
	   *     expect({a: 1, b: 2}).to.be.an('object').that.has.all.keys('a', 'b');
	   *
	   * By default, strict (`===`) equality is used to compare keys of maps and
	   * sets. Add `.deep` earlier in the chain to use deep equality instead. See
	   * the `deep-eql` project page for info on the deep equality algorithm:
	   * https://github.com/chaijs/deep-eql.
	   *
	   *     // Target set deeply (but not strictly) has key `{a: 1}`
	   *     expect(new Set([{a: 1}])).to.have.all.deep.keys([{a: 1}]);
	   *     expect(new Set([{a: 1}])).to.not.have.all.keys([{a: 1}]);
	   *
	   * By default, the target must have all of the given keys and no more. Add
	   * `.any` earlier in the chain to only require that the target have at least
	   * one of the given keys. Also, add `.not` earlier in the chain to negate
	   * `.keys`. It's often best to add `.any` when negating `.keys`, and to use
	   * `.all` when asserting `.keys` without negation.
	   *
	   * When negating `.keys`, `.any` is preferred because `.not.any.keys` asserts
	   * exactly what's expected of the output, whereas `.not.all.keys` creates
	   * uncertain expectations.
	   *
	   *     // Recommended; asserts that target doesn't have any of the given keys
	   *     expect({a: 1, b: 2}).to.not.have.any.keys('c', 'd');
	   *
	   *     // Not recommended; asserts that target doesn't have all of the given
	   *     // keys but may or may not have some of them
	   *     expect({a: 1, b: 2}).to.not.have.all.keys('c', 'd');
	   *
	   * When asserting `.keys` without negation, `.all` is preferred because
	   * `.all.keys` asserts exactly what's expected of the output, whereas
	   * `.any.keys` creates uncertain expectations.
	   *
	   *     // Recommended; asserts that target has all the given keys
	   *     expect({a: 1, b: 2}).to.have.all.keys('a', 'b');
	   *
	   *     // Not recommended; asserts that target has at least one of the given
	   *     // keys but may or may not have more of them
	   *     expect({a: 1, b: 2}).to.have.any.keys('a', 'b');
	   *
	   * Note that `.all` is used by default when neither `.all` nor `.any` appear
	   * earlier in the chain. However, it's often best to add `.all` anyway because
	   * it improves readability.
	   *
	   *     // Both assertions are identical
	   *     expect({a: 1, b: 2}).to.have.all.keys('a', 'b'); // Recommended
	   *     expect({a: 1, b: 2}).to.have.keys('a', 'b'); // Not recommended
	   *
	   * Add `.include` earlier in the chain to require that the target's keys be a
	   * superset of the expected keys, rather than identical sets.
	   *
	   *     // Target object's keys are a superset of ['a', 'b'] but not identical
	   *     expect({a: 1, b: 2, c: 3}).to.include.all.keys('a', 'b');
	   *     expect({a: 1, b: 2, c: 3}).to.not.have.all.keys('a', 'b');
	   *
	   * However, if `.any` and `.include` are combined, only the `.any` takes
	   * effect. The `.include` is ignored in this case.
	   *
	   *     // Both assertions are identical
	   *     expect({a: 1}).to.have.any.keys('a', 'b');
	   *     expect({a: 1}).to.include.any.keys('a', 'b');
	   *
	   * A custom error message can be given as the second argument to `expect`.
	   *
	   *     expect({a: 1}, 'nooo why fail??').to.have.key('b');
	   *
	   * The alias `.key` can be used interchangeably with `.keys`.
	   *
	   * @name keys
	   * @alias key
	   * @param {...String|Array|Object} keys
	   * @namespace BDD
	   * @api public
	   */

	  function assertKeys (keys) {
	    var obj = flag(this, 'object')
	      , objType = _.type(obj)
	      , keysType = _.type(keys)
	      , ssfi = flag(this, 'ssfi')
	      , isDeep = flag(this, 'deep')
	      , str
	      , deepStr = ''
	      , actual
	      , ok = true
	      , flagMsg = flag(this, 'message');

	    flagMsg = flagMsg ? flagMsg + ': ' : '';
	    var mixedArgsMsg = flagMsg + 'when testing keys against an object or an array you must give a single Array|Object|String argument or multiple String arguments';

	    if (objType === 'Map' || objType === 'Set') {
	      deepStr = isDeep ? 'deeply ' : '';
	      actual = [];

	      // Map and Set '.keys' aren't supported in IE 11. Therefore, use .forEach.
	      obj.forEach(function (val, key) { actual.push(key); });

	      if (keysType !== 'Array') {
	        keys = Array.prototype.slice.call(arguments);
	      }
	    } else {
	      actual = _.getOwnEnumerableProperties(obj);

	      switch (keysType) {
	        case 'Array':
	          if (arguments.length > 1) {
	            throw new AssertionError(mixedArgsMsg, undefined, ssfi);
	          }
	          break;
	        case 'Object':
	          if (arguments.length > 1) {
	            throw new AssertionError(mixedArgsMsg, undefined, ssfi);
	          }
	          keys = Object.keys(keys);
	          break;
	        default:
	          keys = Array.prototype.slice.call(arguments);
	      }

	      // Only stringify non-Symbols because Symbols would become "Symbol()"
	      keys = keys.map(function (val) {
	        return typeof val === 'symbol' ? val : String(val);
	      });
	    }

	    if (!keys.length) {
	      throw new AssertionError(flagMsg + 'keys required', undefined, ssfi);
	    }

	    var len = keys.length
	      , any = flag(this, 'any')
	      , all = flag(this, 'all')
	      , expected = keys
	      , isEql = isDeep ? flag(this, 'eql') : (val1, val2) => val1 === val2;

	    if (!any && !all) {
	      all = true;
	    }

	    // Has any
	    if (any) {
	      ok = expected.some(function(expectedKey) {
	        return actual.some(function(actualKey) {
	          return isEql(expectedKey, actualKey);
	        });
	      });
	    }

	    // Has all
	    if (all) {
	      ok = expected.every(function(expectedKey) {
	        return actual.some(function(actualKey) {
	          return isEql(expectedKey, actualKey);
	        });
	      });

	      if (!flag(this, 'contains')) {
	        ok = ok && keys.length == actual.length;
	      }
	    }

	    // Key string
	    if (len > 1) {
	      keys = keys.map(function(key) {
	        return _.inspect(key);
	      });
	      var last = keys.pop();
	      if (all) {
	        str = keys.join(', ') + ', and ' + last;
	      }
	      if (any) {
	        str = keys.join(', ') + ', or ' + last;
	      }
	    } else {
	      str = _.inspect(keys[0]);
	    }

	    // Form
	    str = (len > 1 ? 'keys ' : 'key ') + str;

	    // Have / include
	    str = (flag(this, 'contains') ? 'contain ' : 'have ') + str;

	    // Assertion
	    this.assert(
	        ok
	      , 'expected #{this} to ' + deepStr + str
	      , 'expected #{this} to not ' + deepStr + str
	      , expected.slice(0).sort(_.compareByInspect)
	      , actual.sort(_.compareByInspect)
	      , true
	    );
	  }

	  Assertion.addMethod('keys', assertKeys);
	  Assertion.addMethod('key', assertKeys);

	  /**
	   * ### .throw([errorLike], [errMsgMatcher], [msg])
	   *
	   * When no arguments are provided, `.throw` invokes the target function and
	   * asserts that an error is thrown.
	   *
	   *     var badFn = function () { throw new TypeError('Illegal salmon!'); };
	   *
	   *     expect(badFn).to.throw();
	   *
	   * When one argument is provided, and it's an error constructor, `.throw`
	   * invokes the target function and asserts that an error is thrown that's an
	   * instance of that error constructor.
	   *
	   *     var badFn = function () { throw new TypeError('Illegal salmon!'); };
	   *
	   *     expect(badFn).to.throw(TypeError);
	   *
	   * When one argument is provided, and it's an error instance, `.throw` invokes
	   * the target function and asserts that an error is thrown that's strictly
	   * (`===`) equal to that error instance.
	   *
	   *     var err = new TypeError('Illegal salmon!');
	   *     var badFn = function () { throw err; };
	   *
	   *     expect(badFn).to.throw(err);
	   *
	   * When one argument is provided, and it's a string, `.throw` invokes the
	   * target function and asserts that an error is thrown with a message that
	   * contains that string.
	   *
	   *     var badFn = function () { throw new TypeError('Illegal salmon!'); };
	   *
	   *     expect(badFn).to.throw('salmon');
	   *
	   * When one argument is provided, and it's a regular expression, `.throw`
	   * invokes the target function and asserts that an error is thrown with a
	   * message that matches that regular expression.
	   *
	   *     var badFn = function () { throw new TypeError('Illegal salmon!'); };
	   *
	   *     expect(badFn).to.throw(/salmon/);
	   *
	   * When two arguments are provided, and the first is an error instance or
	   * constructor, and the second is a string or regular expression, `.throw`
	   * invokes the function and asserts that an error is thrown that fulfills both
	   * conditions as described above.
	   *
	   *     var err = new TypeError('Illegal salmon!');
	   *     var badFn = function () { throw err; };
	   *
	   *     expect(badFn).to.throw(TypeError, 'salmon');
	   *     expect(badFn).to.throw(TypeError, /salmon/);
	   *     expect(badFn).to.throw(err, 'salmon');
	   *     expect(badFn).to.throw(err, /salmon/);
	   *
	   * Add `.not` earlier in the chain to negate `.throw`.
	   *
	   *     var goodFn = function () {};
	   *
	   *     expect(goodFn).to.not.throw();
	   *
	   * However, it's dangerous to negate `.throw` when providing any arguments.
	   * The problem is that it creates uncertain expectations by asserting that the
	   * target either doesn't throw an error, or that it throws an error but of a
	   * different type than the given type, or that it throws an error of the given
	   * type but with a message that doesn't include the given string. It's often
	   * best to identify the exact output that's expected, and then write an
	   * assertion that only accepts that exact output.
	   *
	   * When the target isn't expected to throw an error, it's often best to assert
	   * exactly that.
	   *
	   *     var goodFn = function () {};
	   *
	   *     expect(goodFn).to.not.throw(); // Recommended
	   *     expect(goodFn).to.not.throw(ReferenceError, 'x'); // Not recommended
	   *
	   * When the target is expected to throw an error, it's often best to assert
	   * that the error is of its expected type, and has a message that includes an
	   * expected string, rather than asserting that it doesn't have one of many
	   * unexpected types, and doesn't have a message that includes some string.
	   *
	   *     var badFn = function () { throw new TypeError('Illegal salmon!'); };
	   *
	   *     expect(badFn).to.throw(TypeError, 'salmon'); // Recommended
	   *     expect(badFn).to.not.throw(ReferenceError, 'x'); // Not recommended
	   *
	   * `.throw` changes the target of any assertions that follow in the chain to
	   * be the error object that's thrown.
	   *
	   *     var err = new TypeError('Illegal salmon!');
	   *     err.code = 42;
	   *     var badFn = function () { throw err; };
	   *
	   *     expect(badFn).to.throw(TypeError).with.property('code', 42);
	   *
	   * `.throw` accepts an optional `msg` argument which is a custom error message
	   * to show when the assertion fails. The message can also be given as the
	   * second argument to `expect`. When not providing two arguments, always use
	   * the second form.
	   *
	   *     var goodFn = function () {};
	   *
	   *     expect(goodFn).to.throw(TypeError, 'x', 'nooo why fail??');
	   *     expect(goodFn, 'nooo why fail??').to.throw();
	   *
	   * Due to limitations in ES5, `.throw` may not always work as expected when
	   * using a transpiler such as Babel or TypeScript. In particular, it may
	   * produce unexpected results when subclassing the built-in `Error` object and
	   * then passing the subclassed constructor to `.throw`. See your transpiler's
	   * docs for details:
	   *
	   * - ([Babel](https://babeljs.io/docs/usage/caveats/#classes))
	   * - ([TypeScript](https://github.com/Microsoft/TypeScript/wiki/Breaking-Changes#extending-built-ins-like-error-array-and-map-may-no-longer-work))
	   *
	   * Beware of some common mistakes when using the `throw` assertion. One common
	   * mistake is to accidentally invoke the function yourself instead of letting
	   * the `throw` assertion invoke the function for you. For example, when
	   * testing if a function named `fn` throws, provide `fn` instead of `fn()` as
	   * the target for the assertion.
	   *
	   *     expect(fn).to.throw();     // Good! Tests `fn` as desired
	   *     expect(fn()).to.throw();   // Bad! Tests result of `fn()`, not `fn`
	   *
	   * If you need to assert that your function `fn` throws when passed certain
	   * arguments, then wrap a call to `fn` inside of another function.
	   *
	   *     expect(function () { fn(42); }).to.throw();  // Function expression
	   *     expect(() => fn(42)).to.throw();             // ES6 arrow function
	   *
	   * Another common mistake is to provide an object method (or any stand-alone
	   * function that relies on `this`) as the target of the assertion. Doing so is
	   * problematic because the `this` context will be lost when the function is
	   * invoked by `.throw`; there's no way for it to know what `this` is supposed
	   * to be. There are two ways around this problem. One solution is to wrap the
	   * method or function call inside of another function. Another solution is to
	   * use `bind`.
	   *
	   *     expect(function () { cat.meow(); }).to.throw();  // Function expression
	   *     expect(() => cat.meow()).to.throw();             // ES6 arrow function
	   *     expect(cat.meow.bind(cat)).to.throw();           // Bind
	   *
	   * Finally, it's worth mentioning that it's a best practice in JavaScript to
	   * only throw `Error` and derivatives of `Error` such as `ReferenceError`,
	   * `TypeError`, and user-defined objects that extend `Error`. No other type of
	   * value will generate a stack trace when initialized. With that said, the
	   * `throw` assertion does technically support any type of value being thrown,
	   * not just `Error` and its derivatives.
	   *
	   * The aliases `.throws` and `.Throw` can be used interchangeably with
	   * `.throw`.
	   *
	   * @name throw
	   * @alias throws
	   * @alias Throw
	   * @param {Error|ErrorConstructor} errorLike
	   * @param {String|RegExp} errMsgMatcher error message
	   * @param {String} msg _optional_
	   * @see https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Error#Error_types
	   * @returns error for chaining (null if no error)
	   * @namespace BDD
	   * @api public
	   */

	  function assertThrows (errorLike, errMsgMatcher, msg) {
	    if (msg) flag(this, 'message', msg);
	    var obj = flag(this, 'object')
	      , ssfi = flag(this, 'ssfi')
	      , flagMsg = flag(this, 'message')
	      , negate = flag(this, 'negate') || false;
	    new Assertion(obj, flagMsg, ssfi, true).is.a('function');

	    if (errorLike instanceof RegExp || typeof errorLike === 'string') {
	      errMsgMatcher = errorLike;
	      errorLike = null;
	    }

	    var caughtErr;
	    try {
	      obj();
	    } catch (err) {
	      caughtErr = err;
	    }

	    // If we have the negate flag enabled and at least one valid argument it means we do expect an error
	    // but we want it to match a given set of criteria
	    var everyArgIsUndefined = errorLike === undefined && errMsgMatcher === undefined;

	    // If we've got the negate flag enabled and both args, we should only fail if both aren't compatible
	    // See Issue #551 and PR #683@GitHub
	    var everyArgIsDefined = Boolean(errorLike && errMsgMatcher);
	    var errorLikeFail = false;
	    var errMsgMatcherFail = false;

	    // Checking if error was thrown
	    if (everyArgIsUndefined || !everyArgIsUndefined && !negate) {
	      // We need this to display results correctly according to their types
	      var errorLikeString = 'an error';
	      if (errorLike instanceof Error) {
	        errorLikeString = '#{exp}';
	      } else if (errorLike) {
	        errorLikeString = _.checkError.getConstructorName(errorLike);
	      }

	      this.assert(
	          caughtErr
	        , 'expected #{this} to throw ' + errorLikeString
	        , 'expected #{this} to not throw an error but #{act} was thrown'
	        , errorLike && errorLike.toString()
	        , (caughtErr instanceof Error ?
	            caughtErr.toString() : (typeof caughtErr === 'string' ? caughtErr : caughtErr &&
	                                    _.checkError.getConstructorName(caughtErr)))
	      );
	    }

	    if (errorLike && caughtErr) {
	      // We should compare instances only if `errorLike` is an instance of `Error`
	      if (errorLike instanceof Error) {
	        var isCompatibleInstance = _.checkError.compatibleInstance(caughtErr, errorLike);

	        if (isCompatibleInstance === negate) {
	          // These checks were created to ensure we won't fail too soon when we've got both args and a negate
	          // See Issue #551 and PR #683@GitHub
	          if (everyArgIsDefined && negate) {
	            errorLikeFail = true;
	          } else {
	            this.assert(
	                negate
	              , 'expected #{this} to throw #{exp} but #{act} was thrown'
	              , 'expected #{this} to not throw #{exp}' + (caughtErr && !negate ? ' but #{act} was thrown' : '')
	              , errorLike.toString()
	              , caughtErr.toString()
	            );
	          }
	        }
	      }

	      var isCompatibleConstructor = _.checkError.compatibleConstructor(caughtErr, errorLike);
	      if (isCompatibleConstructor === negate) {
	        if (everyArgIsDefined && negate) {
	            errorLikeFail = true;
	        } else {
	          this.assert(
	              negate
	            , 'expected #{this} to throw #{exp} but #{act} was thrown'
	            , 'expected #{this} to not throw #{exp}' + (caughtErr ? ' but #{act} was thrown' : '')
	            , (errorLike instanceof Error ? errorLike.toString() : errorLike && _.checkError.getConstructorName(errorLike))
	            , (caughtErr instanceof Error ? caughtErr.toString() : caughtErr && _.checkError.getConstructorName(caughtErr))
	          );
	        }
	      }
	    }

	    if (caughtErr && errMsgMatcher !== undefined && errMsgMatcher !== null) {
	      // Here we check compatible messages
	      var placeholder = 'including';
	      if (errMsgMatcher instanceof RegExp) {
	        placeholder = 'matching';
	      }

	      var isCompatibleMessage = _.checkError.compatibleMessage(caughtErr, errMsgMatcher);
	      if (isCompatibleMessage === negate) {
	        if (everyArgIsDefined && negate) {
	            errMsgMatcherFail = true;
	        } else {
	          this.assert(
	            negate
	            , 'expected #{this} to throw error ' + placeholder + ' #{exp} but got #{act}'
	            , 'expected #{this} to throw error not ' + placeholder + ' #{exp}'
	            ,  errMsgMatcher
	            ,  _.checkError.getMessage(caughtErr)
	          );
	        }
	      }
	    }

	    // If both assertions failed and both should've matched we throw an error
	    if (errorLikeFail && errMsgMatcherFail) {
	      this.assert(
	        negate
	        , 'expected #{this} to throw #{exp} but #{act} was thrown'
	        , 'expected #{this} to not throw #{exp}' + (caughtErr ? ' but #{act} was thrown' : '')
	        , (errorLike instanceof Error ? errorLike.toString() : errorLike && _.checkError.getConstructorName(errorLike))
	        , (caughtErr instanceof Error ? caughtErr.toString() : caughtErr && _.checkError.getConstructorName(caughtErr))
	      );
	    }

	    flag(this, 'object', caughtErr);
	  }
	  Assertion.addMethod('throw', assertThrows);
	  Assertion.addMethod('throws', assertThrows);
	  Assertion.addMethod('Throw', assertThrows);

	  /**
	   * ### .respondTo(method[, msg])
	   *
	   * When the target is a non-function object, `.respondTo` asserts that the
	   * target has a method with the given name `method`. The method can be own or
	   * inherited, and it can be enumerable or non-enumerable.
	   *
	   *     function Cat () {}
	   *     Cat.prototype.meow = function () {};
	   *
	   *     expect(new Cat()).to.respondTo('meow');
	   *
	   * When the target is a function, `.respondTo` asserts that the target's
	   * `prototype` property has a method with the given name `method`. Again, the
	   * method can be own or inherited, and it can be enumerable or non-enumerable.
	   *
	   *     function Cat () {}
	   *     Cat.prototype.meow = function () {};
	   *
	   *     expect(Cat).to.respondTo('meow');
	   *
	   * Add `.itself` earlier in the chain to force `.respondTo` to treat the
	   * target as a non-function object, even if it's a function. Thus, it asserts
	   * that the target has a method with the given name `method`, rather than
	   * asserting that the target's `prototype` property has a method with the
	   * given name `method`.
	   *
	   *     function Cat () {}
	   *     Cat.prototype.meow = function () {};
	   *     Cat.hiss = function () {};
	   *
	   *     expect(Cat).itself.to.respondTo('hiss').but.not.respondTo('meow');
	   *
	   * When not adding `.itself`, it's important to check the target's type before
	   * using `.respondTo`. See the `.a` doc for info on checking a target's type.
	   *
	   *     function Cat () {}
	   *     Cat.prototype.meow = function () {};
	   *
	   *     expect(new Cat()).to.be.an('object').that.respondsTo('meow');
	   *
	   * Add `.not` earlier in the chain to negate `.respondTo`.
	   *
	   *     function Dog () {}
	   *     Dog.prototype.bark = function () {};
	   *
	   *     expect(new Dog()).to.not.respondTo('meow');
	   *
	   * `.respondTo` accepts an optional `msg` argument which is a custom error
	   * message to show when the assertion fails. The message can also be given as
	   * the second argument to `expect`.
	   *
	   *     expect({}).to.respondTo('meow', 'nooo why fail??');
	   *     expect({}, 'nooo why fail??').to.respondTo('meow');
	   *
	   * The alias `.respondsTo` can be used interchangeably with `.respondTo`.
	   *
	   * @name respondTo
	   * @alias respondsTo
	   * @param {String} method
	   * @param {String} msg _optional_
	   * @namespace BDD
	   * @api public
	   */

	  function respondTo (method, msg) {
	    if (msg) flag(this, 'message', msg);
	    var obj = flag(this, 'object')
	      , itself = flag(this, 'itself')
	      , context = ('function' === typeof obj && !itself)
	        ? obj.prototype[method]
	        : obj[method];

	    this.assert(
	        'function' === typeof context
	      , 'expected #{this} to respond to ' + _.inspect(method)
	      , 'expected #{this} to not respond to ' + _.inspect(method)
	    );
	  }

	  Assertion.addMethod('respondTo', respondTo);
	  Assertion.addMethod('respondsTo', respondTo);

	  /**
	   * ### .itself
	   *
	   * Forces all `.respondTo` assertions that follow in the chain to behave as if
	   * the target is a non-function object, even if it's a function. Thus, it
	   * causes `.respondTo` to assert that the target has a method with the given
	   * name, rather than asserting that the target's `prototype` property has a
	   * method with the given name.
	   *
	   *     function Cat () {}
	   *     Cat.prototype.meow = function () {};
	   *     Cat.hiss = function () {};
	   *
	   *     expect(Cat).itself.to.respondTo('hiss').but.not.respondTo('meow');
	   *
	   * @name itself
	   * @namespace BDD
	   * @api public
	   */

	  Assertion.addProperty('itself', function () {
	    flag(this, 'itself', true);
	  });

	  /**
	   * ### .satisfy(matcher[, msg])
	   *
	   * Invokes the given `matcher` function with the target being passed as the
	   * first argument, and asserts that the value returned is truthy.
	   *
	   *     expect(1).to.satisfy(function(num) {
	   *       return num > 0;
	   *     });
	   *
	   * Add `.not` earlier in the chain to negate `.satisfy`.
	   *
	   *     expect(1).to.not.satisfy(function(num) {
	   *       return num > 2;
	   *     });
	   *
	   * `.satisfy` accepts an optional `msg` argument which is a custom error
	   * message to show when the assertion fails. The message can also be given as
	   * the second argument to `expect`.
	   *
	   *     expect(1).to.satisfy(function(num) {
	   *       return num > 2;
	   *     }, 'nooo why fail??');
	   *
	   *     expect(1, 'nooo why fail??').to.satisfy(function(num) {
	   *       return num > 2;
	   *     });
	   *
	   * The alias `.satisfies` can be used interchangeably with `.satisfy`.
	   *
	   * @name satisfy
	   * @alias satisfies
	   * @param {Function} matcher
	   * @param {String} msg _optional_
	   * @namespace BDD
	   * @api public
	   */

	  function satisfy (matcher, msg) {
	    if (msg) flag(this, 'message', msg);
	    var obj = flag(this, 'object');
	    var result = matcher(obj);
	    this.assert(
	        result
	      , 'expected #{this} to satisfy ' + _.objDisplay(matcher)
	      , 'expected #{this} to not satisfy' + _.objDisplay(matcher)
	      , flag(this, 'negate') ? false : true
	      , result
	    );
	  }

	  Assertion.addMethod('satisfy', satisfy);
	  Assertion.addMethod('satisfies', satisfy);

	  /**
	   * ### .closeTo(expected, delta[, msg])
	   *
	   * Asserts that the target is a number that's within a given +/- `delta` range
	   * of the given number `expected`. However, it's often best to assert that the
	   * target is equal to its expected value.
	   *
	   *     // Recommended
	   *     expect(1.5).to.equal(1.5);
	   *
	   *     // Not recommended
	   *     expect(1.5).to.be.closeTo(1, 0.5);
	   *     expect(1.5).to.be.closeTo(2, 0.5);
	   *     expect(1.5).to.be.closeTo(1, 1);
	   *
	   * Add `.not` earlier in the chain to negate `.closeTo`.
	   *
	   *     expect(1.5).to.equal(1.5); // Recommended
	   *     expect(1.5).to.not.be.closeTo(3, 1); // Not recommended
	   *
	   * `.closeTo` accepts an optional `msg` argument which is a custom error
	   * message to show when the assertion fails. The message can also be given as
	   * the second argument to `expect`.
	   *
	   *     expect(1.5).to.be.closeTo(3, 1, 'nooo why fail??');
	   *     expect(1.5, 'nooo why fail??').to.be.closeTo(3, 1);
	   *
	   * The alias `.approximately` can be used interchangeably with `.closeTo`.
	   *
	   * @name closeTo
	   * @alias approximately
	   * @param {Number} expected
	   * @param {Number} delta
	   * @param {String} msg _optional_
	   * @namespace BDD
	   * @api public
	   */

	  function closeTo(expected, delta, msg) {
	    if (msg) flag(this, 'message', msg);
	    var obj = flag(this, 'object')
	      , flagMsg = flag(this, 'message')
	      , ssfi = flag(this, 'ssfi');

	    new Assertion(obj, flagMsg, ssfi, true).is.a('number');
	    if (typeof expected !== 'number' || typeof delta !== 'number') {
	      flagMsg = flagMsg ? flagMsg + ': ' : '';
	      var deltaMessage = delta === undefined ? ", and a delta is required" : "";
	      throw new AssertionError(
	          flagMsg + 'the arguments to closeTo or approximately must be numbers' + deltaMessage,
	          undefined,
	          ssfi
	      );
	    }

	    this.assert(
	        Math.abs(obj - expected) <= delta
	      , 'expected #{this} to be close to ' + expected + ' +/- ' + delta
	      , 'expected #{this} not to be close to ' + expected + ' +/- ' + delta
	    );
	  }

	  Assertion.addMethod('closeTo', closeTo);
	  Assertion.addMethod('approximately', closeTo);

	  // Note: Duplicates are ignored if testing for inclusion instead of sameness.
	  function isSubsetOf(subset, superset, cmp, contains, ordered) {
	    if (!contains) {
	      if (subset.length !== superset.length) return false;
	      superset = superset.slice();
	    }

	    return subset.every(function(elem, idx) {
	      if (ordered) return cmp ? cmp(elem, superset[idx]) : elem === superset[idx];

	      if (!cmp) {
	        var matchIdx = superset.indexOf(elem);
	        if (matchIdx === -1) return false;

	        // Remove match from superset so not counted twice if duplicate in subset.
	        if (!contains) superset.splice(matchIdx, 1);
	        return true;
	      }

	      return superset.some(function(elem2, matchIdx) {
	        if (!cmp(elem, elem2)) return false;

	        // Remove match from superset so not counted twice if duplicate in subset.
	        if (!contains) superset.splice(matchIdx, 1);
	        return true;
	      });
	    });
	  }

	  /**
	   * ### .members(set[, msg])
	   *
	   * Asserts that the target array has the same members as the given array
	   * `set`.
	   *
	   *     expect([1, 2, 3]).to.have.members([2, 1, 3]);
	   *     expect([1, 2, 2]).to.have.members([2, 1, 2]);
	   *
	   * By default, members are compared using strict (`===`) equality. Add `.deep`
	   * earlier in the chain to use deep equality instead. See the `deep-eql`
	   * project page for info on the deep equality algorithm:
	   * https://github.com/chaijs/deep-eql.
	   *
	   *     // Target array deeply (but not strictly) has member `{a: 1}`
	   *     expect([{a: 1}]).to.have.deep.members([{a: 1}]);
	   *     expect([{a: 1}]).to.not.have.members([{a: 1}]);
	   *
	   * By default, order doesn't matter. Add `.ordered` earlier in the chain to
	   * require that members appear in the same order.
	   *
	   *     expect([1, 2, 3]).to.have.ordered.members([1, 2, 3]);
	   *     expect([1, 2, 3]).to.have.members([2, 1, 3])
	   *       .but.not.ordered.members([2, 1, 3]);
	   *
	   * By default, both arrays must be the same size. Add `.include` earlier in
	   * the chain to require that the target's members be a superset of the
	   * expected members. Note that duplicates are ignored in the subset when
	   * `.include` is added.
	   *
	   *     // Target array is a superset of [1, 2] but not identical
	   *     expect([1, 2, 3]).to.include.members([1, 2]);
	   *     expect([1, 2, 3]).to.not.have.members([1, 2]);
	   *
	   *     // Duplicates in the subset are ignored
	   *     expect([1, 2, 3]).to.include.members([1, 2, 2, 2]);
	   *
	   * `.deep`, `.ordered`, and `.include` can all be combined. However, if
	   * `.include` and `.ordered` are combined, the ordering begins at the start of
	   * both arrays.
	   *
	   *     expect([{a: 1}, {b: 2}, {c: 3}])
	   *       .to.include.deep.ordered.members([{a: 1}, {b: 2}])
	   *       .but.not.include.deep.ordered.members([{b: 2}, {c: 3}]);
	   *
	   * Add `.not` earlier in the chain to negate `.members`. However, it's
	   * dangerous to do so. The problem is that it creates uncertain expectations
	   * by asserting that the target array doesn't have all of the same members as
	   * the given array `set` but may or may not have some of them. It's often best
	   * to identify the exact output that's expected, and then write an assertion
	   * that only accepts that exact output.
	   *
	   *     expect([1, 2]).to.not.include(3).and.not.include(4); // Recommended
	   *     expect([1, 2]).to.not.have.members([3, 4]); // Not recommended
	   *
	   * `.members` accepts an optional `msg` argument which is a custom error
	   * message to show when the assertion fails. The message can also be given as
	   * the second argument to `expect`.
	   *
	   *     expect([1, 2]).to.have.members([1, 2, 3], 'nooo why fail??');
	   *     expect([1, 2], 'nooo why fail??').to.have.members([1, 2, 3]);
	   *
	   * @name members
	   * @param {Array} set
	   * @param {String} msg _optional_
	   * @namespace BDD
	   * @api public
	   */

	  Assertion.addMethod('members', function (subset, msg) {
	    if (msg) flag(this, 'message', msg);
	    var obj = flag(this, 'object')
	      , flagMsg = flag(this, 'message')
	      , ssfi = flag(this, 'ssfi');

	    new Assertion(obj, flagMsg, ssfi, true).to.be.an('array');
	    new Assertion(subset, flagMsg, ssfi, true).to.be.an('array');

	    var contains = flag(this, 'contains');
	    var ordered = flag(this, 'ordered');

	    var subject, failMsg, failNegateMsg;

	    if (contains) {
	      subject = ordered ? 'an ordered superset' : 'a superset';
	      failMsg = 'expected #{this} to be ' + subject + ' of #{exp}';
	      failNegateMsg = 'expected #{this} to not be ' + subject + ' of #{exp}';
	    } else {
	      subject = ordered ? 'ordered members' : 'members';
	      failMsg = 'expected #{this} to have the same ' + subject + ' as #{exp}';
	      failNegateMsg = 'expected #{this} to not have the same ' + subject + ' as #{exp}';
	    }

	    var cmp = flag(this, 'deep') ? flag(this, 'eql') : undefined;

	    this.assert(
	        isSubsetOf(subset, obj, cmp, contains, ordered)
	      , failMsg
	      , failNegateMsg
	      , subset
	      , obj
	      , true
	    );
	  });

	  /**
	   * ### .oneOf(list[, msg])
	   *
	   * Asserts that the target is a member of the given array `list`. However,
	   * it's often best to assert that the target is equal to its expected value.
	   *
	   *     expect(1).to.equal(1); // Recommended
	   *     expect(1).to.be.oneOf([1, 2, 3]); // Not recommended
	   *
	   * Comparisons are performed using strict (`===`) equality.
	   *
	   * Add `.not` earlier in the chain to negate `.oneOf`.
	   *
	   *     expect(1).to.equal(1); // Recommended
	   *     expect(1).to.not.be.oneOf([2, 3, 4]); // Not recommended
	   *
	   * It can also be chained with `.contain` or `.include`, which will work with
	   * both arrays and strings:
	   *
	   *     expect('Today is sunny').to.contain.oneOf(['sunny', 'cloudy'])
	   *     expect('Today is rainy').to.not.contain.oneOf(['sunny', 'cloudy'])
	   *     expect([1,2,3]).to.contain.oneOf([3,4,5])
	   *     expect([1,2,3]).to.not.contain.oneOf([4,5,6])
	   *
	   * `.oneOf` accepts an optional `msg` argument which is a custom error message
	   * to show when the assertion fails. The message can also be given as the
	   * second argument to `expect`.
	   *
	   *     expect(1).to.be.oneOf([2, 3, 4], 'nooo why fail??');
	   *     expect(1, 'nooo why fail??').to.be.oneOf([2, 3, 4]);
	   *
	   * @name oneOf
	   * @param {Array<*>} list
	   * @param {String} msg _optional_
	   * @namespace BDD
	   * @api public
	   */

	  function oneOf (list, msg) {
	    if (msg) flag(this, 'message', msg);
	    var expected = flag(this, 'object')
	      , flagMsg = flag(this, 'message')
	      , ssfi = flag(this, 'ssfi')
	      , contains = flag(this, 'contains')
	      , isDeep = flag(this, 'deep')
	      , eql = flag(this, 'eql');
	    new Assertion(list, flagMsg, ssfi, true).to.be.an('array');

	    if (contains) {
	      this.assert(
	        list.some(function(possibility) { return expected.indexOf(possibility) > -1 })
	        , 'expected #{this} to contain one of #{exp}'
	        , 'expected #{this} to not contain one of #{exp}'
	        , list
	        , expected
	      );
	    } else {
	      if (isDeep) {
	        this.assert(
	          list.some(function(possibility) { return eql(expected, possibility) })
	          , 'expected #{this} to deeply equal one of #{exp}'
	          , 'expected #{this} to deeply equal one of #{exp}'
	          , list
	          , expected
	        );
	      } else {
	        this.assert(
	          list.indexOf(expected) > -1
	          , 'expected #{this} to be one of #{exp}'
	          , 'expected #{this} to not be one of #{exp}'
	          , list
	          , expected
	        );
	      }
	    }
	  }

	  Assertion.addMethod('oneOf', oneOf);

	  /**
	   * ### .change(subject[, prop[, msg]])
	   *
	   * When one argument is provided, `.change` asserts that the given function
	   * `subject` returns a different value when it's invoked before the target
	   * function compared to when it's invoked afterward. However, it's often best
	   * to assert that `subject` is equal to its expected value.
	   *
	   *     var dots = ''
	   *       , addDot = function () { dots += '.'; }
	   *       , getDots = function () { return dots; };
	   *
	   *     // Recommended
	   *     expect(getDots()).to.equal('');
	   *     addDot();
	   *     expect(getDots()).to.equal('.');
	   *
	   *     // Not recommended
	   *     expect(addDot).to.change(getDots);
	   *
	   * When two arguments are provided, `.change` asserts that the value of the
	   * given object `subject`'s `prop` property is different before invoking the
	   * target function compared to afterward.
	   *
	   *     var myObj = {dots: ''}
	   *       , addDot = function () { myObj.dots += '.'; };
	   *
	   *     // Recommended
	   *     expect(myObj).to.have.property('dots', '');
	   *     addDot();
	   *     expect(myObj).to.have.property('dots', '.');
	   *
	   *     // Not recommended
	   *     expect(addDot).to.change(myObj, 'dots');
	   *
	   * Strict (`===`) equality is used to compare before and after values.
	   *
	   * Add `.not` earlier in the chain to negate `.change`.
	   *
	   *     var dots = ''
	   *       , noop = function () {}
	   *       , getDots = function () { return dots; };
	   *
	   *     expect(noop).to.not.change(getDots);
	   *
	   *     var myObj = {dots: ''}
	   *       , noop = function () {};
	   *
	   *     expect(noop).to.not.change(myObj, 'dots');
	   *
	   * `.change` accepts an optional `msg` argument which is a custom error
	   * message to show when the assertion fails. The message can also be given as
	   * the second argument to `expect`. When not providing two arguments, always
	   * use the second form.
	   *
	   *     var myObj = {dots: ''}
	   *       , addDot = function () { myObj.dots += '.'; };
	   *
	   *     expect(addDot).to.not.change(myObj, 'dots', 'nooo why fail??');
	   *
	   *     var dots = ''
	   *       , addDot = function () { dots += '.'; }
	   *       , getDots = function () { return dots; };
	   *
	   *     expect(addDot, 'nooo why fail??').to.not.change(getDots);
	   *
	   * `.change` also causes all `.by` assertions that follow in the chain to
	   * assert how much a numeric subject was increased or decreased by. However,
	   * it's dangerous to use `.change.by`. The problem is that it creates
	   * uncertain expectations by asserting that the subject either increases by
	   * the given delta, or that it decreases by the given delta. It's often best
	   * to identify the exact output that's expected, and then write an assertion
	   * that only accepts that exact output.
	   *
	   *     var myObj = {val: 1}
	   *       , addTwo = function () { myObj.val += 2; }
	   *       , subtractTwo = function () { myObj.val -= 2; };
	   *
	   *     expect(addTwo).to.increase(myObj, 'val').by(2); // Recommended
	   *     expect(addTwo).to.change(myObj, 'val').by(2); // Not recommended
	   *
	   *     expect(subtractTwo).to.decrease(myObj, 'val').by(2); // Recommended
	   *     expect(subtractTwo).to.change(myObj, 'val').by(2); // Not recommended
	   *
	   * The alias `.changes` can be used interchangeably with `.change`.
	   *
	   * @name change
	   * @alias changes
	   * @param {String} subject
	   * @param {String} prop name _optional_
	   * @param {String} msg _optional_
	   * @namespace BDD
	   * @api public
	   */

	  function assertChanges (subject, prop, msg) {
	    if (msg) flag(this, 'message', msg);
	    var fn = flag(this, 'object')
	      , flagMsg = flag(this, 'message')
	      , ssfi = flag(this, 'ssfi');
	    new Assertion(fn, flagMsg, ssfi, true).is.a('function');

	    var initial;
	    if (!prop) {
	      new Assertion(subject, flagMsg, ssfi, true).is.a('function');
	      initial = subject();
	    } else {
	      new Assertion(subject, flagMsg, ssfi, true).to.have.property(prop);
	      initial = subject[prop];
	    }

	    fn();

	    var final = prop === undefined || prop === null ? subject() : subject[prop];
	    var msgObj = prop === undefined || prop === null ? initial : '.' + prop;

	    // This gets flagged because of the .by(delta) assertion
	    flag(this, 'deltaMsgObj', msgObj);
	    flag(this, 'initialDeltaValue', initial);
	    flag(this, 'finalDeltaValue', final);
	    flag(this, 'deltaBehavior', 'change');
	    flag(this, 'realDelta', final !== initial);

	    this.assert(
	      initial !== final
	      , 'expected ' + msgObj + ' to change'
	      , 'expected ' + msgObj + ' to not change'
	    );
	  }

	  Assertion.addMethod('change', assertChanges);
	  Assertion.addMethod('changes', assertChanges);

	  /**
	   * ### .increase(subject[, prop[, msg]])
	   *
	   * When one argument is provided, `.increase` asserts that the given function
	   * `subject` returns a greater number when it's invoked after invoking the
	   * target function compared to when it's invoked beforehand. `.increase` also
	   * causes all `.by` assertions that follow in the chain to assert how much
	   * greater of a number is returned. It's often best to assert that the return
	   * value increased by the expected amount, rather than asserting it increased
	   * by any amount.
	   *
	   *     var val = 1
	   *       , addTwo = function () { val += 2; }
	   *       , getVal = function () { return val; };
	   *
	   *     expect(addTwo).to.increase(getVal).by(2); // Recommended
	   *     expect(addTwo).to.increase(getVal); // Not recommended
	   *
	   * When two arguments are provided, `.increase` asserts that the value of the
	   * given object `subject`'s `prop` property is greater after invoking the
	   * target function compared to beforehand.
	   *
	   *     var myObj = {val: 1}
	   *       , addTwo = function () { myObj.val += 2; };
	   *
	   *     expect(addTwo).to.increase(myObj, 'val').by(2); // Recommended
	   *     expect(addTwo).to.increase(myObj, 'val'); // Not recommended
	   *
	   * Add `.not` earlier in the chain to negate `.increase`. However, it's
	   * dangerous to do so. The problem is that it creates uncertain expectations
	   * by asserting that the subject either decreases, or that it stays the same.
	   * It's often best to identify the exact output that's expected, and then
	   * write an assertion that only accepts that exact output.
	   *
	   * When the subject is expected to decrease, it's often best to assert that it
	   * decreased by the expected amount.
	   *
	   *     var myObj = {val: 1}
	   *       , subtractTwo = function () { myObj.val -= 2; };
	   *
	   *     expect(subtractTwo).to.decrease(myObj, 'val').by(2); // Recommended
	   *     expect(subtractTwo).to.not.increase(myObj, 'val'); // Not recommended
	   *
	   * When the subject is expected to stay the same, it's often best to assert
	   * exactly that.
	   *
	   *     var myObj = {val: 1}
	   *       , noop = function () {};
	   *
	   *     expect(noop).to.not.change(myObj, 'val'); // Recommended
	   *     expect(noop).to.not.increase(myObj, 'val'); // Not recommended
	   *
	   * `.increase` accepts an optional `msg` argument which is a custom error
	   * message to show when the assertion fails. The message can also be given as
	   * the second argument to `expect`. When not providing two arguments, always
	   * use the second form.
	   *
	   *     var myObj = {val: 1}
	   *       , noop = function () {};
	   *
	   *     expect(noop).to.increase(myObj, 'val', 'nooo why fail??');
	   *
	   *     var val = 1
	   *       , noop = function () {}
	   *       , getVal = function () { return val; };
	   *
	   *     expect(noop, 'nooo why fail??').to.increase(getVal);
	   *
	   * The alias `.increases` can be used interchangeably with `.increase`.
	   *
	   * @name increase
	   * @alias increases
	   * @param {String|Function} subject
	   * @param {String} prop name _optional_
	   * @param {String} msg _optional_
	   * @namespace BDD
	   * @api public
	   */

	  function assertIncreases (subject, prop, msg) {
	    if (msg) flag(this, 'message', msg);
	    var fn = flag(this, 'object')
	      , flagMsg = flag(this, 'message')
	      , ssfi = flag(this, 'ssfi');
	    new Assertion(fn, flagMsg, ssfi, true).is.a('function');

	    var initial;
	    if (!prop) {
	      new Assertion(subject, flagMsg, ssfi, true).is.a('function');
	      initial = subject();
	    } else {
	      new Assertion(subject, flagMsg, ssfi, true).to.have.property(prop);
	      initial = subject[prop];
	    }

	    // Make sure that the target is a number
	    new Assertion(initial, flagMsg, ssfi, true).is.a('number');

	    fn();

	    var final = prop === undefined || prop === null ? subject() : subject[prop];
	    var msgObj = prop === undefined || prop === null ? initial : '.' + prop;

	    flag(this, 'deltaMsgObj', msgObj);
	    flag(this, 'initialDeltaValue', initial);
	    flag(this, 'finalDeltaValue', final);
	    flag(this, 'deltaBehavior', 'increase');
	    flag(this, 'realDelta', final - initial);

	    this.assert(
	      final - initial > 0
	      , 'expected ' + msgObj + ' to increase'
	      , 'expected ' + msgObj + ' to not increase'
	    );
	  }

	  Assertion.addMethod('increase', assertIncreases);
	  Assertion.addMethod('increases', assertIncreases);

	  /**
	   * ### .decrease(subject[, prop[, msg]])
	   *
	   * When one argument is provided, `.decrease` asserts that the given function
	   * `subject` returns a lesser number when it's invoked after invoking the
	   * target function compared to when it's invoked beforehand. `.decrease` also
	   * causes all `.by` assertions that follow in the chain to assert how much
	   * lesser of a number is returned. It's often best to assert that the return
	   * value decreased by the expected amount, rather than asserting it decreased
	   * by any amount.
	   *
	   *     var val = 1
	   *       , subtractTwo = function () { val -= 2; }
	   *       , getVal = function () { return val; };
	   *
	   *     expect(subtractTwo).to.decrease(getVal).by(2); // Recommended
	   *     expect(subtractTwo).to.decrease(getVal); // Not recommended
	   *
	   * When two arguments are provided, `.decrease` asserts that the value of the
	   * given object `subject`'s `prop` property is lesser after invoking the
	   * target function compared to beforehand.
	   *
	   *     var myObj = {val: 1}
	   *       , subtractTwo = function () { myObj.val -= 2; };
	   *
	   *     expect(subtractTwo).to.decrease(myObj, 'val').by(2); // Recommended
	   *     expect(subtractTwo).to.decrease(myObj, 'val'); // Not recommended
	   *
	   * Add `.not` earlier in the chain to negate `.decrease`. However, it's
	   * dangerous to do so. The problem is that it creates uncertain expectations
	   * by asserting that the subject either increases, or that it stays the same.
	   * It's often best to identify the exact output that's expected, and then
	   * write an assertion that only accepts that exact output.
	   *
	   * When the subject is expected to increase, it's often best to assert that it
	   * increased by the expected amount.
	   *
	   *     var myObj = {val: 1}
	   *       , addTwo = function () { myObj.val += 2; };
	   *
	   *     expect(addTwo).to.increase(myObj, 'val').by(2); // Recommended
	   *     expect(addTwo).to.not.decrease(myObj, 'val'); // Not recommended
	   *
	   * When the subject is expected to stay the same, it's often best to assert
	   * exactly that.
	   *
	   *     var myObj = {val: 1}
	   *       , noop = function () {};
	   *
	   *     expect(noop).to.not.change(myObj, 'val'); // Recommended
	   *     expect(noop).to.not.decrease(myObj, 'val'); // Not recommended
	   *
	   * `.decrease` accepts an optional `msg` argument which is a custom error
	   * message to show when the assertion fails. The message can also be given as
	   * the second argument to `expect`. When not providing two arguments, always
	   * use the second form.
	   *
	   *     var myObj = {val: 1}
	   *       , noop = function () {};
	   *
	   *     expect(noop).to.decrease(myObj, 'val', 'nooo why fail??');
	   *
	   *     var val = 1
	   *       , noop = function () {}
	   *       , getVal = function () { return val; };
	   *
	   *     expect(noop, 'nooo why fail??').to.decrease(getVal);
	   *
	   * The alias `.decreases` can be used interchangeably with `.decrease`.
	   *
	   * @name decrease
	   * @alias decreases
	   * @param {String|Function} subject
	   * @param {String} prop name _optional_
	   * @param {String} msg _optional_
	   * @namespace BDD
	   * @api public
	   */

	  function assertDecreases (subject, prop, msg) {
	    if (msg) flag(this, 'message', msg);
	    var fn = flag(this, 'object')
	      , flagMsg = flag(this, 'message')
	      , ssfi = flag(this, 'ssfi');
	    new Assertion(fn, flagMsg, ssfi, true).is.a('function');

	    var initial;
	    if (!prop) {
	      new Assertion(subject, flagMsg, ssfi, true).is.a('function');
	      initial = subject();
	    } else {
	      new Assertion(subject, flagMsg, ssfi, true).to.have.property(prop);
	      initial = subject[prop];
	    }

	    // Make sure that the target is a number
	    new Assertion(initial, flagMsg, ssfi, true).is.a('number');

	    fn();

	    var final = prop === undefined || prop === null ? subject() : subject[prop];
	    var msgObj = prop === undefined || prop === null ? initial : '.' + prop;

	    flag(this, 'deltaMsgObj', msgObj);
	    flag(this, 'initialDeltaValue', initial);
	    flag(this, 'finalDeltaValue', final);
	    flag(this, 'deltaBehavior', 'decrease');
	    flag(this, 'realDelta', initial - final);

	    this.assert(
	      final - initial < 0
	      , 'expected ' + msgObj + ' to decrease'
	      , 'expected ' + msgObj + ' to not decrease'
	    );
	  }

	  Assertion.addMethod('decrease', assertDecreases);
	  Assertion.addMethod('decreases', assertDecreases);

	  /**
	   * ### .by(delta[, msg])
	   *
	   * When following an `.increase` assertion in the chain, `.by` asserts that
	   * the subject of the `.increase` assertion increased by the given `delta`.
	   *
	   *     var myObj = {val: 1}
	   *       , addTwo = function () { myObj.val += 2; };
	   *
	   *     expect(addTwo).to.increase(myObj, 'val').by(2);
	   *
	   * When following a `.decrease` assertion in the chain, `.by` asserts that the
	   * subject of the `.decrease` assertion decreased by the given `delta`.
	   *
	   *     var myObj = {val: 1}
	   *       , subtractTwo = function () { myObj.val -= 2; };
	   *
	   *     expect(subtractTwo).to.decrease(myObj, 'val').by(2);
	   *
	   * When following a `.change` assertion in the chain, `.by` asserts that the
	   * subject of the `.change` assertion either increased or decreased by the
	   * given `delta`. However, it's dangerous to use `.change.by`. The problem is
	   * that it creates uncertain expectations. It's often best to identify the
	   * exact output that's expected, and then write an assertion that only accepts
	   * that exact output.
	   *
	   *     var myObj = {val: 1}
	   *       , addTwo = function () { myObj.val += 2; }
	   *       , subtractTwo = function () { myObj.val -= 2; };
	   *
	   *     expect(addTwo).to.increase(myObj, 'val').by(2); // Recommended
	   *     expect(addTwo).to.change(myObj, 'val').by(2); // Not recommended
	   *
	   *     expect(subtractTwo).to.decrease(myObj, 'val').by(2); // Recommended
	   *     expect(subtractTwo).to.change(myObj, 'val').by(2); // Not recommended
	   *
	   * Add `.not` earlier in the chain to negate `.by`. However, it's often best
	   * to assert that the subject changed by its expected delta, rather than
	   * asserting that it didn't change by one of countless unexpected deltas.
	   *
	   *     var myObj = {val: 1}
	   *       , addTwo = function () { myObj.val += 2; };
	   *
	   *     // Recommended
	   *     expect(addTwo).to.increase(myObj, 'val').by(2);
	   *
	   *     // Not recommended
	   *     expect(addTwo).to.increase(myObj, 'val').but.not.by(3);
	   *
	   * `.by` accepts an optional `msg` argument which is a custom error message to
	   * show when the assertion fails. The message can also be given as the second
	   * argument to `expect`.
	   *
	   *     var myObj = {val: 1}
	   *       , addTwo = function () { myObj.val += 2; };
	   *
	   *     expect(addTwo).to.increase(myObj, 'val').by(3, 'nooo why fail??');
	   *     expect(addTwo, 'nooo why fail??').to.increase(myObj, 'val').by(3);
	   *
	   * @name by
	   * @param {Number} delta
	   * @param {String} msg _optional_
	   * @namespace BDD
	   * @api public
	   */

	  function assertDelta(delta, msg) {
	    if (msg) flag(this, 'message', msg);

	    var msgObj = flag(this, 'deltaMsgObj');
	    var initial = flag(this, 'initialDeltaValue');
	    var final = flag(this, 'finalDeltaValue');
	    var behavior = flag(this, 'deltaBehavior');
	    var realDelta = flag(this, 'realDelta');

	    var expression;
	    if (behavior === 'change') {
	      expression = Math.abs(final - initial) === Math.abs(delta);
	    } else {
	      expression = realDelta === Math.abs(delta);
	    }

	    this.assert(
	      expression
	      , 'expected ' + msgObj + ' to ' + behavior + ' by ' + delta
	      , 'expected ' + msgObj + ' to not ' + behavior + ' by ' + delta
	    );
	  }

	  Assertion.addMethod('by', assertDelta);

	  /**
	   * ### .extensible
	   *
	   * Asserts that the target is extensible, which means that new properties can
	   * be added to it. Primitives are never extensible.
	   *
	   *     expect({a: 1}).to.be.extensible;
	   *
	   * Add `.not` earlier in the chain to negate `.extensible`.
	   *
	   *     var nonExtensibleObject = Object.preventExtensions({})
	   *       , sealedObject = Object.seal({})
	   *       , frozenObject = Object.freeze({});
	   *
	   *     expect(nonExtensibleObject).to.not.be.extensible;
	   *     expect(sealedObject).to.not.be.extensible;
	   *     expect(frozenObject).to.not.be.extensible;
	   *     expect(1).to.not.be.extensible;
	   *
	   * A custom error message can be given as the second argument to `expect`.
	   *
	   *     expect(1, 'nooo why fail??').to.be.extensible;
	   *
	   * @name extensible
	   * @namespace BDD
	   * @api public
	   */

	  Assertion.addProperty('extensible', function() {
	    var obj = flag(this, 'object');

	    // In ES5, if the argument to this method is a primitive, then it will cause a TypeError.
	    // In ES6, a non-object argument will be treated as if it was a non-extensible ordinary object, simply return false.
	    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/isExtensible
	    // The following provides ES6 behavior for ES5 environments.

	    var isExtensible = obj === Object(obj) && Object.isExtensible(obj);

	    this.assert(
	      isExtensible
	      , 'expected #{this} to be extensible'
	      , 'expected #{this} to not be extensible'
	    );
	  });

	  /**
	   * ### .sealed
	   *
	   * Asserts that the target is sealed, which means that new properties can't be
	   * added to it, and its existing properties can't be reconfigured or deleted.
	   * However, it's possible that its existing properties can still be reassigned
	   * to different values. Primitives are always sealed.
	   *
	   *     var sealedObject = Object.seal({});
	   *     var frozenObject = Object.freeze({});
	   *
	   *     expect(sealedObject).to.be.sealed;
	   *     expect(frozenObject).to.be.sealed;
	   *     expect(1).to.be.sealed;
	   *
	   * Add `.not` earlier in the chain to negate `.sealed`.
	   *
	   *     expect({a: 1}).to.not.be.sealed;
	   *
	   * A custom error message can be given as the second argument to `expect`.
	   *
	   *     expect({a: 1}, 'nooo why fail??').to.be.sealed;
	   *
	   * @name sealed
	   * @namespace BDD
	   * @api public
	   */

	  Assertion.addProperty('sealed', function() {
	    var obj = flag(this, 'object');

	    // In ES5, if the argument to this method is a primitive, then it will cause a TypeError.
	    // In ES6, a non-object argument will be treated as if it was a sealed ordinary object, simply return true.
	    // See https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/isSealed
	    // The following provides ES6 behavior for ES5 environments.

	    var isSealed = obj === Object(obj) ? Object.isSealed(obj) : true;

	    this.assert(
	      isSealed
	      , 'expected #{this} to be sealed'
	      , 'expected #{this} to not be sealed'
	    );
	  });

	  /**
	   * ### .frozen
	   *
	   * Asserts that the target is frozen, which means that new properties can't be
	   * added to it, and its existing properties can't be reassigned to different
	   * values, reconfigured, or deleted. Primitives are always frozen.
	   *
	   *     var frozenObject = Object.freeze({});
	   *
	   *     expect(frozenObject).to.be.frozen;
	   *     expect(1).to.be.frozen;
	   *
	   * Add `.not` earlier in the chain to negate `.frozen`.
	   *
	   *     expect({a: 1}).to.not.be.frozen;
	   *
	   * A custom error message can be given as the second argument to `expect`.
	   *
	   *     expect({a: 1}, 'nooo why fail??').to.be.frozen;
	   *
	   * @name frozen
	   * @namespace BDD
	   * @api public
	   */

	  Assertion.addProperty('frozen', function() {
	    var obj = flag(this, 'object');

	    // In ES5, if the argument to this method is a primitive, then it will cause a TypeError.
	    // In ES6, a non-object argument will be treated as if it was a frozen ordinary object, simply return true.
	    // See https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/isFrozen
	    // The following provides ES6 behavior for ES5 environments.

	    var isFrozen = obj === Object(obj) ? Object.isFrozen(obj) : true;

	    this.assert(
	      isFrozen
	      , 'expected #{this} to be frozen'
	      , 'expected #{this} to not be frozen'
	    );
	  });

	  /**
	   * ### .finite
	   *
	   * Asserts that the target is a number, and isn't `NaN` or positive/negative
	   * `Infinity`.
	   *
	   *     expect(1).to.be.finite;
	   *
	   * Add `.not` earlier in the chain to negate `.finite`. However, it's
	   * dangerous to do so. The problem is that it creates uncertain expectations
	   * by asserting that the subject either isn't a number, or that it's `NaN`, or
	   * that it's positive `Infinity`, or that it's negative `Infinity`. It's often
	   * best to identify the exact output that's expected, and then write an
	   * assertion that only accepts that exact output.
	   *
	   * When the target isn't expected to be a number, it's often best to assert
	   * that it's the expected type, rather than asserting that it isn't one of
	   * many unexpected types.
	   *
	   *     expect('foo').to.be.a('string'); // Recommended
	   *     expect('foo').to.not.be.finite; // Not recommended
	   *
	   * When the target is expected to be `NaN`, it's often best to assert exactly
	   * that.
	   *
	   *     expect(NaN).to.be.NaN; // Recommended
	   *     expect(NaN).to.not.be.finite; // Not recommended
	   *
	   * When the target is expected to be positive infinity, it's often best to
	   * assert exactly that.
	   *
	   *     expect(Infinity).to.equal(Infinity); // Recommended
	   *     expect(Infinity).to.not.be.finite; // Not recommended
	   *
	   * When the target is expected to be negative infinity, it's often best to
	   * assert exactly that.
	   *
	   *     expect(-Infinity).to.equal(-Infinity); // Recommended
	   *     expect(-Infinity).to.not.be.finite; // Not recommended
	   *
	   * A custom error message can be given as the second argument to `expect`.
	   *
	   *     expect('foo', 'nooo why fail??').to.be.finite;
	   *
	   * @name finite
	   * @namespace BDD
	   * @api public
	   */

	  Assertion.addProperty('finite', function(msg) {
	    var obj = flag(this, 'object');

	    this.assert(
	        typeof obj === 'number' && isFinite(obj)
	      , 'expected #{this} to be a finite number'
	      , 'expected #{this} to not be a finite number'
	    );
	  });
	};

	/*!
	 * chai
	 * Copyright(c) 2011-2014 Jake Luer <jake@alogicalparadox.com>
	 * MIT Licensed
	 */

	var expect$1 = function (chai, util) {
	  chai.expect = function (val, message) {
	    return new chai.Assertion(val, message);
	  };

	  /**
	   * ### .fail([message])
	   * ### .fail(actual, expected, [message], [operator])
	   *
	   * Throw a failure.
	   *
	   *     expect.fail();
	   *     expect.fail("custom error message");
	   *     expect.fail(1, 2);
	   *     expect.fail(1, 2, "custom error message");
	   *     expect.fail(1, 2, "custom error message", ">");
	   *     expect.fail(1, 2, undefined, ">");
	   *
	   * @name fail
	   * @param {Mixed} actual
	   * @param {Mixed} expected
	   * @param {String} message
	   * @param {String} operator
	   * @namespace BDD
	   * @api public
	   */

	  chai.expect.fail = function (actual, expected, message, operator) {
	    if (arguments.length < 2) {
	        message = actual;
	        actual = undefined;
	    }

	    message = message || 'expect.fail()';
	    throw new chai.AssertionError(message, {
	        actual: actual
	      , expected: expected
	      , operator: operator
	    }, chai.expect.fail);
	  };
	};

	/*!
	 * chai
	 * Copyright(c) 2011-2014 Jake Luer <jake@alogicalparadox.com>
	 * MIT Licensed
	 */

	var should = function (chai, util) {
	  var Assertion = chai.Assertion;

	  function loadShould () {
	    // explicitly define this method as function as to have it's name to include as `ssfi`
	    function shouldGetter() {
	      if (this instanceof String
	          || this instanceof Number
	          || this instanceof Boolean
	          || typeof Symbol === 'function' && this instanceof Symbol
	          || typeof BigInt === 'function' && this instanceof BigInt) {
	        return new Assertion(this.valueOf(), null, shouldGetter);
	      }
	      return new Assertion(this, null, shouldGetter);
	    }
	    function shouldSetter(value) {
	      // See https://github.com/chaijs/chai/issues/86: this makes
	      // `whatever.should = someValue` actually set `someValue`, which is
	      // especially useful for `global.should = require('chai').should()`.
	      //
	      // Note that we have to use [[DefineProperty]] instead of [[Put]]
	      // since otherwise we would trigger this very setter!
	      Object.defineProperty(this, 'should', {
	        value: value,
	        enumerable: true,
	        configurable: true,
	        writable: true
	      });
	    }
	    // modify Object.prototype to have `should`
	    Object.defineProperty(Object.prototype, 'should', {
	      set: shouldSetter
	      , get: shouldGetter
	      , configurable: true
	    });

	    var should = {};

	    /**
	     * ### .fail([message])
	     * ### .fail(actual, expected, [message], [operator])
	     *
	     * Throw a failure.
	     *
	     *     should.fail();
	     *     should.fail("custom error message");
	     *     should.fail(1, 2);
	     *     should.fail(1, 2, "custom error message");
	     *     should.fail(1, 2, "custom error message", ">");
	     *     should.fail(1, 2, undefined, ">");
	     *
	     *
	     * @name fail
	     * @param {Mixed} actual
	     * @param {Mixed} expected
	     * @param {String} message
	     * @param {String} operator
	     * @namespace BDD
	     * @api public
	     */

	    should.fail = function (actual, expected, message, operator) {
	      if (arguments.length < 2) {
	          message = actual;
	          actual = undefined;
	      }

	      message = message || 'should.fail()';
	      throw new chai.AssertionError(message, {
	          actual: actual
	        , expected: expected
	        , operator: operator
	      }, should.fail);
	    };

	    /**
	     * ### .equal(actual, expected, [message])
	     *
	     * Asserts non-strict equality (`==`) of `actual` and `expected`.
	     *
	     *     should.equal(3, '3', '== coerces values to strings');
	     *
	     * @name equal
	     * @param {Mixed} actual
	     * @param {Mixed} expected
	     * @param {String} message
	     * @namespace Should
	     * @api public
	     */

	    should.equal = function (val1, val2, msg) {
	      new Assertion(val1, msg).to.equal(val2);
	    };

	    /**
	     * ### .throw(function, [constructor/string/regexp], [string/regexp], [message])
	     *
	     * Asserts that `function` will throw an error that is an instance of
	     * `constructor`, or alternately that it will throw an error with message
	     * matching `regexp`.
	     *
	     *     should.throw(fn, 'function throws a reference error');
	     *     should.throw(fn, /function throws a reference error/);
	     *     should.throw(fn, ReferenceError);
	     *     should.throw(fn, ReferenceError, 'function throws a reference error');
	     *     should.throw(fn, ReferenceError, /function throws a reference error/);
	     *
	     * @name throw
	     * @alias Throw
	     * @param {Function} function
	     * @param {ErrorConstructor} constructor
	     * @param {RegExp} regexp
	     * @param {String} message
	     * @see https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Error#Error_types
	     * @namespace Should
	     * @api public
	     */

	    should.Throw = function (fn, errt, errs, msg) {
	      new Assertion(fn, msg).to.Throw(errt, errs);
	    };

	    /**
	     * ### .exist
	     *
	     * Asserts that the target is neither `null` nor `undefined`.
	     *
	     *     var foo = 'hi';
	     *
	     *     should.exist(foo, 'foo exists');
	     *
	     * @name exist
	     * @namespace Should
	     * @api public
	     */

	    should.exist = function (val, msg) {
	      new Assertion(val, msg).to.exist;
	    };

	    // negation
	    should.not = {};

	    /**
	     * ### .not.equal(actual, expected, [message])
	     *
	     * Asserts non-strict inequality (`!=`) of `actual` and `expected`.
	     *
	     *     should.not.equal(3, 4, 'these numbers are not equal');
	     *
	     * @name not.equal
	     * @param {Mixed} actual
	     * @param {Mixed} expected
	     * @param {String} message
	     * @namespace Should
	     * @api public
	     */

	    should.not.equal = function (val1, val2, msg) {
	      new Assertion(val1, msg).to.not.equal(val2);
	    };

	    /**
	     * ### .throw(function, [constructor/regexp], [message])
	     *
	     * Asserts that `function` will _not_ throw an error that is an instance of
	     * `constructor`, or alternately that it will not throw an error with message
	     * matching `regexp`.
	     *
	     *     should.not.throw(fn, Error, 'function does not throw');
	     *
	     * @name not.throw
	     * @alias not.Throw
	     * @param {Function} function
	     * @param {ErrorConstructor} constructor
	     * @param {RegExp} regexp
	     * @param {String} message
	     * @see https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Error#Error_types
	     * @namespace Should
	     * @api public
	     */

	    should.not.Throw = function (fn, errt, errs, msg) {
	      new Assertion(fn, msg).to.not.Throw(errt, errs);
	    };

	    /**
	     * ### .not.exist
	     *
	     * Asserts that the target is neither `null` nor `undefined`.
	     *
	     *     var bar = null;
	     *
	     *     should.not.exist(bar, 'bar does not exist');
	     *
	     * @name not.exist
	     * @namespace Should
	     * @api public
	     */

	    should.not.exist = function (val, msg) {
	      new Assertion(val, msg).to.not.exist;
	    };

	    should['throw'] = should['Throw'];
	    should.not['throw'] = should.not['Throw'];

	    return should;
	  }
	  chai.should = loadShould;
	  chai.Should = loadShould;
	};

	/*!
	 * chai
	 * Copyright(c) 2011-2014 Jake Luer <jake@alogicalparadox.com>
	 * MIT Licensed
	 */

	var assert$1 = function (chai, util) {
	  /*!
	   * Chai dependencies.
	   */

	  var Assertion = chai.Assertion
	    , flag = util.flag;

	  /*!
	   * Module export.
	   */

	  /**
	   * ### assert(expression, message)
	   *
	   * Write your own test expressions.
	   *
	   *     assert('foo' !== 'bar', 'foo is not bar');
	   *     assert(Array.isArray([]), 'empty arrays are arrays');
	   *
	   * @param {Mixed} expression to test for truthiness
	   * @param {String} message to display on error
	   * @name assert
	   * @namespace Assert
	   * @api public
	   */

	  var assert = chai.assert = function (express, errmsg) {
	    var test = new Assertion(null, null, chai.assert, true);
	    test.assert(
	        express
	      , errmsg
	      , '[ negation message unavailable ]'
	    );
	  };

	  /**
	   * ### .fail([message])
	   * ### .fail(actual, expected, [message], [operator])
	   *
	   * Throw a failure. Node.js `assert` module-compatible.
	   *
	   *     assert.fail();
	   *     assert.fail("custom error message");
	   *     assert.fail(1, 2);
	   *     assert.fail(1, 2, "custom error message");
	   *     assert.fail(1, 2, "custom error message", ">");
	   *     assert.fail(1, 2, undefined, ">");
	   *
	   * @name fail
	   * @param {Mixed} actual
	   * @param {Mixed} expected
	   * @param {String} message
	   * @param {String} operator
	   * @namespace Assert
	   * @api public
	   */

	  assert.fail = function (actual, expected, message, operator) {
	    if (arguments.length < 2) {
	        // Comply with Node's fail([message]) interface

	        message = actual;
	        actual = undefined;
	    }

	    message = message || 'assert.fail()';
	    throw new chai.AssertionError(message, {
	        actual: actual
	      , expected: expected
	      , operator: operator
	    }, assert.fail);
	  };

	  /**
	   * ### .isOk(object, [message])
	   *
	   * Asserts that `object` is truthy.
	   *
	   *     assert.isOk('everything', 'everything is ok');
	   *     assert.isOk(false, 'this will fail');
	   *
	   * @name isOk
	   * @alias ok
	   * @param {Mixed} object to test
	   * @param {String} message
	   * @namespace Assert
	   * @api public
	   */

	  assert.isOk = function (val, msg) {
	    new Assertion(val, msg, assert.isOk, true).is.ok;
	  };

	  /**
	   * ### .isNotOk(object, [message])
	   *
	   * Asserts that `object` is falsy.
	   *
	   *     assert.isNotOk('everything', 'this will fail');
	   *     assert.isNotOk(false, 'this will pass');
	   *
	   * @name isNotOk
	   * @alias notOk
	   * @param {Mixed} object to test
	   * @param {String} message
	   * @namespace Assert
	   * @api public
	   */

	  assert.isNotOk = function (val, msg) {
	    new Assertion(val, msg, assert.isNotOk, true).is.not.ok;
	  };

	  /**
	   * ### .equal(actual, expected, [message])
	   *
	   * Asserts non-strict equality (`==`) of `actual` and `expected`.
	   *
	   *     assert.equal(3, '3', '== coerces values to strings');
	   *
	   * @name equal
	   * @param {Mixed} actual
	   * @param {Mixed} expected
	   * @param {String} message
	   * @namespace Assert
	   * @api public
	   */

	  assert.equal = function (act, exp, msg) {
	    var test = new Assertion(act, msg, assert.equal, true);

	    test.assert(
	        exp == flag(test, 'object')
	      , 'expected #{this} to equal #{exp}'
	      , 'expected #{this} to not equal #{act}'
	      , exp
	      , act
	      , true
	    );
	  };

	  /**
	   * ### .notEqual(actual, expected, [message])
	   *
	   * Asserts non-strict inequality (`!=`) of `actual` and `expected`.
	   *
	   *     assert.notEqual(3, 4, 'these numbers are not equal');
	   *
	   * @name notEqual
	   * @param {Mixed} actual
	   * @param {Mixed} expected
	   * @param {String} message
	   * @namespace Assert
	   * @api public
	   */

	  assert.notEqual = function (act, exp, msg) {
	    var test = new Assertion(act, msg, assert.notEqual, true);

	    test.assert(
	        exp != flag(test, 'object')
	      , 'expected #{this} to not equal #{exp}'
	      , 'expected #{this} to equal #{act}'
	      , exp
	      , act
	      , true
	    );
	  };

	  /**
	   * ### .strictEqual(actual, expected, [message])
	   *
	   * Asserts strict equality (`===`) of `actual` and `expected`.
	   *
	   *     assert.strictEqual(true, true, 'these booleans are strictly equal');
	   *
	   * @name strictEqual
	   * @param {Mixed} actual
	   * @param {Mixed} expected
	   * @param {String} message
	   * @namespace Assert
	   * @api public
	   */

	  assert.strictEqual = function (act, exp, msg) {
	    new Assertion(act, msg, assert.strictEqual, true).to.equal(exp);
	  };

	  /**
	   * ### .notStrictEqual(actual, expected, [message])
	   *
	   * Asserts strict inequality (`!==`) of `actual` and `expected`.
	   *
	   *     assert.notStrictEqual(3, '3', 'no coercion for strict equality');
	   *
	   * @name notStrictEqual
	   * @param {Mixed} actual
	   * @param {Mixed} expected
	   * @param {String} message
	   * @namespace Assert
	   * @api public
	   */

	  assert.notStrictEqual = function (act, exp, msg) {
	    new Assertion(act, msg, assert.notStrictEqual, true).to.not.equal(exp);
	  };

	  /**
	   * ### .deepEqual(actual, expected, [message])
	   *
	   * Asserts that `actual` is deeply equal to `expected`.
	   *
	   *     assert.deepEqual({ tea: 'green' }, { tea: 'green' });
	   *
	   * @name deepEqual
	   * @param {Mixed} actual
	   * @param {Mixed} expected
	   * @param {String} message
	   * @alias deepStrictEqual
	   * @namespace Assert
	   * @api public
	   */

	  assert.deepEqual = assert.deepStrictEqual = function (act, exp, msg) {
	    new Assertion(act, msg, assert.deepEqual, true).to.eql(exp);
	  };

	  /**
	   * ### .notDeepEqual(actual, expected, [message])
	   *
	   * Assert that `actual` is not deeply equal to `expected`.
	   *
	   *     assert.notDeepEqual({ tea: 'green' }, { tea: 'jasmine' });
	   *
	   * @name notDeepEqual
	   * @param {Mixed} actual
	   * @param {Mixed} expected
	   * @param {String} message
	   * @namespace Assert
	   * @api public
	   */

	  assert.notDeepEqual = function (act, exp, msg) {
	    new Assertion(act, msg, assert.notDeepEqual, true).to.not.eql(exp);
	  };

	   /**
	   * ### .isAbove(valueToCheck, valueToBeAbove, [message])
	   *
	   * Asserts `valueToCheck` is strictly greater than (>) `valueToBeAbove`.
	   *
	   *     assert.isAbove(5, 2, '5 is strictly greater than 2');
	   *
	   * @name isAbove
	   * @param {Mixed} valueToCheck
	   * @param {Mixed} valueToBeAbove
	   * @param {String} message
	   * @namespace Assert
	   * @api public
	   */

	  assert.isAbove = function (val, abv, msg) {
	    new Assertion(val, msg, assert.isAbove, true).to.be.above(abv);
	  };

	   /**
	   * ### .isAtLeast(valueToCheck, valueToBeAtLeast, [message])
	   *
	   * Asserts `valueToCheck` is greater than or equal to (>=) `valueToBeAtLeast`.
	   *
	   *     assert.isAtLeast(5, 2, '5 is greater or equal to 2');
	   *     assert.isAtLeast(3, 3, '3 is greater or equal to 3');
	   *
	   * @name isAtLeast
	   * @param {Mixed} valueToCheck
	   * @param {Mixed} valueToBeAtLeast
	   * @param {String} message
	   * @namespace Assert
	   * @api public
	   */

	  assert.isAtLeast = function (val, atlst, msg) {
	    new Assertion(val, msg, assert.isAtLeast, true).to.be.least(atlst);
	  };

	   /**
	   * ### .isBelow(valueToCheck, valueToBeBelow, [message])
	   *
	   * Asserts `valueToCheck` is strictly less than (<) `valueToBeBelow`.
	   *
	   *     assert.isBelow(3, 6, '3 is strictly less than 6');
	   *
	   * @name isBelow
	   * @param {Mixed} valueToCheck
	   * @param {Mixed} valueToBeBelow
	   * @param {String} message
	   * @namespace Assert
	   * @api public
	   */

	  assert.isBelow = function (val, blw, msg) {
	    new Assertion(val, msg, assert.isBelow, true).to.be.below(blw);
	  };

	   /**
	   * ### .isAtMost(valueToCheck, valueToBeAtMost, [message])
	   *
	   * Asserts `valueToCheck` is less than or equal to (<=) `valueToBeAtMost`.
	   *
	   *     assert.isAtMost(3, 6, '3 is less than or equal to 6');
	   *     assert.isAtMost(4, 4, '4 is less than or equal to 4');
	   *
	   * @name isAtMost
	   * @param {Mixed} valueToCheck
	   * @param {Mixed} valueToBeAtMost
	   * @param {String} message
	   * @namespace Assert
	   * @api public
	   */

	  assert.isAtMost = function (val, atmst, msg) {
	    new Assertion(val, msg, assert.isAtMost, true).to.be.most(atmst);
	  };

	  /**
	   * ### .isTrue(value, [message])
	   *
	   * Asserts that `value` is true.
	   *
	   *     var teaServed = true;
	   *     assert.isTrue(teaServed, 'the tea has been served');
	   *
	   * @name isTrue
	   * @param {Mixed} value
	   * @param {String} message
	   * @namespace Assert
	   * @api public
	   */

	  assert.isTrue = function (val, msg) {
	    new Assertion(val, msg, assert.isTrue, true).is['true'];
	  };

	  /**
	   * ### .isNotTrue(value, [message])
	   *
	   * Asserts that `value` is not true.
	   *
	   *     var tea = 'tasty chai';
	   *     assert.isNotTrue(tea, 'great, time for tea!');
	   *
	   * @name isNotTrue
	   * @param {Mixed} value
	   * @param {String} message
	   * @namespace Assert
	   * @api public
	   */

	  assert.isNotTrue = function (val, msg) {
	    new Assertion(val, msg, assert.isNotTrue, true).to.not.equal(true);
	  };

	  /**
	   * ### .isFalse(value, [message])
	   *
	   * Asserts that `value` is false.
	   *
	   *     var teaServed = false;
	   *     assert.isFalse(teaServed, 'no tea yet? hmm...');
	   *
	   * @name isFalse
	   * @param {Mixed} value
	   * @param {String} message
	   * @namespace Assert
	   * @api public
	   */

	  assert.isFalse = function (val, msg) {
	    new Assertion(val, msg, assert.isFalse, true).is['false'];
	  };

	  /**
	   * ### .isNotFalse(value, [message])
	   *
	   * Asserts that `value` is not false.
	   *
	   *     var tea = 'tasty chai';
	   *     assert.isNotFalse(tea, 'great, time for tea!');
	   *
	   * @name isNotFalse
	   * @param {Mixed} value
	   * @param {String} message
	   * @namespace Assert
	   * @api public
	   */

	  assert.isNotFalse = function (val, msg) {
	    new Assertion(val, msg, assert.isNotFalse, true).to.not.equal(false);
	  };

	  /**
	   * ### .isNull(value, [message])
	   *
	   * Asserts that `value` is null.
	   *
	   *     assert.isNull(err, 'there was no error');
	   *
	   * @name isNull
	   * @param {Mixed} value
	   * @param {String} message
	   * @namespace Assert
	   * @api public
	   */

	  assert.isNull = function (val, msg) {
	    new Assertion(val, msg, assert.isNull, true).to.equal(null);
	  };

	  /**
	   * ### .isNotNull(value, [message])
	   *
	   * Asserts that `value` is not null.
	   *
	   *     var tea = 'tasty chai';
	   *     assert.isNotNull(tea, 'great, time for tea!');
	   *
	   * @name isNotNull
	   * @param {Mixed} value
	   * @param {String} message
	   * @namespace Assert
	   * @api public
	   */

	  assert.isNotNull = function (val, msg) {
	    new Assertion(val, msg, assert.isNotNull, true).to.not.equal(null);
	  };

	  /**
	   * ### .isNaN
	   *
	   * Asserts that value is NaN.
	   *
	   *     assert.isNaN(NaN, 'NaN is NaN');
	   *
	   * @name isNaN
	   * @param {Mixed} value
	   * @param {String} message
	   * @namespace Assert
	   * @api public
	   */

	  assert.isNaN = function (val, msg) {
	    new Assertion(val, msg, assert.isNaN, true).to.be.NaN;
	  };

	  /**
	   * ### .isNotNaN
	   *
	   * Asserts that value is not NaN.
	   *
	   *     assert.isNotNaN(4, '4 is not NaN');
	   *
	   * @name isNotNaN
	   * @param {Mixed} value
	   * @param {String} message
	   * @namespace Assert
	   * @api public
	   */
	  assert.isNotNaN = function (val, msg) {
	    new Assertion(val, msg, assert.isNotNaN, true).not.to.be.NaN;
	  };

	  /**
	   * ### .exists
	   *
	   * Asserts that the target is neither `null` nor `undefined`.
	   *
	   *     var foo = 'hi';
	   *
	   *     assert.exists(foo, 'foo is neither `null` nor `undefined`');
	   *
	   * @name exists
	   * @param {Mixed} value
	   * @param {String} message
	   * @namespace Assert
	   * @api public
	   */

	  assert.exists = function (val, msg) {
	    new Assertion(val, msg, assert.exists, true).to.exist;
	  };

	  /**
	   * ### .notExists
	   *
	   * Asserts that the target is either `null` or `undefined`.
	   *
	   *     var bar = null
	   *       , baz;
	   *
	   *     assert.notExists(bar);
	   *     assert.notExists(baz, 'baz is either null or undefined');
	   *
	   * @name notExists
	   * @param {Mixed} value
	   * @param {String} message
	   * @namespace Assert
	   * @api public
	   */

	  assert.notExists = function (val, msg) {
	    new Assertion(val, msg, assert.notExists, true).to.not.exist;
	  };

	  /**
	   * ### .isUndefined(value, [message])
	   *
	   * Asserts that `value` is `undefined`.
	   *
	   *     var tea;
	   *     assert.isUndefined(tea, 'no tea defined');
	   *
	   * @name isUndefined
	   * @param {Mixed} value
	   * @param {String} message
	   * @namespace Assert
	   * @api public
	   */

	  assert.isUndefined = function (val, msg) {
	    new Assertion(val, msg, assert.isUndefined, true).to.equal(undefined);
	  };

	  /**
	   * ### .isDefined(value, [message])
	   *
	   * Asserts that `value` is not `undefined`.
	   *
	   *     var tea = 'cup of chai';
	   *     assert.isDefined(tea, 'tea has been defined');
	   *
	   * @name isDefined
	   * @param {Mixed} value
	   * @param {String} message
	   * @namespace Assert
	   * @api public
	   */

	  assert.isDefined = function (val, msg) {
	    new Assertion(val, msg, assert.isDefined, true).to.not.equal(undefined);
	  };

	  /**
	   * ### .isFunction(value, [message])
	   *
	   * Asserts that `value` is a function.
	   *
	   *     function serveTea() { return 'cup of tea'; };
	   *     assert.isFunction(serveTea, 'great, we can have tea now');
	   *
	   * @name isFunction
	   * @param {Mixed} value
	   * @param {String} message
	   * @namespace Assert
	   * @api public
	   */

	  assert.isFunction = function (val, msg) {
	    new Assertion(val, msg, assert.isFunction, true).to.be.a('function');
	  };

	  /**
	   * ### .isNotFunction(value, [message])
	   *
	   * Asserts that `value` is _not_ a function.
	   *
	   *     var serveTea = [ 'heat', 'pour', 'sip' ];
	   *     assert.isNotFunction(serveTea, 'great, we have listed the steps');
	   *
	   * @name isNotFunction
	   * @param {Mixed} value
	   * @param {String} message
	   * @namespace Assert
	   * @api public
	   */

	  assert.isNotFunction = function (val, msg) {
	    new Assertion(val, msg, assert.isNotFunction, true).to.not.be.a('function');
	  };

	  /**
	   * ### .isObject(value, [message])
	   *
	   * Asserts that `value` is an object of type 'Object' (as revealed by `Object.prototype.toString`).
	   * _The assertion does not match subclassed objects._
	   *
	   *     var selection = { name: 'Chai', serve: 'with spices' };
	   *     assert.isObject(selection, 'tea selection is an object');
	   *
	   * @name isObject
	   * @param {Mixed} value
	   * @param {String} message
	   * @namespace Assert
	   * @api public
	   */

	  assert.isObject = function (val, msg) {
	    new Assertion(val, msg, assert.isObject, true).to.be.a('object');
	  };

	  /**
	   * ### .isNotObject(value, [message])
	   *
	   * Asserts that `value` is _not_ an object of type 'Object' (as revealed by `Object.prototype.toString`).
	   *
	   *     var selection = 'chai'
	   *     assert.isNotObject(selection, 'tea selection is not an object');
	   *     assert.isNotObject(null, 'null is not an object');
	   *
	   * @name isNotObject
	   * @param {Mixed} value
	   * @param {String} message
	   * @namespace Assert
	   * @api public
	   */

	  assert.isNotObject = function (val, msg) {
	    new Assertion(val, msg, assert.isNotObject, true).to.not.be.a('object');
	  };

	  /**
	   * ### .isArray(value, [message])
	   *
	   * Asserts that `value` is an array.
	   *
	   *     var menu = [ 'green', 'chai', 'oolong' ];
	   *     assert.isArray(menu, 'what kind of tea do we want?');
	   *
	   * @name isArray
	   * @param {Mixed} value
	   * @param {String} message
	   * @namespace Assert
	   * @api public
	   */

	  assert.isArray = function (val, msg) {
	    new Assertion(val, msg, assert.isArray, true).to.be.an('array');
	  };

	  /**
	   * ### .isNotArray(value, [message])
	   *
	   * Asserts that `value` is _not_ an array.
	   *
	   *     var menu = 'green|chai|oolong';
	   *     assert.isNotArray(menu, 'what kind of tea do we want?');
	   *
	   * @name isNotArray
	   * @param {Mixed} value
	   * @param {String} message
	   * @namespace Assert
	   * @api public
	   */

	  assert.isNotArray = function (val, msg) {
	    new Assertion(val, msg, assert.isNotArray, true).to.not.be.an('array');
	  };

	  /**
	   * ### .isString(value, [message])
	   *
	   * Asserts that `value` is a string.
	   *
	   *     var teaOrder = 'chai';
	   *     assert.isString(teaOrder, 'order placed');
	   *
	   * @name isString
	   * @param {Mixed} value
	   * @param {String} message
	   * @namespace Assert
	   * @api public
	   */

	  assert.isString = function (val, msg) {
	    new Assertion(val, msg, assert.isString, true).to.be.a('string');
	  };

	  /**
	   * ### .isNotString(value, [message])
	   *
	   * Asserts that `value` is _not_ a string.
	   *
	   *     var teaOrder = 4;
	   *     assert.isNotString(teaOrder, 'order placed');
	   *
	   * @name isNotString
	   * @param {Mixed} value
	   * @param {String} message
	   * @namespace Assert
	   * @api public
	   */

	  assert.isNotString = function (val, msg) {
	    new Assertion(val, msg, assert.isNotString, true).to.not.be.a('string');
	  };

	  /**
	   * ### .isNumber(value, [message])
	   *
	   * Asserts that `value` is a number.
	   *
	   *     var cups = 2;
	   *     assert.isNumber(cups, 'how many cups');
	   *
	   * @name isNumber
	   * @param {Number} value
	   * @param {String} message
	   * @namespace Assert
	   * @api public
	   */

	  assert.isNumber = function (val, msg) {
	    new Assertion(val, msg, assert.isNumber, true).to.be.a('number');
	  };

	  /**
	   * ### .isNotNumber(value, [message])
	   *
	   * Asserts that `value` is _not_ a number.
	   *
	   *     var cups = '2 cups please';
	   *     assert.isNotNumber(cups, 'how many cups');
	   *
	   * @name isNotNumber
	   * @param {Mixed} value
	   * @param {String} message
	   * @namespace Assert
	   * @api public
	   */

	  assert.isNotNumber = function (val, msg) {
	    new Assertion(val, msg, assert.isNotNumber, true).to.not.be.a('number');
	  };

	   /**
	   * ### .isFinite(value, [message])
	   *
	   * Asserts that `value` is a finite number. Unlike `.isNumber`, this will fail for `NaN` and `Infinity`.
	   *
	   *     var cups = 2;
	   *     assert.isFinite(cups, 'how many cups');
	   *
	   *     assert.isFinite(NaN); // throws
	   *
	   * @name isFinite
	   * @param {Number} value
	   * @param {String} message
	   * @namespace Assert
	   * @api public
	   */

	  assert.isFinite = function (val, msg) {
	    new Assertion(val, msg, assert.isFinite, true).to.be.finite;
	  };

	  /**
	   * ### .isBoolean(value, [message])
	   *
	   * Asserts that `value` is a boolean.
	   *
	   *     var teaReady = true
	   *       , teaServed = false;
	   *
	   *     assert.isBoolean(teaReady, 'is the tea ready');
	   *     assert.isBoolean(teaServed, 'has tea been served');
	   *
	   * @name isBoolean
	   * @param {Mixed} value
	   * @param {String} message
	   * @namespace Assert
	   * @api public
	   */

	  assert.isBoolean = function (val, msg) {
	    new Assertion(val, msg, assert.isBoolean, true).to.be.a('boolean');
	  };

	  /**
	   * ### .isNotBoolean(value, [message])
	   *
	   * Asserts that `value` is _not_ a boolean.
	   *
	   *     var teaReady = 'yep'
	   *       , teaServed = 'nope';
	   *
	   *     assert.isNotBoolean(teaReady, 'is the tea ready');
	   *     assert.isNotBoolean(teaServed, 'has tea been served');
	   *
	   * @name isNotBoolean
	   * @param {Mixed} value
	   * @param {String} message
	   * @namespace Assert
	   * @api public
	   */

	  assert.isNotBoolean = function (val, msg) {
	    new Assertion(val, msg, assert.isNotBoolean, true).to.not.be.a('boolean');
	  };

	  /**
	   * ### .typeOf(value, name, [message])
	   *
	   * Asserts that `value`'s type is `name`, as determined by
	   * `Object.prototype.toString`.
	   *
	   *     assert.typeOf({ tea: 'chai' }, 'object', 'we have an object');
	   *     assert.typeOf(['chai', 'jasmine'], 'array', 'we have an array');
	   *     assert.typeOf('tea', 'string', 'we have a string');
	   *     assert.typeOf(/tea/, 'regexp', 'we have a regular expression');
	   *     assert.typeOf(null, 'null', 'we have a null');
	   *     assert.typeOf(undefined, 'undefined', 'we have an undefined');
	   *
	   * @name typeOf
	   * @param {Mixed} value
	   * @param {String} name
	   * @param {String} message
	   * @namespace Assert
	   * @api public
	   */

	  assert.typeOf = function (val, type, msg) {
	    new Assertion(val, msg, assert.typeOf, true).to.be.a(type);
	  };

	  /**
	   * ### .notTypeOf(value, name, [message])
	   *
	   * Asserts that `value`'s type is _not_ `name`, as determined by
	   * `Object.prototype.toString`.
	   *
	   *     assert.notTypeOf('tea', 'number', 'strings are not numbers');
	   *
	   * @name notTypeOf
	   * @param {Mixed} value
	   * @param {String} typeof name
	   * @param {String} message
	   * @namespace Assert
	   * @api public
	   */

	  assert.notTypeOf = function (val, type, msg) {
	    new Assertion(val, msg, assert.notTypeOf, true).to.not.be.a(type);
	  };

	  /**
	   * ### .instanceOf(object, constructor, [message])
	   *
	   * Asserts that `value` is an instance of `constructor`.
	   *
	   *     var Tea = function (name) { this.name = name; }
	   *       , chai = new Tea('chai');
	   *
	   *     assert.instanceOf(chai, Tea, 'chai is an instance of tea');
	   *
	   * @name instanceOf
	   * @param {Object} object
	   * @param {Constructor} constructor
	   * @param {String} message
	   * @namespace Assert
	   * @api public
	   */

	  assert.instanceOf = function (val, type, msg) {
	    new Assertion(val, msg, assert.instanceOf, true).to.be.instanceOf(type);
	  };

	  /**
	   * ### .notInstanceOf(object, constructor, [message])
	   *
	   * Asserts `value` is not an instance of `constructor`.
	   *
	   *     var Tea = function (name) { this.name = name; }
	   *       , chai = new String('chai');
	   *
	   *     assert.notInstanceOf(chai, Tea, 'chai is not an instance of tea');
	   *
	   * @name notInstanceOf
	   * @param {Object} object
	   * @param {Constructor} constructor
	   * @param {String} message
	   * @namespace Assert
	   * @api public
	   */

	  assert.notInstanceOf = function (val, type, msg) {
	    new Assertion(val, msg, assert.notInstanceOf, true)
	      .to.not.be.instanceOf(type);
	  };

	  /**
	   * ### .include(haystack, needle, [message])
	   *
	   * Asserts that `haystack` includes `needle`. Can be used to assert the
	   * inclusion of a value in an array, a substring in a string, or a subset of
	   * properties in an object.
	   *
	   *     assert.include([1,2,3], 2, 'array contains value');
	   *     assert.include('foobar', 'foo', 'string contains substring');
	   *     assert.include({ foo: 'bar', hello: 'universe' }, { foo: 'bar' }, 'object contains property');
	   *
	   * Strict equality (===) is used. When asserting the inclusion of a value in
	   * an array, the array is searched for an element that's strictly equal to the
	   * given value. When asserting a subset of properties in an object, the object
	   * is searched for the given property keys, checking that each one is present
	   * and strictly equal to the given property value. For instance:
	   *
	   *     var obj1 = {a: 1}
	   *       , obj2 = {b: 2};
	   *     assert.include([obj1, obj2], obj1);
	   *     assert.include({foo: obj1, bar: obj2}, {foo: obj1});
	   *     assert.include({foo: obj1, bar: obj2}, {foo: obj1, bar: obj2});
	   *
	   * @name include
	   * @param {Array|String} haystack
	   * @param {Mixed} needle
	   * @param {String} message
	   * @namespace Assert
	   * @api public
	   */

	  assert.include = function (exp, inc, msg) {
	    new Assertion(exp, msg, assert.include, true).include(inc);
	  };

	  /**
	   * ### .notInclude(haystack, needle, [message])
	   *
	   * Asserts that `haystack` does not include `needle`. Can be used to assert
	   * the absence of a value in an array, a substring in a string, or a subset of
	   * properties in an object.
	   *
	   *     assert.notInclude([1,2,3], 4, "array doesn't contain value");
	   *     assert.notInclude('foobar', 'baz', "string doesn't contain substring");
	   *     assert.notInclude({ foo: 'bar', hello: 'universe' }, { foo: 'baz' }, 'object doesn't contain property');
	   *
	   * Strict equality (===) is used. When asserting the absence of a value in an
	   * array, the array is searched to confirm the absence of an element that's
	   * strictly equal to the given value. When asserting a subset of properties in
	   * an object, the object is searched to confirm that at least one of the given
	   * property keys is either not present or not strictly equal to the given
	   * property value. For instance:
	   *
	   *     var obj1 = {a: 1}
	   *       , obj2 = {b: 2};
	   *     assert.notInclude([obj1, obj2], {a: 1});
	   *     assert.notInclude({foo: obj1, bar: obj2}, {foo: {a: 1}});
	   *     assert.notInclude({foo: obj1, bar: obj2}, {foo: obj1, bar: {b: 2}});
	   *
	   * @name notInclude
	   * @param {Array|String} haystack
	   * @param {Mixed} needle
	   * @param {String} message
	   * @namespace Assert
	   * @api public
	   */

	  assert.notInclude = function (exp, inc, msg) {
	    new Assertion(exp, msg, assert.notInclude, true).not.include(inc);
	  };

	  /**
	   * ### .deepInclude(haystack, needle, [message])
	   *
	   * Asserts that `haystack` includes `needle`. Can be used to assert the
	   * inclusion of a value in an array or a subset of properties in an object.
	   * Deep equality is used.
	   *
	   *     var obj1 = {a: 1}
	   *       , obj2 = {b: 2};
	   *     assert.deepInclude([obj1, obj2], {a: 1});
	   *     assert.deepInclude({foo: obj1, bar: obj2}, {foo: {a: 1}});
	   *     assert.deepInclude({foo: obj1, bar: obj2}, {foo: {a: 1}, bar: {b: 2}});
	   *
	   * @name deepInclude
	   * @param {Array|String} haystack
	   * @param {Mixed} needle
	   * @param {String} message
	   * @namespace Assert
	   * @api public
	   */

	  assert.deepInclude = function (exp, inc, msg) {
	    new Assertion(exp, msg, assert.deepInclude, true).deep.include(inc);
	  };

	  /**
	   * ### .notDeepInclude(haystack, needle, [message])
	   *
	   * Asserts that `haystack` does not include `needle`. Can be used to assert
	   * the absence of a value in an array or a subset of properties in an object.
	   * Deep equality is used.
	   *
	   *     var obj1 = {a: 1}
	   *       , obj2 = {b: 2};
	   *     assert.notDeepInclude([obj1, obj2], {a: 9});
	   *     assert.notDeepInclude({foo: obj1, bar: obj2}, {foo: {a: 9}});
	   *     assert.notDeepInclude({foo: obj1, bar: obj2}, {foo: {a: 1}, bar: {b: 9}});
	   *
	   * @name notDeepInclude
	   * @param {Array|String} haystack
	   * @param {Mixed} needle
	   * @param {String} message
	   * @namespace Assert
	   * @api public
	   */

	  assert.notDeepInclude = function (exp, inc, msg) {
	    new Assertion(exp, msg, assert.notDeepInclude, true).not.deep.include(inc);
	  };

	  /**
	   * ### .nestedInclude(haystack, needle, [message])
	   *
	   * Asserts that 'haystack' includes 'needle'.
	   * Can be used to assert the inclusion of a subset of properties in an
	   * object.
	   * Enables the use of dot- and bracket-notation for referencing nested
	   * properties.
	   * '[]' and '.' in property names can be escaped using double backslashes.
	   *
	   *     assert.nestedInclude({'.a': {'b': 'x'}}, {'\\.a.[b]': 'x'});
	   *     assert.nestedInclude({'a': {'[b]': 'x'}}, {'a.\\[b\\]': 'x'});
	   *
	   * @name nestedInclude
	   * @param {Object} haystack
	   * @param {Object} needle
	   * @param {String} message
	   * @namespace Assert
	   * @api public
	   */

	  assert.nestedInclude = function (exp, inc, msg) {
	    new Assertion(exp, msg, assert.nestedInclude, true).nested.include(inc);
	  };

	  /**
	   * ### .notNestedInclude(haystack, needle, [message])
	   *
	   * Asserts that 'haystack' does not include 'needle'.
	   * Can be used to assert the absence of a subset of properties in an
	   * object.
	   * Enables the use of dot- and bracket-notation for referencing nested
	   * properties.
	   * '[]' and '.' in property names can be escaped using double backslashes.
	   *
	   *     assert.notNestedInclude({'.a': {'b': 'x'}}, {'\\.a.b': 'y'});
	   *     assert.notNestedInclude({'a': {'[b]': 'x'}}, {'a.\\[b\\]': 'y'});
	   *
	   * @name notNestedInclude
	   * @param {Object} haystack
	   * @param {Object} needle
	   * @param {String} message
	   * @namespace Assert
	   * @api public
	   */

	  assert.notNestedInclude = function (exp, inc, msg) {
	    new Assertion(exp, msg, assert.notNestedInclude, true)
	      .not.nested.include(inc);
	  };

	  /**
	   * ### .deepNestedInclude(haystack, needle, [message])
	   *
	   * Asserts that 'haystack' includes 'needle'.
	   * Can be used to assert the inclusion of a subset of properties in an
	   * object while checking for deep equality.
	   * Enables the use of dot- and bracket-notation for referencing nested
	   * properties.
	   * '[]' and '.' in property names can be escaped using double backslashes.
	   *
	   *     assert.deepNestedInclude({a: {b: [{x: 1}]}}, {'a.b[0]': {x: 1}});
	   *     assert.deepNestedInclude({'.a': {'[b]': {x: 1}}}, {'\\.a.\\[b\\]': {x: 1}});
	   *
	   * @name deepNestedInclude
	   * @param {Object} haystack
	   * @param {Object} needle
	   * @param {String} message
	   * @namespace Assert
	   * @api public
	   */

	  assert.deepNestedInclude = function(exp, inc, msg) {
	    new Assertion(exp, msg, assert.deepNestedInclude, true)
	      .deep.nested.include(inc);
	  };

	  /**
	   * ### .notDeepNestedInclude(haystack, needle, [message])
	   *
	   * Asserts that 'haystack' does not include 'needle'.
	   * Can be used to assert the absence of a subset of properties in an
	   * object while checking for deep equality.
	   * Enables the use of dot- and bracket-notation for referencing nested
	   * properties.
	   * '[]' and '.' in property names can be escaped using double backslashes.
	   *
	   *     assert.notDeepNestedInclude({a: {b: [{x: 1}]}}, {'a.b[0]': {y: 1}})
	   *     assert.notDeepNestedInclude({'.a': {'[b]': {x: 1}}}, {'\\.a.\\[b\\]': {y: 2}});
	   *
	   * @name notDeepNestedInclude
	   * @param {Object} haystack
	   * @param {Object} needle
	   * @param {String} message
	   * @namespace Assert
	   * @api public
	   */

	  assert.notDeepNestedInclude = function(exp, inc, msg) {
	    new Assertion(exp, msg, assert.notDeepNestedInclude, true)
	      .not.deep.nested.include(inc);
	  };

	  /**
	   * ### .ownInclude(haystack, needle, [message])
	   *
	   * Asserts that 'haystack' includes 'needle'.
	   * Can be used to assert the inclusion of a subset of properties in an
	   * object while ignoring inherited properties.
	   *
	   *     assert.ownInclude({ a: 1 }, { a: 1 });
	   *
	   * @name ownInclude
	   * @param {Object} haystack
	   * @param {Object} needle
	   * @param {String} message
	   * @namespace Assert
	   * @api public
	   */

	  assert.ownInclude = function(exp, inc, msg) {
	    new Assertion(exp, msg, assert.ownInclude, true).own.include(inc);
	  };

	  /**
	   * ### .notOwnInclude(haystack, needle, [message])
	   *
	   * Asserts that 'haystack' includes 'needle'.
	   * Can be used to assert the absence of a subset of properties in an
	   * object while ignoring inherited properties.
	   *
	   *     Object.prototype.b = 2;
	   *
	   *     assert.notOwnInclude({ a: 1 }, { b: 2 });
	   *
	   * @name notOwnInclude
	   * @param {Object} haystack
	   * @param {Object} needle
	   * @param {String} message
	   * @namespace Assert
	   * @api public
	   */

	  assert.notOwnInclude = function(exp, inc, msg) {
	    new Assertion(exp, msg, assert.notOwnInclude, true).not.own.include(inc);
	  };

	  /**
	   * ### .deepOwnInclude(haystack, needle, [message])
	   *
	   * Asserts that 'haystack' includes 'needle'.
	   * Can be used to assert the inclusion of a subset of properties in an
	   * object while ignoring inherited properties and checking for deep equality.
	   *
	   *      assert.deepOwnInclude({a: {b: 2}}, {a: {b: 2}});
	   *
	   * @name deepOwnInclude
	   * @param {Object} haystack
	   * @param {Object} needle
	   * @param {String} message
	   * @namespace Assert
	   * @api public
	   */

	  assert.deepOwnInclude = function(exp, inc, msg) {
	    new Assertion(exp, msg, assert.deepOwnInclude, true)
	      .deep.own.include(inc);
	  };

	   /**
	   * ### .notDeepOwnInclude(haystack, needle, [message])
	   *
	   * Asserts that 'haystack' includes 'needle'.
	   * Can be used to assert the absence of a subset of properties in an
	   * object while ignoring inherited properties and checking for deep equality.
	   *
	   *      assert.notDeepOwnInclude({a: {b: 2}}, {a: {c: 3}});
	   *
	   * @name notDeepOwnInclude
	   * @param {Object} haystack
	   * @param {Object} needle
	   * @param {String} message
	   * @namespace Assert
	   * @api public
	   */

	  assert.notDeepOwnInclude = function(exp, inc, msg) {
	    new Assertion(exp, msg, assert.notDeepOwnInclude, true)
	      .not.deep.own.include(inc);
	  };

	  /**
	   * ### .match(value, regexp, [message])
	   *
	   * Asserts that `value` matches the regular expression `regexp`.
	   *
	   *     assert.match('foobar', /^foo/, 'regexp matches');
	   *
	   * @name match
	   * @param {Mixed} value
	   * @param {RegExp} regexp
	   * @param {String} message
	   * @namespace Assert
	   * @api public
	   */

	  assert.match = function (exp, re, msg) {
	    new Assertion(exp, msg, assert.match, true).to.match(re);
	  };

	  /**
	   * ### .notMatch(value, regexp, [message])
	   *
	   * Asserts that `value` does not match the regular expression `regexp`.
	   *
	   *     assert.notMatch('foobar', /^foo/, 'regexp does not match');
	   *
	   * @name notMatch
	   * @param {Mixed} value
	   * @param {RegExp} regexp
	   * @param {String} message
	   * @namespace Assert
	   * @api public
	   */

	  assert.notMatch = function (exp, re, msg) {
	    new Assertion(exp, msg, assert.notMatch, true).to.not.match(re);
	  };

	  /**
	   * ### .property(object, property, [message])
	   *
	   * Asserts that `object` has a direct or inherited property named by
	   * `property`.
	   *
	   *     assert.property({ tea: { green: 'matcha' }}, 'tea');
	   *     assert.property({ tea: { green: 'matcha' }}, 'toString');
	   *
	   * @name property
	   * @param {Object} object
	   * @param {String} property
	   * @param {String} message
	   * @namespace Assert
	   * @api public
	   */

	  assert.property = function (obj, prop, msg) {
	    new Assertion(obj, msg, assert.property, true).to.have.property(prop);
	  };

	  /**
	   * ### .notProperty(object, property, [message])
	   *
	   * Asserts that `object` does _not_ have a direct or inherited property named
	   * by `property`.
	   *
	   *     assert.notProperty({ tea: { green: 'matcha' }}, 'coffee');
	   *
	   * @name notProperty
	   * @param {Object} object
	   * @param {String} property
	   * @param {String} message
	   * @namespace Assert
	   * @api public
	   */

	  assert.notProperty = function (obj, prop, msg) {
	    new Assertion(obj, msg, assert.notProperty, true)
	      .to.not.have.property(prop);
	  };

	  /**
	   * ### .propertyVal(object, property, value, [message])
	   *
	   * Asserts that `object` has a direct or inherited property named by
	   * `property` with a value given by `value`. Uses a strict equality check
	   * (===).
	   *
	   *     assert.propertyVal({ tea: 'is good' }, 'tea', 'is good');
	   *
	   * @name propertyVal
	   * @param {Object} object
	   * @param {String} property
	   * @param {Mixed} value
	   * @param {String} message
	   * @namespace Assert
	   * @api public
	   */

	  assert.propertyVal = function (obj, prop, val, msg) {
	    new Assertion(obj, msg, assert.propertyVal, true)
	      .to.have.property(prop, val);
	  };

	  /**
	   * ### .notPropertyVal(object, property, value, [message])
	   *
	   * Asserts that `object` does _not_ have a direct or inherited property named
	   * by `property` with value given by `value`. Uses a strict equality check
	   * (===).
	   *
	   *     assert.notPropertyVal({ tea: 'is good' }, 'tea', 'is bad');
	   *     assert.notPropertyVal({ tea: 'is good' }, 'coffee', 'is good');
	   *
	   * @name notPropertyVal
	   * @param {Object} object
	   * @param {String} property
	   * @param {Mixed} value
	   * @param {String} message
	   * @namespace Assert
	   * @api public
	   */

	  assert.notPropertyVal = function (obj, prop, val, msg) {
	    new Assertion(obj, msg, assert.notPropertyVal, true)
	      .to.not.have.property(prop, val);
	  };

	  /**
	   * ### .deepPropertyVal(object, property, value, [message])
	   *
	   * Asserts that `object` has a direct or inherited property named by
	   * `property` with a value given by `value`. Uses a deep equality check.
	   *
	   *     assert.deepPropertyVal({ tea: { green: 'matcha' } }, 'tea', { green: 'matcha' });
	   *
	   * @name deepPropertyVal
	   * @param {Object} object
	   * @param {String} property
	   * @param {Mixed} value
	   * @param {String} message
	   * @namespace Assert
	   * @api public
	   */

	  assert.deepPropertyVal = function (obj, prop, val, msg) {
	    new Assertion(obj, msg, assert.deepPropertyVal, true)
	      .to.have.deep.property(prop, val);
	  };

	  /**
	   * ### .notDeepPropertyVal(object, property, value, [message])
	   *
	   * Asserts that `object` does _not_ have a direct or inherited property named
	   * by `property` with value given by `value`. Uses a deep equality check.
	   *
	   *     assert.notDeepPropertyVal({ tea: { green: 'matcha' } }, 'tea', { black: 'matcha' });
	   *     assert.notDeepPropertyVal({ tea: { green: 'matcha' } }, 'tea', { green: 'oolong' });
	   *     assert.notDeepPropertyVal({ tea: { green: 'matcha' } }, 'coffee', { green: 'matcha' });
	   *
	   * @name notDeepPropertyVal
	   * @param {Object} object
	   * @param {String} property
	   * @param {Mixed} value
	   * @param {String} message
	   * @namespace Assert
	   * @api public
	   */

	  assert.notDeepPropertyVal = function (obj, prop, val, msg) {
	    new Assertion(obj, msg, assert.notDeepPropertyVal, true)
	      .to.not.have.deep.property(prop, val);
	  };

	  /**
	   * ### .ownProperty(object, property, [message])
	   *
	   * Asserts that `object` has a direct property named by `property`. Inherited
	   * properties aren't checked.
	   *
	   *     assert.ownProperty({ tea: { green: 'matcha' }}, 'tea');
	   *
	   * @name ownProperty
	   * @param {Object} object
	   * @param {String} property
	   * @param {String} message
	   * @api public
	   */

	  assert.ownProperty = function (obj, prop, msg) {
	    new Assertion(obj, msg, assert.ownProperty, true)
	      .to.have.own.property(prop);
	  };

	  /**
	   * ### .notOwnProperty(object, property, [message])
	   *
	   * Asserts that `object` does _not_ have a direct property named by
	   * `property`. Inherited properties aren't checked.
	   *
	   *     assert.notOwnProperty({ tea: { green: 'matcha' }}, 'coffee');
	   *     assert.notOwnProperty({}, 'toString');
	   *
	   * @name notOwnProperty
	   * @param {Object} object
	   * @param {String} property
	   * @param {String} message
	   * @api public
	   */

	  assert.notOwnProperty = function (obj, prop, msg) {
	    new Assertion(obj, msg, assert.notOwnProperty, true)
	      .to.not.have.own.property(prop);
	  };

	  /**
	   * ### .ownPropertyVal(object, property, value, [message])
	   *
	   * Asserts that `object` has a direct property named by `property` and a value
	   * equal to the provided `value`. Uses a strict equality check (===).
	   * Inherited properties aren't checked.
	   *
	   *     assert.ownPropertyVal({ coffee: 'is good'}, 'coffee', 'is good');
	   *
	   * @name ownPropertyVal
	   * @param {Object} object
	   * @param {String} property
	   * @param {Mixed} value
	   * @param {String} message
	   * @api public
	   */

	  assert.ownPropertyVal = function (obj, prop, value, msg) {
	    new Assertion(obj, msg, assert.ownPropertyVal, true)
	      .to.have.own.property(prop, value);
	  };

	  /**
	   * ### .notOwnPropertyVal(object, property, value, [message])
	   *
	   * Asserts that `object` does _not_ have a direct property named by `property`
	   * with a value equal to the provided `value`. Uses a strict equality check
	   * (===). Inherited properties aren't checked.
	   *
	   *     assert.notOwnPropertyVal({ tea: 'is better'}, 'tea', 'is worse');
	   *     assert.notOwnPropertyVal({}, 'toString', Object.prototype.toString);
	   *
	   * @name notOwnPropertyVal
	   * @param {Object} object
	   * @param {String} property
	   * @param {Mixed} value
	   * @param {String} message
	   * @api public
	   */

	  assert.notOwnPropertyVal = function (obj, prop, value, msg) {
	    new Assertion(obj, msg, assert.notOwnPropertyVal, true)
	      .to.not.have.own.property(prop, value);
	  };

	  /**
	   * ### .deepOwnPropertyVal(object, property, value, [message])
	   *
	   * Asserts that `object` has a direct property named by `property` and a value
	   * equal to the provided `value`. Uses a deep equality check. Inherited
	   * properties aren't checked.
	   *
	   *     assert.deepOwnPropertyVal({ tea: { green: 'matcha' } }, 'tea', { green: 'matcha' });
	   *
	   * @name deepOwnPropertyVal
	   * @param {Object} object
	   * @param {String} property
	   * @param {Mixed} value
	   * @param {String} message
	   * @api public
	   */

	  assert.deepOwnPropertyVal = function (obj, prop, value, msg) {
	    new Assertion(obj, msg, assert.deepOwnPropertyVal, true)
	      .to.have.deep.own.property(prop, value);
	  };

	  /**
	   * ### .notDeepOwnPropertyVal(object, property, value, [message])
	   *
	   * Asserts that `object` does _not_ have a direct property named by `property`
	   * with a value equal to the provided `value`. Uses a deep equality check.
	   * Inherited properties aren't checked.
	   *
	   *     assert.notDeepOwnPropertyVal({ tea: { green: 'matcha' } }, 'tea', { black: 'matcha' });
	   *     assert.notDeepOwnPropertyVal({ tea: { green: 'matcha' } }, 'tea', { green: 'oolong' });
	   *     assert.notDeepOwnPropertyVal({ tea: { green: 'matcha' } }, 'coffee', { green: 'matcha' });
	   *     assert.notDeepOwnPropertyVal({}, 'toString', Object.prototype.toString);
	   *
	   * @name notDeepOwnPropertyVal
	   * @param {Object} object
	   * @param {String} property
	   * @param {Mixed} value
	   * @param {String} message
	   * @api public
	   */

	  assert.notDeepOwnPropertyVal = function (obj, prop, value, msg) {
	    new Assertion(obj, msg, assert.notDeepOwnPropertyVal, true)
	      .to.not.have.deep.own.property(prop, value);
	  };

	  /**
	   * ### .nestedProperty(object, property, [message])
	   *
	   * Asserts that `object` has a direct or inherited property named by
	   * `property`, which can be a string using dot- and bracket-notation for
	   * nested reference.
	   *
	   *     assert.nestedProperty({ tea: { green: 'matcha' }}, 'tea.green');
	   *
	   * @name nestedProperty
	   * @param {Object} object
	   * @param {String} property
	   * @param {String} message
	   * @namespace Assert
	   * @api public
	   */

	  assert.nestedProperty = function (obj, prop, msg) {
	    new Assertion(obj, msg, assert.nestedProperty, true)
	      .to.have.nested.property(prop);
	  };

	  /**
	   * ### .notNestedProperty(object, property, [message])
	   *
	   * Asserts that `object` does _not_ have a property named by `property`, which
	   * can be a string using dot- and bracket-notation for nested reference. The
	   * property cannot exist on the object nor anywhere in its prototype chain.
	   *
	   *     assert.notNestedProperty({ tea: { green: 'matcha' }}, 'tea.oolong');
	   *
	   * @name notNestedProperty
	   * @param {Object} object
	   * @param {String} property
	   * @param {String} message
	   * @namespace Assert
	   * @api public
	   */

	  assert.notNestedProperty = function (obj, prop, msg) {
	    new Assertion(obj, msg, assert.notNestedProperty, true)
	      .to.not.have.nested.property(prop);
	  };

	  /**
	   * ### .nestedPropertyVal(object, property, value, [message])
	   *
	   * Asserts that `object` has a property named by `property` with value given
	   * by `value`. `property` can use dot- and bracket-notation for nested
	   * reference. Uses a strict equality check (===).
	   *
	   *     assert.nestedPropertyVal({ tea: { green: 'matcha' }}, 'tea.green', 'matcha');
	   *
	   * @name nestedPropertyVal
	   * @param {Object} object
	   * @param {String} property
	   * @param {Mixed} value
	   * @param {String} message
	   * @namespace Assert
	   * @api public
	   */

	  assert.nestedPropertyVal = function (obj, prop, val, msg) {
	    new Assertion(obj, msg, assert.nestedPropertyVal, true)
	      .to.have.nested.property(prop, val);
	  };

	  /**
	   * ### .notNestedPropertyVal(object, property, value, [message])
	   *
	   * Asserts that `object` does _not_ have a property named by `property` with
	   * value given by `value`. `property` can use dot- and bracket-notation for
	   * nested reference. Uses a strict equality check (===).
	   *
	   *     assert.notNestedPropertyVal({ tea: { green: 'matcha' }}, 'tea.green', 'konacha');
	   *     assert.notNestedPropertyVal({ tea: { green: 'matcha' }}, 'coffee.green', 'matcha');
	   *
	   * @name notNestedPropertyVal
	   * @param {Object} object
	   * @param {String} property
	   * @param {Mixed} value
	   * @param {String} message
	   * @namespace Assert
	   * @api public
	   */

	  assert.notNestedPropertyVal = function (obj, prop, val, msg) {
	    new Assertion(obj, msg, assert.notNestedPropertyVal, true)
	      .to.not.have.nested.property(prop, val);
	  };

	  /**
	   * ### .deepNestedPropertyVal(object, property, value, [message])
	   *
	   * Asserts that `object` has a property named by `property` with a value given
	   * by `value`. `property` can use dot- and bracket-notation for nested
	   * reference. Uses a deep equality check.
	   *
	   *     assert.deepNestedPropertyVal({ tea: { green: { matcha: 'yum' } } }, 'tea.green', { matcha: 'yum' });
	   *
	   * @name deepNestedPropertyVal
	   * @param {Object} object
	   * @param {String} property
	   * @param {Mixed} value
	   * @param {String} message
	   * @namespace Assert
	   * @api public
	   */

	  assert.deepNestedPropertyVal = function (obj, prop, val, msg) {
	    new Assertion(obj, msg, assert.deepNestedPropertyVal, true)
	      .to.have.deep.nested.property(prop, val);
	  };

	  /**
	   * ### .notDeepNestedPropertyVal(object, property, value, [message])
	   *
	   * Asserts that `object` does _not_ have a property named by `property` with
	   * value given by `value`. `property` can use dot- and bracket-notation for
	   * nested reference. Uses a deep equality check.
	   *
	   *     assert.notDeepNestedPropertyVal({ tea: { green: { matcha: 'yum' } } }, 'tea.green', { oolong: 'yum' });
	   *     assert.notDeepNestedPropertyVal({ tea: { green: { matcha: 'yum' } } }, 'tea.green', { matcha: 'yuck' });
	   *     assert.notDeepNestedPropertyVal({ tea: { green: { matcha: 'yum' } } }, 'tea.black', { matcha: 'yum' });
	   *
	   * @name notDeepNestedPropertyVal
	   * @param {Object} object
	   * @param {String} property
	   * @param {Mixed} value
	   * @param {String} message
	   * @namespace Assert
	   * @api public
	   */

	  assert.notDeepNestedPropertyVal = function (obj, prop, val, msg) {
	    new Assertion(obj, msg, assert.notDeepNestedPropertyVal, true)
	      .to.not.have.deep.nested.property(prop, val);
	  };

	  /**
	   * ### .lengthOf(object, length, [message])
	   *
	   * Asserts that `object` has a `length` or `size` with the expected value.
	   *
	   *     assert.lengthOf([1,2,3], 3, 'array has length of 3');
	   *     assert.lengthOf('foobar', 6, 'string has length of 6');
	   *     assert.lengthOf(new Set([1,2,3]), 3, 'set has size of 3');
	   *     assert.lengthOf(new Map([['a',1],['b',2],['c',3]]), 3, 'map has size of 3');
	   *
	   * @name lengthOf
	   * @param {Mixed} object
	   * @param {Number} length
	   * @param {String} message
	   * @namespace Assert
	   * @api public
	   */

	  assert.lengthOf = function (exp, len, msg) {
	    new Assertion(exp, msg, assert.lengthOf, true).to.have.lengthOf(len);
	  };

	  /**
	   * ### .hasAnyKeys(object, [keys], [message])
	   *
	   * Asserts that `object` has at least one of the `keys` provided.
	   * You can also provide a single object instead of a `keys` array and its keys
	   * will be used as the expected set of keys.
	   *
	   *     assert.hasAnyKeys({foo: 1, bar: 2, baz: 3}, ['foo', 'iDontExist', 'baz']);
	   *     assert.hasAnyKeys({foo: 1, bar: 2, baz: 3}, {foo: 30, iDontExist: 99, baz: 1337});
	   *     assert.hasAnyKeys(new Map([[{foo: 1}, 'bar'], ['key', 'value']]), [{foo: 1}, 'key']);
	   *     assert.hasAnyKeys(new Set([{foo: 'bar'}, 'anotherKey']), [{foo: 'bar'}, 'anotherKey']);
	   *
	   * @name hasAnyKeys
	   * @param {Mixed} object
	   * @param {Array|Object} keys
	   * @param {String} message
	   * @namespace Assert
	   * @api public
	   */

	  assert.hasAnyKeys = function (obj, keys, msg) {
	    new Assertion(obj, msg, assert.hasAnyKeys, true).to.have.any.keys(keys);
	  };

	  /**
	   * ### .hasAllKeys(object, [keys], [message])
	   *
	   * Asserts that `object` has all and only all of the `keys` provided.
	   * You can also provide a single object instead of a `keys` array and its keys
	   * will be used as the expected set of keys.
	   *
	   *     assert.hasAllKeys({foo: 1, bar: 2, baz: 3}, ['foo', 'bar', 'baz']);
	   *     assert.hasAllKeys({foo: 1, bar: 2, baz: 3}, {foo: 30, bar: 99, baz: 1337]);
	   *     assert.hasAllKeys(new Map([[{foo: 1}, 'bar'], ['key', 'value']]), [{foo: 1}, 'key']);
	   *     assert.hasAllKeys(new Set([{foo: 'bar'}, 'anotherKey'], [{foo: 'bar'}, 'anotherKey']);
	   *
	   * @name hasAllKeys
	   * @param {Mixed} object
	   * @param {String[]} keys
	   * @param {String} message
	   * @namespace Assert
	   * @api public
	   */

	  assert.hasAllKeys = function (obj, keys, msg) {
	    new Assertion(obj, msg, assert.hasAllKeys, true).to.have.all.keys(keys);
	  };

	  /**
	   * ### .containsAllKeys(object, [keys], [message])
	   *
	   * Asserts that `object` has all of the `keys` provided but may have more keys not listed.
	   * You can also provide a single object instead of a `keys` array and its keys
	   * will be used as the expected set of keys.
	   *
	   *     assert.containsAllKeys({foo: 1, bar: 2, baz: 3}, ['foo', 'baz']);
	   *     assert.containsAllKeys({foo: 1, bar: 2, baz: 3}, ['foo', 'bar', 'baz']);
	   *     assert.containsAllKeys({foo: 1, bar: 2, baz: 3}, {foo: 30, baz: 1337});
	   *     assert.containsAllKeys({foo: 1, bar: 2, baz: 3}, {foo: 30, bar: 99, baz: 1337});
	   *     assert.containsAllKeys(new Map([[{foo: 1}, 'bar'], ['key', 'value']]), [{foo: 1}]);
	   *     assert.containsAllKeys(new Map([[{foo: 1}, 'bar'], ['key', 'value']]), [{foo: 1}, 'key']);
	   *     assert.containsAllKeys(new Set([{foo: 'bar'}, 'anotherKey'], [{foo: 'bar'}]);
	   *     assert.containsAllKeys(new Set([{foo: 'bar'}, 'anotherKey'], [{foo: 'bar'}, 'anotherKey']);
	   *
	   * @name containsAllKeys
	   * @param {Mixed} object
	   * @param {String[]} keys
	   * @param {String} message
	   * @namespace Assert
	   * @api public
	   */

	  assert.containsAllKeys = function (obj, keys, msg) {
	    new Assertion(obj, msg, assert.containsAllKeys, true)
	      .to.contain.all.keys(keys);
	  };

	  /**
	   * ### .doesNotHaveAnyKeys(object, [keys], [message])
	   *
	   * Asserts that `object` has none of the `keys` provided.
	   * You can also provide a single object instead of a `keys` array and its keys
	   * will be used as the expected set of keys.
	   *
	   *     assert.doesNotHaveAnyKeys({foo: 1, bar: 2, baz: 3}, ['one', 'two', 'example']);
	   *     assert.doesNotHaveAnyKeys({foo: 1, bar: 2, baz: 3}, {one: 1, two: 2, example: 'foo'});
	   *     assert.doesNotHaveAnyKeys(new Map([[{foo: 1}, 'bar'], ['key', 'value']]), [{one: 'two'}, 'example']);
	   *     assert.doesNotHaveAnyKeys(new Set([{foo: 'bar'}, 'anotherKey'], [{one: 'two'}, 'example']);
	   *
	   * @name doesNotHaveAnyKeys
	   * @param {Mixed} object
	   * @param {String[]} keys
	   * @param {String} message
	   * @namespace Assert
	   * @api public
	   */

	  assert.doesNotHaveAnyKeys = function (obj, keys, msg) {
	    new Assertion(obj, msg, assert.doesNotHaveAnyKeys, true)
	      .to.not.have.any.keys(keys);
	  };

	  /**
	   * ### .doesNotHaveAllKeys(object, [keys], [message])
	   *
	   * Asserts that `object` does not have at least one of the `keys` provided.
	   * You can also provide a single object instead of a `keys` array and its keys
	   * will be used as the expected set of keys.
	   *
	   *     assert.doesNotHaveAllKeys({foo: 1, bar: 2, baz: 3}, ['one', 'two', 'example']);
	   *     assert.doesNotHaveAllKeys({foo: 1, bar: 2, baz: 3}, {one: 1, two: 2, example: 'foo'});
	   *     assert.doesNotHaveAllKeys(new Map([[{foo: 1}, 'bar'], ['key', 'value']]), [{one: 'two'}, 'example']);
	   *     assert.doesNotHaveAllKeys(new Set([{foo: 'bar'}, 'anotherKey'], [{one: 'two'}, 'example']);
	   *
	   * @name doesNotHaveAllKeys
	   * @param {Mixed} object
	   * @param {String[]} keys
	   * @param {String} message
	   * @namespace Assert
	   * @api public
	   */

	  assert.doesNotHaveAllKeys = function (obj, keys, msg) {
	    new Assertion(obj, msg, assert.doesNotHaveAllKeys, true)
	      .to.not.have.all.keys(keys);
	  };

	  /**
	   * ### .hasAnyDeepKeys(object, [keys], [message])
	   *
	   * Asserts that `object` has at least one of the `keys` provided.
	   * Since Sets and Maps can have objects as keys you can use this assertion to perform
	   * a deep comparison.
	   * You can also provide a single object instead of a `keys` array and its keys
	   * will be used as the expected set of keys.
	   *
	   *     assert.hasAnyDeepKeys(new Map([[{one: 'one'}, 'valueOne'], [1, 2]]), {one: 'one'});
	   *     assert.hasAnyDeepKeys(new Map([[{one: 'one'}, 'valueOne'], [1, 2]]), [{one: 'one'}, {two: 'two'}]);
	   *     assert.hasAnyDeepKeys(new Map([[{one: 'one'}, 'valueOne'], [{two: 'two'}, 'valueTwo']]), [{one: 'one'}, {two: 'two'}]);
	   *     assert.hasAnyDeepKeys(new Set([{one: 'one'}, {two: 'two'}]), {one: 'one'});
	   *     assert.hasAnyDeepKeys(new Set([{one: 'one'}, {two: 'two'}]), [{one: 'one'}, {three: 'three'}]);
	   *     assert.hasAnyDeepKeys(new Set([{one: 'one'}, {two: 'two'}]), [{one: 'one'}, {two: 'two'}]);
	   *
	   * @name hasAnyDeepKeys
	   * @param {Mixed} object
	   * @param {Array|Object} keys
	   * @param {String} message
	   * @namespace Assert
	   * @api public
	   */

	  assert.hasAnyDeepKeys = function (obj, keys, msg) {
	    new Assertion(obj, msg, assert.hasAnyDeepKeys, true)
	      .to.have.any.deep.keys(keys);
	  };

	 /**
	   * ### .hasAllDeepKeys(object, [keys], [message])
	   *
	   * Asserts that `object` has all and only all of the `keys` provided.
	   * Since Sets and Maps can have objects as keys you can use this assertion to perform
	   * a deep comparison.
	   * You can also provide a single object instead of a `keys` array and its keys
	   * will be used as the expected set of keys.
	   *
	   *     assert.hasAllDeepKeys(new Map([[{one: 'one'}, 'valueOne']]), {one: 'one'});
	   *     assert.hasAllDeepKeys(new Map([[{one: 'one'}, 'valueOne'], [{two: 'two'}, 'valueTwo']]), [{one: 'one'}, {two: 'two'}]);
	   *     assert.hasAllDeepKeys(new Set([{one: 'one'}]), {one: 'one'});
	   *     assert.hasAllDeepKeys(new Set([{one: 'one'}, {two: 'two'}]), [{one: 'one'}, {two: 'two'}]);
	   *
	   * @name hasAllDeepKeys
	   * @param {Mixed} object
	   * @param {Array|Object} keys
	   * @param {String} message
	   * @namespace Assert
	   * @api public
	   */

	  assert.hasAllDeepKeys = function (obj, keys, msg) {
	    new Assertion(obj, msg, assert.hasAllDeepKeys, true)
	      .to.have.all.deep.keys(keys);
	  };

	 /**
	   * ### .containsAllDeepKeys(object, [keys], [message])
	   *
	   * Asserts that `object` contains all of the `keys` provided.
	   * Since Sets and Maps can have objects as keys you can use this assertion to perform
	   * a deep comparison.
	   * You can also provide a single object instead of a `keys` array and its keys
	   * will be used as the expected set of keys.
	   *
	   *     assert.containsAllDeepKeys(new Map([[{one: 'one'}, 'valueOne'], [1, 2]]), {one: 'one'});
	   *     assert.containsAllDeepKeys(new Map([[{one: 'one'}, 'valueOne'], [{two: 'two'}, 'valueTwo']]), [{one: 'one'}, {two: 'two'}]);
	   *     assert.containsAllDeepKeys(new Set([{one: 'one'}, {two: 'two'}]), {one: 'one'});
	   *     assert.containsAllDeepKeys(new Set([{one: 'one'}, {two: 'two'}]), [{one: 'one'}, {two: 'two'}]);
	   *
	   * @name containsAllDeepKeys
	   * @param {Mixed} object
	   * @param {Array|Object} keys
	   * @param {String} message
	   * @namespace Assert
	   * @api public
	   */

	  assert.containsAllDeepKeys = function (obj, keys, msg) {
	    new Assertion(obj, msg, assert.containsAllDeepKeys, true)
	      .to.contain.all.deep.keys(keys);
	  };

	 /**
	   * ### .doesNotHaveAnyDeepKeys(object, [keys], [message])
	   *
	   * Asserts that `object` has none of the `keys` provided.
	   * Since Sets and Maps can have objects as keys you can use this assertion to perform
	   * a deep comparison.
	   * You can also provide a single object instead of a `keys` array and its keys
	   * will be used as the expected set of keys.
	   *
	   *     assert.doesNotHaveAnyDeepKeys(new Map([[{one: 'one'}, 'valueOne'], [1, 2]]), {thisDoesNot: 'exist'});
	   *     assert.doesNotHaveAnyDeepKeys(new Map([[{one: 'one'}, 'valueOne'], [{two: 'two'}, 'valueTwo']]), [{twenty: 'twenty'}, {fifty: 'fifty'}]);
	   *     assert.doesNotHaveAnyDeepKeys(new Set([{one: 'one'}, {two: 'two'}]), {twenty: 'twenty'});
	   *     assert.doesNotHaveAnyDeepKeys(new Set([{one: 'one'}, {two: 'two'}]), [{twenty: 'twenty'}, {fifty: 'fifty'}]);
	   *
	   * @name doesNotHaveAnyDeepKeys
	   * @param {Mixed} object
	   * @param {Array|Object} keys
	   * @param {String} message
	   * @namespace Assert
	   * @api public
	   */

	  assert.doesNotHaveAnyDeepKeys = function (obj, keys, msg) {
	    new Assertion(obj, msg, assert.doesNotHaveAnyDeepKeys, true)
	      .to.not.have.any.deep.keys(keys);
	  };

	 /**
	   * ### .doesNotHaveAllDeepKeys(object, [keys], [message])
	   *
	   * Asserts that `object` does not have at least one of the `keys` provided.
	   * Since Sets and Maps can have objects as keys you can use this assertion to perform
	   * a deep comparison.
	   * You can also provide a single object instead of a `keys` array and its keys
	   * will be used as the expected set of keys.
	   *
	   *     assert.doesNotHaveAllDeepKeys(new Map([[{one: 'one'}, 'valueOne'], [1, 2]]), {thisDoesNot: 'exist'});
	   *     assert.doesNotHaveAllDeepKeys(new Map([[{one: 'one'}, 'valueOne'], [{two: 'two'}, 'valueTwo']]), [{twenty: 'twenty'}, {one: 'one'}]);
	   *     assert.doesNotHaveAllDeepKeys(new Set([{one: 'one'}, {two: 'two'}]), {twenty: 'twenty'});
	   *     assert.doesNotHaveAllDeepKeys(new Set([{one: 'one'}, {two: 'two'}]), [{one: 'one'}, {fifty: 'fifty'}]);
	   *
	   * @name doesNotHaveAllDeepKeys
	   * @param {Mixed} object
	   * @param {Array|Object} keys
	   * @param {String} message
	   * @namespace Assert
	   * @api public
	   */

	  assert.doesNotHaveAllDeepKeys = function (obj, keys, msg) {
	    new Assertion(obj, msg, assert.doesNotHaveAllDeepKeys, true)
	      .to.not.have.all.deep.keys(keys);
	  };

	 /**
	   * ### .throws(fn, [errorLike/string/regexp], [string/regexp], [message])
	   *
	   * If `errorLike` is an `Error` constructor, asserts that `fn` will throw an error that is an
	   * instance of `errorLike`.
	   * If `errorLike` is an `Error` instance, asserts that the error thrown is the same
	   * instance as `errorLike`.
	   * If `errMsgMatcher` is provided, it also asserts that the error thrown will have a
	   * message matching `errMsgMatcher`.
	   *
	   *     assert.throws(fn, 'Error thrown must have this msg');
	   *     assert.throws(fn, /Error thrown must have a msg that matches this/);
	   *     assert.throws(fn, ReferenceError);
	   *     assert.throws(fn, errorInstance);
	   *     assert.throws(fn, ReferenceError, 'Error thrown must be a ReferenceError and have this msg');
	   *     assert.throws(fn, errorInstance, 'Error thrown must be the same errorInstance and have this msg');
	   *     assert.throws(fn, ReferenceError, /Error thrown must be a ReferenceError and match this/);
	   *     assert.throws(fn, errorInstance, /Error thrown must be the same errorInstance and match this/);
	   *
	   * @name throws
	   * @alias throw
	   * @alias Throw
	   * @param {Function} fn
	   * @param {ErrorConstructor|Error} errorLike
	   * @param {RegExp|String} errMsgMatcher
	   * @param {String} message
	   * @see https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Error#Error_types
	   * @namespace Assert
	   * @api public
	   */

	  assert.throws = function (fn, errorLike, errMsgMatcher, msg) {
	    if ('string' === typeof errorLike || errorLike instanceof RegExp) {
	      errMsgMatcher = errorLike;
	      errorLike = null;
	    }

	    var assertErr = new Assertion(fn, msg, assert.throws, true)
	      .to.throw(errorLike, errMsgMatcher);
	    return flag(assertErr, 'object');
	  };

	  /**
	   * ### .doesNotThrow(fn, [errorLike/string/regexp], [string/regexp], [message])
	   *
	   * If `errorLike` is an `Error` constructor, asserts that `fn` will _not_ throw an error that is an
	   * instance of `errorLike`.
	   * If `errorLike` is an `Error` instance, asserts that the error thrown is _not_ the same
	   * instance as `errorLike`.
	   * If `errMsgMatcher` is provided, it also asserts that the error thrown will _not_ have a
	   * message matching `errMsgMatcher`.
	   *
	   *     assert.doesNotThrow(fn, 'Any Error thrown must not have this message');
	   *     assert.doesNotThrow(fn, /Any Error thrown must not match this/);
	   *     assert.doesNotThrow(fn, Error);
	   *     assert.doesNotThrow(fn, errorInstance);
	   *     assert.doesNotThrow(fn, Error, 'Error must not have this message');
	   *     assert.doesNotThrow(fn, errorInstance, 'Error must not have this message');
	   *     assert.doesNotThrow(fn, Error, /Error must not match this/);
	   *     assert.doesNotThrow(fn, errorInstance, /Error must not match this/);
	   *
	   * @name doesNotThrow
	   * @param {Function} fn
	   * @param {ErrorConstructor} errorLike
	   * @param {RegExp|String} errMsgMatcher
	   * @param {String} message
	   * @see https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Error#Error_types
	   * @namespace Assert
	   * @api public
	   */

	  assert.doesNotThrow = function (fn, errorLike, errMsgMatcher, msg) {
	    if ('string' === typeof errorLike || errorLike instanceof RegExp) {
	      errMsgMatcher = errorLike;
	      errorLike = null;
	    }

	    new Assertion(fn, msg, assert.doesNotThrow, true)
	      .to.not.throw(errorLike, errMsgMatcher);
	  };

	  /**
	   * ### .operator(val1, operator, val2, [message])
	   *
	   * Compares two values using `operator`.
	   *
	   *     assert.operator(1, '<', 2, 'everything is ok');
	   *     assert.operator(1, '>', 2, 'this will fail');
	   *
	   * @name operator
	   * @param {Mixed} val1
	   * @param {String} operator
	   * @param {Mixed} val2
	   * @param {String} message
	   * @namespace Assert
	   * @api public
	   */

	  assert.operator = function (val, operator, val2, msg) {
	    var ok;
	    switch(operator) {
	      case '==':
	        ok = val == val2;
	        break;
	      case '===':
	        ok = val === val2;
	        break;
	      case '>':
	        ok = val > val2;
	        break;
	      case '>=':
	        ok = val >= val2;
	        break;
	      case '<':
	        ok = val < val2;
	        break;
	      case '<=':
	        ok = val <= val2;
	        break;
	      case '!=':
	        ok = val != val2;
	        break;
	      case '!==':
	        ok = val !== val2;
	        break;
	      default:
	        msg = msg ? msg + ': ' : msg;
	        throw new chai.AssertionError(
	          msg + 'Invalid operator "' + operator + '"',
	          undefined,
	          assert.operator
	        );
	    }
	    var test = new Assertion(ok, msg, assert.operator, true);
	    test.assert(
	        true === flag(test, 'object')
	      , 'expected ' + util.inspect(val) + ' to be ' + operator + ' ' + util.inspect(val2)
	      , 'expected ' + util.inspect(val) + ' to not be ' + operator + ' ' + util.inspect(val2) );
	  };

	  /**
	   * ### .closeTo(actual, expected, delta, [message])
	   *
	   * Asserts that the target is equal `expected`, to within a +/- `delta` range.
	   *
	   *     assert.closeTo(1.5, 1, 0.5, 'numbers are close');
	   *
	   * @name closeTo
	   * @param {Number} actual
	   * @param {Number} expected
	   * @param {Number} delta
	   * @param {String} message
	   * @namespace Assert
	   * @api public
	   */

	  assert.closeTo = function (act, exp, delta, msg) {
	    new Assertion(act, msg, assert.closeTo, true).to.be.closeTo(exp, delta);
	  };

	  /**
	   * ### .approximately(actual, expected, delta, [message])
	   *
	   * Asserts that the target is equal `expected`, to within a +/- `delta` range.
	   *
	   *     assert.approximately(1.5, 1, 0.5, 'numbers are close');
	   *
	   * @name approximately
	   * @param {Number} actual
	   * @param {Number} expected
	   * @param {Number} delta
	   * @param {String} message
	   * @namespace Assert
	   * @api public
	   */

	  assert.approximately = function (act, exp, delta, msg) {
	    new Assertion(act, msg, assert.approximately, true)
	      .to.be.approximately(exp, delta);
	  };

	  /**
	   * ### .sameMembers(set1, set2, [message])
	   *
	   * Asserts that `set1` and `set2` have the same members in any order. Uses a
	   * strict equality check (===).
	   *
	   *     assert.sameMembers([ 1, 2, 3 ], [ 2, 1, 3 ], 'same members');
	   *
	   * @name sameMembers
	   * @param {Array} set1
	   * @param {Array} set2
	   * @param {String} message
	   * @namespace Assert
	   * @api public
	   */

	  assert.sameMembers = function (set1, set2, msg) {
	    new Assertion(set1, msg, assert.sameMembers, true)
	      .to.have.same.members(set2);
	  };

	  /**
	   * ### .notSameMembers(set1, set2, [message])
	   *
	   * Asserts that `set1` and `set2` don't have the same members in any order.
	   * Uses a strict equality check (===).
	   *
	   *     assert.notSameMembers([ 1, 2, 3 ], [ 5, 1, 3 ], 'not same members');
	   *
	   * @name notSameMembers
	   * @param {Array} set1
	   * @param {Array} set2
	   * @param {String} message
	   * @namespace Assert
	   * @api public
	   */

	  assert.notSameMembers = function (set1, set2, msg) {
	    new Assertion(set1, msg, assert.notSameMembers, true)
	      .to.not.have.same.members(set2);
	  };

	  /**
	   * ### .sameDeepMembers(set1, set2, [message])
	   *
	   * Asserts that `set1` and `set2` have the same members in any order. Uses a
	   * deep equality check.
	   *
	   *     assert.sameDeepMembers([ { a: 1 }, { b: 2 }, { c: 3 } ], [{ b: 2 }, { a: 1 }, { c: 3 }], 'same deep members');
	   *
	   * @name sameDeepMembers
	   * @param {Array} set1
	   * @param {Array} set2
	   * @param {String} message
	   * @namespace Assert
	   * @api public
	   */

	  assert.sameDeepMembers = function (set1, set2, msg) {
	    new Assertion(set1, msg, assert.sameDeepMembers, true)
	      .to.have.same.deep.members(set2);
	  };

	  /**
	   * ### .notSameDeepMembers(set1, set2, [message])
	   *
	   * Asserts that `set1` and `set2` don't have the same members in any order.
	   * Uses a deep equality check.
	   *
	   *     assert.notSameDeepMembers([ { a: 1 }, { b: 2 }, { c: 3 } ], [{ b: 2 }, { a: 1 }, { f: 5 }], 'not same deep members');
	   *
	   * @name notSameDeepMembers
	   * @param {Array} set1
	   * @param {Array} set2
	   * @param {String} message
	   * @namespace Assert
	   * @api public
	   */

	  assert.notSameDeepMembers = function (set1, set2, msg) {
	    new Assertion(set1, msg, assert.notSameDeepMembers, true)
	      .to.not.have.same.deep.members(set2);
	  };

	  /**
	   * ### .sameOrderedMembers(set1, set2, [message])
	   *
	   * Asserts that `set1` and `set2` have the same members in the same order.
	   * Uses a strict equality check (===).
	   *
	   *     assert.sameOrderedMembers([ 1, 2, 3 ], [ 1, 2, 3 ], 'same ordered members');
	   *
	   * @name sameOrderedMembers
	   * @param {Array} set1
	   * @param {Array} set2
	   * @param {String} message
	   * @namespace Assert
	   * @api public
	   */

	  assert.sameOrderedMembers = function (set1, set2, msg) {
	    new Assertion(set1, msg, assert.sameOrderedMembers, true)
	      .to.have.same.ordered.members(set2);
	  };

	  /**
	   * ### .notSameOrderedMembers(set1, set2, [message])
	   *
	   * Asserts that `set1` and `set2` don't have the same members in the same
	   * order. Uses a strict equality check (===).
	   *
	   *     assert.notSameOrderedMembers([ 1, 2, 3 ], [ 2, 1, 3 ], 'not same ordered members');
	   *
	   * @name notSameOrderedMembers
	   * @param {Array} set1
	   * @param {Array} set2
	   * @param {String} message
	   * @namespace Assert
	   * @api public
	   */

	  assert.notSameOrderedMembers = function (set1, set2, msg) {
	    new Assertion(set1, msg, assert.notSameOrderedMembers, true)
	      .to.not.have.same.ordered.members(set2);
	  };

	  /**
	   * ### .sameDeepOrderedMembers(set1, set2, [message])
	   *
	   * Asserts that `set1` and `set2` have the same members in the same order.
	   * Uses a deep equality check.
	   *
	   *     assert.sameDeepOrderedMembers([ { a: 1 }, { b: 2 }, { c: 3 } ], [ { a: 1 }, { b: 2 }, { c: 3 } ], 'same deep ordered members');
	   *
	   * @name sameDeepOrderedMembers
	   * @param {Array} set1
	   * @param {Array} set2
	   * @param {String} message
	   * @namespace Assert
	   * @api public
	   */

	  assert.sameDeepOrderedMembers = function (set1, set2, msg) {
	    new Assertion(set1, msg, assert.sameDeepOrderedMembers, true)
	      .to.have.same.deep.ordered.members(set2);
	  };

	  /**
	   * ### .notSameDeepOrderedMembers(set1, set2, [message])
	   *
	   * Asserts that `set1` and `set2` don't have the same members in the same
	   * order. Uses a deep equality check.
	   *
	   *     assert.notSameDeepOrderedMembers([ { a: 1 }, { b: 2 }, { c: 3 } ], [ { a: 1 }, { b: 2 }, { z: 5 } ], 'not same deep ordered members');
	   *     assert.notSameDeepOrderedMembers([ { a: 1 }, { b: 2 }, { c: 3 } ], [ { b: 2 }, { a: 1 }, { c: 3 } ], 'not same deep ordered members');
	   *
	   * @name notSameDeepOrderedMembers
	   * @param {Array} set1
	   * @param {Array} set2
	   * @param {String} message
	   * @namespace Assert
	   * @api public
	   */

	  assert.notSameDeepOrderedMembers = function (set1, set2, msg) {
	    new Assertion(set1, msg, assert.notSameDeepOrderedMembers, true)
	      .to.not.have.same.deep.ordered.members(set2);
	  };

	  /**
	   * ### .includeMembers(superset, subset, [message])
	   *
	   * Asserts that `subset` is included in `superset` in any order. Uses a
	   * strict equality check (===). Duplicates are ignored.
	   *
	   *     assert.includeMembers([ 1, 2, 3 ], [ 2, 1, 2 ], 'include members');
	   *
	   * @name includeMembers
	   * @param {Array} superset
	   * @param {Array} subset
	   * @param {String} message
	   * @namespace Assert
	   * @api public
	   */

	  assert.includeMembers = function (superset, subset, msg) {
	    new Assertion(superset, msg, assert.includeMembers, true)
	      .to.include.members(subset);
	  };

	  /**
	   * ### .notIncludeMembers(superset, subset, [message])
	   *
	   * Asserts that `subset` isn't included in `superset` in any order. Uses a
	   * strict equality check (===). Duplicates are ignored.
	   *
	   *     assert.notIncludeMembers([ 1, 2, 3 ], [ 5, 1 ], 'not include members');
	   *
	   * @name notIncludeMembers
	   * @param {Array} superset
	   * @param {Array} subset
	   * @param {String} message
	   * @namespace Assert
	   * @api public
	   */

	  assert.notIncludeMembers = function (superset, subset, msg) {
	    new Assertion(superset, msg, assert.notIncludeMembers, true)
	      .to.not.include.members(subset);
	  };

	  /**
	   * ### .includeDeepMembers(superset, subset, [message])
	   *
	   * Asserts that `subset` is included in `superset` in any order. Uses a deep
	   * equality check. Duplicates are ignored.
	   *
	   *     assert.includeDeepMembers([ { a: 1 }, { b: 2 }, { c: 3 } ], [ { b: 2 }, { a: 1 }, { b: 2 } ], 'include deep members');
	   *
	   * @name includeDeepMembers
	   * @param {Array} superset
	   * @param {Array} subset
	   * @param {String} message
	   * @namespace Assert
	   * @api public
	   */

	  assert.includeDeepMembers = function (superset, subset, msg) {
	    new Assertion(superset, msg, assert.includeDeepMembers, true)
	      .to.include.deep.members(subset);
	  };

	  /**
	   * ### .notIncludeDeepMembers(superset, subset, [message])
	   *
	   * Asserts that `subset` isn't included in `superset` in any order. Uses a
	   * deep equality check. Duplicates are ignored.
	   *
	   *     assert.notIncludeDeepMembers([ { a: 1 }, { b: 2 }, { c: 3 } ], [ { b: 2 }, { f: 5 } ], 'not include deep members');
	   *
	   * @name notIncludeDeepMembers
	   * @param {Array} superset
	   * @param {Array} subset
	   * @param {String} message
	   * @namespace Assert
	   * @api public
	   */

	  assert.notIncludeDeepMembers = function (superset, subset, msg) {
	    new Assertion(superset, msg, assert.notIncludeDeepMembers, true)
	      .to.not.include.deep.members(subset);
	  };

	  /**
	   * ### .includeOrderedMembers(superset, subset, [message])
	   *
	   * Asserts that `subset` is included in `superset` in the same order
	   * beginning with the first element in `superset`. Uses a strict equality
	   * check (===).
	   *
	   *     assert.includeOrderedMembers([ 1, 2, 3 ], [ 1, 2 ], 'include ordered members');
	   *
	   * @name includeOrderedMembers
	   * @param {Array} superset
	   * @param {Array} subset
	   * @param {String} message
	   * @namespace Assert
	   * @api public
	   */

	  assert.includeOrderedMembers = function (superset, subset, msg) {
	    new Assertion(superset, msg, assert.includeOrderedMembers, true)
	      .to.include.ordered.members(subset);
	  };

	  /**
	   * ### .notIncludeOrderedMembers(superset, subset, [message])
	   *
	   * Asserts that `subset` isn't included in `superset` in the same order
	   * beginning with the first element in `superset`. Uses a strict equality
	   * check (===).
	   *
	   *     assert.notIncludeOrderedMembers([ 1, 2, 3 ], [ 2, 1 ], 'not include ordered members');
	   *     assert.notIncludeOrderedMembers([ 1, 2, 3 ], [ 2, 3 ], 'not include ordered members');
	   *
	   * @name notIncludeOrderedMembers
	   * @param {Array} superset
	   * @param {Array} subset
	   * @param {String} message
	   * @namespace Assert
	   * @api public
	   */

	  assert.notIncludeOrderedMembers = function (superset, subset, msg) {
	    new Assertion(superset, msg, assert.notIncludeOrderedMembers, true)
	      .to.not.include.ordered.members(subset);
	  };

	  /**
	   * ### .includeDeepOrderedMembers(superset, subset, [message])
	   *
	   * Asserts that `subset` is included in `superset` in the same order
	   * beginning with the first element in `superset`. Uses a deep equality
	   * check.
	   *
	   *     assert.includeDeepOrderedMembers([ { a: 1 }, { b: 2 }, { c: 3 } ], [ { a: 1 }, { b: 2 } ], 'include deep ordered members');
	   *
	   * @name includeDeepOrderedMembers
	   * @param {Array} superset
	   * @param {Array} subset
	   * @param {String} message
	   * @namespace Assert
	   * @api public
	   */

	  assert.includeDeepOrderedMembers = function (superset, subset, msg) {
	    new Assertion(superset, msg, assert.includeDeepOrderedMembers, true)
	      .to.include.deep.ordered.members(subset);
	  };

	  /**
	   * ### .notIncludeDeepOrderedMembers(superset, subset, [message])
	   *
	   * Asserts that `subset` isn't included in `superset` in the same order
	   * beginning with the first element in `superset`. Uses a deep equality
	   * check.
	   *
	   *     assert.notIncludeDeepOrderedMembers([ { a: 1 }, { b: 2 }, { c: 3 } ], [ { a: 1 }, { f: 5 } ], 'not include deep ordered members');
	   *     assert.notIncludeDeepOrderedMembers([ { a: 1 }, { b: 2 }, { c: 3 } ], [ { b: 2 }, { a: 1 } ], 'not include deep ordered members');
	   *     assert.notIncludeDeepOrderedMembers([ { a: 1 }, { b: 2 }, { c: 3 } ], [ { b: 2 }, { c: 3 } ], 'not include deep ordered members');
	   *
	   * @name notIncludeDeepOrderedMembers
	   * @param {Array} superset
	   * @param {Array} subset
	   * @param {String} message
	   * @namespace Assert
	   * @api public
	   */

	  assert.notIncludeDeepOrderedMembers = function (superset, subset, msg) {
	    new Assertion(superset, msg, assert.notIncludeDeepOrderedMembers, true)
	      .to.not.include.deep.ordered.members(subset);
	  };

	  /**
	   * ### .oneOf(inList, list, [message])
	   *
	   * Asserts that non-object, non-array value `inList` appears in the flat array `list`.
	   *
	   *     assert.oneOf(1, [ 2, 1 ], 'Not found in list');
	   *
	   * @name oneOf
	   * @param {*} inList
	   * @param {Array<*>} list
	   * @param {String} message
	   * @namespace Assert
	   * @api public
	   */

	  assert.oneOf = function (inList, list, msg) {
	    new Assertion(inList, msg, assert.oneOf, true).to.be.oneOf(list);
	  };

	  /**
	   * ### .changes(function, object, property, [message])
	   *
	   * Asserts that a function changes the value of a property.
	   *
	   *     var obj = { val: 10 };
	   *     var fn = function() { obj.val = 22 };
	   *     assert.changes(fn, obj, 'val');
	   *
	   * @name changes
	   * @param {Function} modifier function
	   * @param {Object} object or getter function
	   * @param {String} property name _optional_
	   * @param {String} message _optional_
	   * @namespace Assert
	   * @api public
	   */

	  assert.changes = function (fn, obj, prop, msg) {
	    if (arguments.length === 3 && typeof obj === 'function') {
	      msg = prop;
	      prop = null;
	    }

	    new Assertion(fn, msg, assert.changes, true).to.change(obj, prop);
	  };

	   /**
	   * ### .changesBy(function, object, property, delta, [message])
	   *
	   * Asserts that a function changes the value of a property by an amount (delta).
	   *
	   *     var obj = { val: 10 };
	   *     var fn = function() { obj.val += 2 };
	   *     assert.changesBy(fn, obj, 'val', 2);
	   *
	   * @name changesBy
	   * @param {Function} modifier function
	   * @param {Object} object or getter function
	   * @param {String} property name _optional_
	   * @param {Number} change amount (delta)
	   * @param {String} message _optional_
	   * @namespace Assert
	   * @api public
	   */

	  assert.changesBy = function (fn, obj, prop, delta, msg) {
	    if (arguments.length === 4 && typeof obj === 'function') {
	      var tmpMsg = delta;
	      delta = prop;
	      msg = tmpMsg;
	    } else if (arguments.length === 3) {
	      delta = prop;
	      prop = null;
	    }

	    new Assertion(fn, msg, assert.changesBy, true)
	      .to.change(obj, prop).by(delta);
	  };

	   /**
	   * ### .doesNotChange(function, object, property, [message])
	   *
	   * Asserts that a function does not change the value of a property.
	   *
	   *     var obj = { val: 10 };
	   *     var fn = function() { console.log('foo'); };
	   *     assert.doesNotChange(fn, obj, 'val');
	   *
	   * @name doesNotChange
	   * @param {Function} modifier function
	   * @param {Object} object or getter function
	   * @param {String} property name _optional_
	   * @param {String} message _optional_
	   * @namespace Assert
	   * @api public
	   */

	  assert.doesNotChange = function (fn, obj, prop, msg) {
	    if (arguments.length === 3 && typeof obj === 'function') {
	      msg = prop;
	      prop = null;
	    }

	    return new Assertion(fn, msg, assert.doesNotChange, true)
	      .to.not.change(obj, prop);
	  };

	  /**
	   * ### .changesButNotBy(function, object, property, delta, [message])
	   *
	   * Asserts that a function does not change the value of a property or of a function's return value by an amount (delta)
	   *
	   *     var obj = { val: 10 };
	   *     var fn = function() { obj.val += 10 };
	   *     assert.changesButNotBy(fn, obj, 'val', 5);
	   *
	   * @name changesButNotBy
	   * @param {Function} modifier function
	   * @param {Object} object or getter function
	   * @param {String} property name _optional_
	   * @param {Number} change amount (delta)
	   * @param {String} message _optional_
	   * @namespace Assert
	   * @api public
	   */

	  assert.changesButNotBy = function (fn, obj, prop, delta, msg) {
	    if (arguments.length === 4 && typeof obj === 'function') {
	      var tmpMsg = delta;
	      delta = prop;
	      msg = tmpMsg;
	    } else if (arguments.length === 3) {
	      delta = prop;
	      prop = null;
	    }

	    new Assertion(fn, msg, assert.changesButNotBy, true)
	      .to.change(obj, prop).but.not.by(delta);
	  };

	  /**
	   * ### .increases(function, object, property, [message])
	   *
	   * Asserts that a function increases a numeric object property.
	   *
	   *     var obj = { val: 10 };
	   *     var fn = function() { obj.val = 13 };
	   *     assert.increases(fn, obj, 'val');
	   *
	   * @name increases
	   * @param {Function} modifier function
	   * @param {Object} object or getter function
	   * @param {String} property name _optional_
	   * @param {String} message _optional_
	   * @namespace Assert
	   * @api public
	   */

	  assert.increases = function (fn, obj, prop, msg) {
	    if (arguments.length === 3 && typeof obj === 'function') {
	      msg = prop;
	      prop = null;
	    }

	    return new Assertion(fn, msg, assert.increases, true)
	      .to.increase(obj, prop);
	  };

	  /**
	   * ### .increasesBy(function, object, property, delta, [message])
	   *
	   * Asserts that a function increases a numeric object property or a function's return value by an amount (delta).
	   *
	   *     var obj = { val: 10 };
	   *     var fn = function() { obj.val += 10 };
	   *     assert.increasesBy(fn, obj, 'val', 10);
	   *
	   * @name increasesBy
	   * @param {Function} modifier function
	   * @param {Object} object or getter function
	   * @param {String} property name _optional_
	   * @param {Number} change amount (delta)
	   * @param {String} message _optional_
	   * @namespace Assert
	   * @api public
	   */

	  assert.increasesBy = function (fn, obj, prop, delta, msg) {
	    if (arguments.length === 4 && typeof obj === 'function') {
	      var tmpMsg = delta;
	      delta = prop;
	      msg = tmpMsg;
	    } else if (arguments.length === 3) {
	      delta = prop;
	      prop = null;
	    }

	    new Assertion(fn, msg, assert.increasesBy, true)
	      .to.increase(obj, prop).by(delta);
	  };

	  /**
	   * ### .doesNotIncrease(function, object, property, [message])
	   *
	   * Asserts that a function does not increase a numeric object property.
	   *
	   *     var obj = { val: 10 };
	   *     var fn = function() { obj.val = 8 };
	   *     assert.doesNotIncrease(fn, obj, 'val');
	   *
	   * @name doesNotIncrease
	   * @param {Function} modifier function
	   * @param {Object} object or getter function
	   * @param {String} property name _optional_
	   * @param {String} message _optional_
	   * @namespace Assert
	   * @api public
	   */

	  assert.doesNotIncrease = function (fn, obj, prop, msg) {
	    if (arguments.length === 3 && typeof obj === 'function') {
	      msg = prop;
	      prop = null;
	    }

	    return new Assertion(fn, msg, assert.doesNotIncrease, true)
	      .to.not.increase(obj, prop);
	  };

	  /**
	   * ### .increasesButNotBy(function, object, property, delta, [message])
	   *
	   * Asserts that a function does not increase a numeric object property or function's return value by an amount (delta).
	   *
	   *     var obj = { val: 10 };
	   *     var fn = function() { obj.val = 15 };
	   *     assert.increasesButNotBy(fn, obj, 'val', 10);
	   *
	   * @name increasesButNotBy
	   * @param {Function} modifier function
	   * @param {Object} object or getter function
	   * @param {String} property name _optional_
	   * @param {Number} change amount (delta)
	   * @param {String} message _optional_
	   * @namespace Assert
	   * @api public
	   */

	  assert.increasesButNotBy = function (fn, obj, prop, delta, msg) {
	    if (arguments.length === 4 && typeof obj === 'function') {
	      var tmpMsg = delta;
	      delta = prop;
	      msg = tmpMsg;
	    } else if (arguments.length === 3) {
	      delta = prop;
	      prop = null;
	    }

	    new Assertion(fn, msg, assert.increasesButNotBy, true)
	      .to.increase(obj, prop).but.not.by(delta);
	  };

	  /**
	   * ### .decreases(function, object, property, [message])
	   *
	   * Asserts that a function decreases a numeric object property.
	   *
	   *     var obj = { val: 10 };
	   *     var fn = function() { obj.val = 5 };
	   *     assert.decreases(fn, obj, 'val');
	   *
	   * @name decreases
	   * @param {Function} modifier function
	   * @param {Object} object or getter function
	   * @param {String} property name _optional_
	   * @param {String} message _optional_
	   * @namespace Assert
	   * @api public
	   */

	  assert.decreases = function (fn, obj, prop, msg) {
	    if (arguments.length === 3 && typeof obj === 'function') {
	      msg = prop;
	      prop = null;
	    }

	    return new Assertion(fn, msg, assert.decreases, true)
	      .to.decrease(obj, prop);
	  };

	  /**
	   * ### .decreasesBy(function, object, property, delta, [message])
	   *
	   * Asserts that a function decreases a numeric object property or a function's return value by an amount (delta)
	   *
	   *     var obj = { val: 10 };
	   *     var fn = function() { obj.val -= 5 };
	   *     assert.decreasesBy(fn, obj, 'val', 5);
	   *
	   * @name decreasesBy
	   * @param {Function} modifier function
	   * @param {Object} object or getter function
	   * @param {String} property name _optional_
	   * @param {Number} change amount (delta)
	   * @param {String} message _optional_
	   * @namespace Assert
	   * @api public
	   */

	  assert.decreasesBy = function (fn, obj, prop, delta, msg) {
	    if (arguments.length === 4 && typeof obj === 'function') {
	      var tmpMsg = delta;
	      delta = prop;
	      msg = tmpMsg;
	    } else if (arguments.length === 3) {
	      delta = prop;
	      prop = null;
	    }

	    new Assertion(fn, msg, assert.decreasesBy, true)
	      .to.decrease(obj, prop).by(delta);
	  };

	  /**
	   * ### .doesNotDecrease(function, object, property, [message])
	   *
	   * Asserts that a function does not decreases a numeric object property.
	   *
	   *     var obj = { val: 10 };
	   *     var fn = function() { obj.val = 15 };
	   *     assert.doesNotDecrease(fn, obj, 'val');
	   *
	   * @name doesNotDecrease
	   * @param {Function} modifier function
	   * @param {Object} object or getter function
	   * @param {String} property name _optional_
	   * @param {String} message _optional_
	   * @namespace Assert
	   * @api public
	   */

	  assert.doesNotDecrease = function (fn, obj, prop, msg) {
	    if (arguments.length === 3 && typeof obj === 'function') {
	      msg = prop;
	      prop = null;
	    }

	    return new Assertion(fn, msg, assert.doesNotDecrease, true)
	      .to.not.decrease(obj, prop);
	  };

	  /**
	   * ### .doesNotDecreaseBy(function, object, property, delta, [message])
	   *
	   * Asserts that a function does not decreases a numeric object property or a function's return value by an amount (delta)
	   *
	   *     var obj = { val: 10 };
	   *     var fn = function() { obj.val = 5 };
	   *     assert.doesNotDecreaseBy(fn, obj, 'val', 1);
	   *
	   * @name doesNotDecreaseBy
	   * @param {Function} modifier function
	   * @param {Object} object or getter function
	   * @param {String} property name _optional_
	   * @param {Number} change amount (delta)
	   * @param {String} message _optional_
	   * @namespace Assert
	   * @api public
	   */

	  assert.doesNotDecreaseBy = function (fn, obj, prop, delta, msg) {
	    if (arguments.length === 4 && typeof obj === 'function') {
	      var tmpMsg = delta;
	      delta = prop;
	      msg = tmpMsg;
	    } else if (arguments.length === 3) {
	      delta = prop;
	      prop = null;
	    }

	    return new Assertion(fn, msg, assert.doesNotDecreaseBy, true)
	      .to.not.decrease(obj, prop).by(delta);
	  };

	  /**
	   * ### .decreasesButNotBy(function, object, property, delta, [message])
	   *
	   * Asserts that a function does not decreases a numeric object property or a function's return value by an amount (delta)
	   *
	   *     var obj = { val: 10 };
	   *     var fn = function() { obj.val = 5 };
	   *     assert.decreasesButNotBy(fn, obj, 'val', 1);
	   *
	   * @name decreasesButNotBy
	   * @param {Function} modifier function
	   * @param {Object} object or getter function
	   * @param {String} property name _optional_
	   * @param {Number} change amount (delta)
	   * @param {String} message _optional_
	   * @namespace Assert
	   * @api public
	   */

	  assert.decreasesButNotBy = function (fn, obj, prop, delta, msg) {
	    if (arguments.length === 4 && typeof obj === 'function') {
	      var tmpMsg = delta;
	      delta = prop;
	      msg = tmpMsg;
	    } else if (arguments.length === 3) {
	      delta = prop;
	      prop = null;
	    }

	    new Assertion(fn, msg, assert.decreasesButNotBy, true)
	      .to.decrease(obj, prop).but.not.by(delta);
	  };

	  /*!
	   * ### .ifError(object)
	   *
	   * Asserts if value is not a false value, and throws if it is a true value.
	   * This is added to allow for chai to be a drop-in replacement for Node's
	   * assert class.
	   *
	   *     var err = new Error('I am a custom error');
	   *     assert.ifError(err); // Rethrows err!
	   *
	   * @name ifError
	   * @param {Object} object
	   * @namespace Assert
	   * @api public
	   */

	  assert.ifError = function (val) {
	    if (val) {
	      throw(val);
	    }
	  };

	  /**
	   * ### .isExtensible(object)
	   *
	   * Asserts that `object` is extensible (can have new properties added to it).
	   *
	   *     assert.isExtensible({});
	   *
	   * @name isExtensible
	   * @alias extensible
	   * @param {Object} object
	   * @param {String} message _optional_
	   * @namespace Assert
	   * @api public
	   */

	  assert.isExtensible = function (obj, msg) {
	    new Assertion(obj, msg, assert.isExtensible, true).to.be.extensible;
	  };

	  /**
	   * ### .isNotExtensible(object)
	   *
	   * Asserts that `object` is _not_ extensible.
	   *
	   *     var nonExtensibleObject = Object.preventExtensions({});
	   *     var sealedObject = Object.seal({});
	   *     var frozenObject = Object.freeze({});
	   *
	   *     assert.isNotExtensible(nonExtensibleObject);
	   *     assert.isNotExtensible(sealedObject);
	   *     assert.isNotExtensible(frozenObject);
	   *
	   * @name isNotExtensible
	   * @alias notExtensible
	   * @param {Object} object
	   * @param {String} message _optional_
	   * @namespace Assert
	   * @api public
	   */

	  assert.isNotExtensible = function (obj, msg) {
	    new Assertion(obj, msg, assert.isNotExtensible, true).to.not.be.extensible;
	  };

	  /**
	   * ### .isSealed(object)
	   *
	   * Asserts that `object` is sealed (cannot have new properties added to it
	   * and its existing properties cannot be removed).
	   *
	   *     var sealedObject = Object.seal({});
	   *     var frozenObject = Object.seal({});
	   *
	   *     assert.isSealed(sealedObject);
	   *     assert.isSealed(frozenObject);
	   *
	   * @name isSealed
	   * @alias sealed
	   * @param {Object} object
	   * @param {String} message _optional_
	   * @namespace Assert
	   * @api public
	   */

	  assert.isSealed = function (obj, msg) {
	    new Assertion(obj, msg, assert.isSealed, true).to.be.sealed;
	  };

	  /**
	   * ### .isNotSealed(object)
	   *
	   * Asserts that `object` is _not_ sealed.
	   *
	   *     assert.isNotSealed({});
	   *
	   * @name isNotSealed
	   * @alias notSealed
	   * @param {Object} object
	   * @param {String} message _optional_
	   * @namespace Assert
	   * @api public
	   */

	  assert.isNotSealed = function (obj, msg) {
	    new Assertion(obj, msg, assert.isNotSealed, true).to.not.be.sealed;
	  };

	  /**
	   * ### .isFrozen(object)
	   *
	   * Asserts that `object` is frozen (cannot have new properties added to it
	   * and its existing properties cannot be modified).
	   *
	   *     var frozenObject = Object.freeze({});
	   *     assert.frozen(frozenObject);
	   *
	   * @name isFrozen
	   * @alias frozen
	   * @param {Object} object
	   * @param {String} message _optional_
	   * @namespace Assert
	   * @api public
	   */

	  assert.isFrozen = function (obj, msg) {
	    new Assertion(obj, msg, assert.isFrozen, true).to.be.frozen;
	  };

	  /**
	   * ### .isNotFrozen(object)
	   *
	   * Asserts that `object` is _not_ frozen.
	   *
	   *     assert.isNotFrozen({});
	   *
	   * @name isNotFrozen
	   * @alias notFrozen
	   * @param {Object} object
	   * @param {String} message _optional_
	   * @namespace Assert
	   * @api public
	   */

	  assert.isNotFrozen = function (obj, msg) {
	    new Assertion(obj, msg, assert.isNotFrozen, true).to.not.be.frozen;
	  };

	  /**
	   * ### .isEmpty(target)
	   *
	   * Asserts that the target does not contain any values.
	   * For arrays and strings, it checks the `length` property.
	   * For `Map` and `Set` instances, it checks the `size` property.
	   * For non-function objects, it gets the count of own
	   * enumerable string keys.
	   *
	   *     assert.isEmpty([]);
	   *     assert.isEmpty('');
	   *     assert.isEmpty(new Map);
	   *     assert.isEmpty({});
	   *
	   * @name isEmpty
	   * @alias empty
	   * @param {Object|Array|String|Map|Set} target
	   * @param {String} message _optional_
	   * @namespace Assert
	   * @api public
	   */

	  assert.isEmpty = function(val, msg) {
	    new Assertion(val, msg, assert.isEmpty, true).to.be.empty;
	  };

	  /**
	   * ### .isNotEmpty(target)
	   *
	   * Asserts that the target contains values.
	   * For arrays and strings, it checks the `length` property.
	   * For `Map` and `Set` instances, it checks the `size` property.
	   * For non-function objects, it gets the count of own
	   * enumerable string keys.
	   *
	   *     assert.isNotEmpty([1, 2]);
	   *     assert.isNotEmpty('34');
	   *     assert.isNotEmpty(new Set([5, 6]));
	   *     assert.isNotEmpty({ key: 7 });
	   *
	   * @name isNotEmpty
	   * @alias notEmpty
	   * @param {Object|Array|String|Map|Set} target
	   * @param {String} message _optional_
	   * @namespace Assert
	   * @api public
	   */

	  assert.isNotEmpty = function(val, msg) {
	    new Assertion(val, msg, assert.isNotEmpty, true).to.not.be.empty;
	  };

	  /*!
	   * Aliases.
	   */

	  (function alias(name, as){
	    assert[as] = assert[name];
	    return alias;
	  })
	  ('isOk', 'ok')
	  ('isNotOk', 'notOk')
	  ('throws', 'throw')
	  ('throws', 'Throw')
	  ('isExtensible', 'extensible')
	  ('isNotExtensible', 'notExtensible')
	  ('isSealed', 'sealed')
	  ('isNotSealed', 'notSealed')
	  ('isFrozen', 'frozen')
	  ('isNotFrozen', 'notFrozen')
	  ('isEmpty', 'empty')
	  ('isNotEmpty', 'notEmpty');
	};

	/*!
	 * chai
	 * Copyright(c) 2011-2014 Jake Luer <jake@alogicalparadox.com>
	 * MIT Licensed
	 */

	var hasRequiredChai;

	function requireChai () {
		if (hasRequiredChai) return chai$2;
		hasRequiredChai = 1;
		(function (exports) {
			var used = [];

			/*!
			 * Chai version
			 */

			exports.version = '4.3.8';

			/*!
			 * Assertion Error
			 */

			exports.AssertionError = assertionError;

			/*!
			 * Utils for plugins (not exported)
			 */

			var util = requireUtils();

			/**
			 * # .use(function)
			 *
			 * Provides a way to extend the internals of Chai.
			 *
			 * @param {Function}
			 * @returns {this} for chaining
			 * @api public
			 */

			exports.use = function (fn) {
			  if (!~used.indexOf(fn)) {
			    fn(exports, util);
			    used.push(fn);
			  }

			  return exports;
			};

			/*!
			 * Utility Functions
			 */

			exports.util = util;

			/*!
			 * Configuration
			 */

			var config = config$6;
			exports.config = config;

			/*!
			 * Primary `Assertion` prototype
			 */

			var assertion$1 = assertion;
			exports.use(assertion$1);

			/*!
			 * Core Assertions
			 */

			var core = assertions;
			exports.use(core);

			/*!
			 * Expect interface
			 */

			var expect = expect$1;
			exports.use(expect);

			/*!
			 * Should interface
			 */

			var should$1 = should;
			exports.use(should$1);

			/*!
			 * Assert interface
			 */

			var assert = assert$1;
			exports.use(assert); 
		} (chai$2));
		return chai$2;
	}

	var chai = requireChai();

	var chai$1 = /*@__PURE__*/getDefaultExportFromCjs(chai);

	const expect = chai$1.expect;
	chai$1.version;
	chai$1.Assertion;
	chai$1.AssertionError;
	chai$1.util;
	chai$1.config;
	chai$1.use;
	chai$1.should;
	const assert = chai$1.assert;
	chai$1.core;

	var svgcanvas = {};

	Object.defineProperty(svgcanvas, '__esModule', { value: true });

	function toString(obj) {
	    if (!obj) {
	        return obj
	    }
	    if (typeof obj === 'string') {
	        return obj
	    }
	    return obj + '';
	}

	class ImageUtils {

	    /**
	     * Convert svg dataurl to canvas element
	     * 
	     * @private
	     */
	    async svg2canvas(svgDataURL, width, height) {
	        const svgImage = await new Promise((resolve) => {
	            var svgImage = new Image();
	            svgImage.onload = function() {
	                resolve(svgImage);
	            };
	            svgImage.src = svgDataURL;
	        });
	        var canvas = document.createElement('canvas');
	        canvas.width = width;
	        canvas.height = height;
	        const ctx = canvas.getContext('2d');
	        ctx.drawImage(svgImage, 0, 0);
	        return canvas;
	    }
	    
	    toDataURL(svgNode, width, height, type, encoderOptions, options) {
	        var xml = new XMLSerializer().serializeToString(svgNode);
	    
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

	        if (!options) {
	            options = {};
	        }
	    
	        var SVGDataURL = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(xml);
	        if (type === "image/svg+xml" || !type) {
	            if (options.async) {
	                return Promise.resolve(SVGDataURL)
	            }
	            return SVGDataURL;
	        }
	        if (type === "image/jpeg" || type === "image/png") {
	            if (!options.async) {
	                throw new Error('svgcanvas: options.async must be set to true if type is image/jpeg | image/png')
	            }
	            return (async () => {
	                const canvas = await this.svg2canvas(SVGDataURL, width, height);
	                const dataUrl = canvas.toDataURL(type, encoderOptions);
	                canvas.remove();
	                return dataUrl;
	            })()
	        }
	        throw new Error('svgcanvas: Unknown type for toDataURL, please use image/jpeg | image/png | image/svg+xml.');
	    }

	    getImageData(svgNode, width, height, sx, sy, sw, sh, options) {
	        if (!options) {
	            options = {};
	        }
	        if (!options.async) {
	            throw new Error('svgcanvas: options.async must be set to true for getImageData')
	        }
	        const svgDataURL = this.toDataURL(svgNode, width, height, 'image/svg+xml');
	        return (async () => {
	            const canvas = await this.svg2canvas(svgDataURL, width, height);
	            const ctx = canvas.getContext('2d');
	            const imageData = ctx.getImageData(sx, sy, sw, sh);
	            canvas.remove();
	            return imageData;
	        })()
	    }
	}

	const utils = new ImageUtils();

	/*!!
	 *  SVGCanvas v2.0.3
	 *  Draw on SVG using Canvas's 2D Context API.
	 *
	 *  Licensed under the MIT license:
	 *  http://www.opensource.org/licenses/mit-license.php
	 *
	 *  Author:
	 *  Kerry Liu
	 *  Zeno Zeng
	 *
	 *  Copyright (c) 2014 Gliffy Inc.
	 *  Copyright (c) 2021 Zeno Zeng
	 */

	var Context = (function () {

	    var STYLES, Context, CanvasGradient, CanvasPattern, namedEntities;

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
	        var i, entity, lookup = {}, base10;
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
	            apply :  "fill stroke"
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
	        },
	        "lineDash" : {
	            svgAttr : "stroke-dasharray",
	            canvas : [],
	            svg : null,
	            apply : "stroke"
	        }
	    };

	    /**
	     *
	     * @param gradientNode - reference to the gradient
	     * @constructor
	     */
	    CanvasGradient = function (gradientNode, ctx) {
	        this.__root = gradientNode;
	        this.__ctx = ctx;
	    };

	    /**
	     * Adds a color stop to the gradient root
	     */
	    CanvasGradient.prototype.addColorStop = function (offset, color) {
	        var stop = this.__ctx.__createElement("stop"), regex, matches;
	        stop.setAttribute("offset", offset);
	        if (toString(color).indexOf("rgba") !== -1) {
	            //separate alpha value, since webkit can't handle it
	            regex = /rgba\(\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\s*,\s*(\d?\.?\d*)\s*\)/gi;
	            matches = regex.exec(color);
	            stop.setAttribute("stop-color", format("rgb({r},{g},{b})", {r:matches[1], g:matches[2], b:matches[3]}));
	            stop.setAttribute("stop-opacity", matches[4]);
	        } else {
	            stop.setAttribute("stop-color", toString(color));
	        }
	        this.__root.appendChild(stop);
	    };

	    CanvasPattern = function (pattern, ctx) {
	        this.__root = pattern;
	        this.__ctx = ctx;
	    };

	    /**
	     * The mock canvas context
	     * @param o - options include:
	     * ctx - existing Context2D to wrap around
	     * width - width of your canvas (defaults to 500)
	     * height - height of your canvas (defaults to 500)
	     * enableMirroring - enables canvas mirroring (get image data) (defaults to false)
	     * document - the document object (defaults to the current document)
	     */
	    Context = function (o) {

	        var defaultOptions = { width:500, height:500, enableMirroring : false}, options;

	        // keep support for this way of calling Context: new Context(width, height)
	        if (arguments.length > 1) {
	            options = defaultOptions;
	            options.width = arguments[0];
	            options.height = arguments[1];
	        } else if ( !o ) {
	            options = defaultOptions;
	        } else {
	            options = o;
	        }

	        if (!(this instanceof Context)) {
	            //did someone call this without new?
	            return new Context(options);
	        }

	        //setup options
	        this.width = options.width || defaultOptions.width;
	        this.height = options.height || defaultOptions.height;
	        this.enableMirroring = options.enableMirroring !== undefined ? options.enableMirroring : defaultOptions.enableMirroring;

	        this.canvas = this;   ///point back to this instance!
	        this.__document = options.document || document;

	        // allow passing in an existing context to wrap around
	        // if a context is passed in, we know a canvas already exist
	        if (options.ctx) {
	            this.__ctx = options.ctx;
	        } else {
	            this.__canvas = this.__document.createElement("canvas");
	            this.__ctx = this.__canvas.getContext("2d");
	        }

	        this.__setDefaultStyles();
	        this.__styleStack = [this.__getStyleState()];
	        this.__groupStack = [];

	        //the root svg element
	        this.__root = this.__document.createElementNS("http://www.w3.org/2000/svg", "svg");
	        this.__root.setAttribute("version", 1.1);
	        this.__root.setAttribute("xmlns", "http://www.w3.org/2000/svg");
	        this.__root.setAttributeNS("http://www.w3.org/2000/xmlns/", "xmlns:xlink", "http://www.w3.org/1999/xlink");
	        this.__root.setAttribute("width", this.width);
	        this.__root.setAttribute("height", this.height);

	        //make sure we don't generate the same ids in defs
	        this.__ids = {};

	        //defs tag
	        this.__defs = this.__document.createElementNS("http://www.w3.org/2000/svg", "defs");
	        this.__root.appendChild(this.__defs);

	        //also add a group child. the svg element can't use the transform attribute
	        this.__currentElement = this.__document.createElementNS("http://www.w3.org/2000/svg", "g");
	        this.__root.appendChild(this.__currentElement);

	        // init transformation matrix
	        this.resetTransform();

	        this.__options = options;
	        this.__id = Math.random().toString(16).substring(2, 8);
	        this.__debug(`new`, o);
	    };

	    /**
	     * Log
	     *
	     * @private
	     */
	    Context.prototype.__debug = function(...data) {
	        if (!this.__options.debug) {
	            return
	        }
	        console.debug(`svgcanvas#${this.__id}:`, ...data);
	    };

	    /**
	     * Creates the specified svg element
	     * @private
	     */
	    Context.prototype.__createElement = function (elementName, properties, resetFill) {
	        if (typeof properties === "undefined") {
	            properties = {};
	        }

	        var element = this.__document.createElementNS("http://www.w3.org/2000/svg", elementName),
	            keys = Object.keys(properties), i, key;
	        if (resetFill) {
	            //if fill or stroke is not specified, the svg element should not display. By default SVG's fill is black.
	            element.setAttribute("fill", "none");
	            element.setAttribute("stroke", "none");
	        }
	        for (i=0; i<keys.length; i++) {
	            key = keys[i];
	            element.setAttribute(key, properties[key]);
	        }
	        return element;
	    };

	    /**
	     * Applies default canvas styles to the context
	     * @private
	     */
	    Context.prototype.__setDefaultStyles = function () {
	        //default 2d canvas context properties see:http://www.w3.org/TR/2dcontext/
	        var keys = Object.keys(STYLES), i, key;
	        for (i=0; i<keys.length; i++) {
	            key = keys[i];
	            this[key] = STYLES[key].canvas;
	        }
	    };

	    /**
	     * Applies styles on restore
	     * @param styleState
	     * @private
	     */
	    Context.prototype.__applyStyleState = function (styleState) {
	        var keys = Object.keys(styleState), i, key;
	        for (i=0; i<keys.length; i++) {
	            key = keys[i];
	            this[key] = styleState[key];
	        }
	    };

	    /**
	     * Gets the current style state
	     * @return {Object}
	     * @private
	     */
	    Context.prototype.__getStyleState = function () {
	        var i, styleState = {}, keys = Object.keys(STYLES), key;
	        for (i=0; i<keys.length; i++) {
	            key = keys[i];
	            styleState[key] = this[key];
	        }
	        return styleState;
	    };

	    /**
	     * @see https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/transform
	     */
	    Context.prototype.__applyTransformation = function (element, matrix) {
	        const {a, b, c, d, e, f} = matrix || this.getTransform();
	        element.setAttribute('transform', `matrix(${a} ${b} ${c} ${d} ${e} ${f})`);
	    };

	    /**
	     * Apples the current styles to the current SVG element. On "ctx.fill" or "ctx.stroke"
	     * @param type
	     * @private
	     */
	    Context.prototype.__applyStyleToCurrentElement = function (type) {
	        var currentElement = this.__currentElement;
	        var currentStyleGroup = this.__currentElementsToStyle;
	        if (currentStyleGroup) {
	            currentElement.setAttribute(type, "");
	            currentElement = currentStyleGroup.element;
	            currentStyleGroup.children.forEach(function (node) {
	                node.setAttribute(type, "");
	            });
	        }

	        var keys = Object.keys(STYLES), i, style, value, regex, matches, id, nodeIndex, node;
	        for (i = 0; i < keys.length; i++) {
	            style = STYLES[keys[i]];
	            value = this[keys[i]];
	            if (style.apply) {
	                //is this a gradient or pattern?
	                if (value instanceof CanvasPattern) {
	                    //pattern
	                    if (value.__ctx) {
	                        //copy over defs
	                        for(nodeIndex = 0; nodeIndex < value.__ctx.__defs.childNodes.length; nodeIndex++){
	                          node = value.__ctx.__defs.childNodes[nodeIndex];
	                          id = node.getAttribute("id");
	                          this.__ids[id] = id;
	                          this.__defs.appendChild(node);
	                        }
	                    }
	                    currentElement.setAttribute(style.apply, format("url(#{id})", {id:value.__root.getAttribute("id")}));
	                }
	                else if (value instanceof CanvasGradient) {
	                    //gradient
	                    currentElement.setAttribute(style.apply, format("url(#{id})", {id:value.__root.getAttribute("id")}));
	                } else if (style.apply.indexOf(type)!==-1 && style.svg !== value) {
	                    if ((style.svgAttr === "stroke" || style.svgAttr === "fill") && value.indexOf("rgba") !== -1) {
	                        //separate alpha value, since illustrator can't handle it
	                        regex = /rgba\(\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\s*,\s*(\d?\.?\d*)\s*\)/gi;
	                        matches = regex.exec(value);
	                        currentElement.setAttribute(style.svgAttr, format("rgb({r},{g},{b})", {r:matches[1], g:matches[2], b:matches[3]}));
	                        //should take globalAlpha here
	                        var opacity = matches[4];
	                        var globalAlpha = this.globalAlpha;
	                        if (globalAlpha != null) {
	                            opacity *= globalAlpha;
	                        }
	                        currentElement.setAttribute(style.svgAttr+"-opacity", opacity);
	                    } else {
	                        var attr = style.svgAttr;
	                        if (keys[i] === 'globalAlpha') {
	                            attr = type+'-'+style.svgAttr;
	                            if (currentElement.getAttribute(attr)) {
	                                 //fill-opacity or stroke-opacity has already been set by stroke or fill.
	                                continue;
	                            }
	                        } else if (keys[i] === 'lineWidth') {
	                            var scale = this.__getTransformScale();
	                            value = value * Math.max(scale.x, scale.y);
	                        }
	                        //otherwise only update attribute if right type, and not svg default
	                        currentElement.setAttribute(attr, value);
	                    }
	                }
	            }
	        }
	    };

	    /**
	     * Will return the closest group or svg node. May return the current element.
	     * @private
	     */
	    Context.prototype.__closestGroupOrSvg = function (node) {
	        node = node || this.__currentElement;
	        if (node.nodeName === "g" || node.nodeName === "svg") {
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
	    Context.prototype.getSerializedSvg = function (fixNamedEntities) {
	        var serialized = new XMLSerializer().serializeToString(this.__root),
	            keys, i, key, value, regexp, xmlns;

	        //IE search for a duplicate xmnls because they didn't implement setAttributeNS correctly
	        xmlns = /xmlns="http:\/\/www\.w3\.org\/2000\/svg".+xmlns="http:\/\/www\.w3\.org\/2000\/svg/gi;
	        if (xmlns.test(serialized)) {
	            serialized = serialized.replace('xmlns="http://www.w3.org/2000/svg','xmlns:xlink="http://www.w3.org/1999/xlink');
	        }

	        if (fixNamedEntities) {
	            keys = Object.keys(namedEntities);
	            //loop over each named entity and replace with the proper equivalent.
	            for (i=0; i<keys.length; i++) {
	                key = keys[i];
	                value = namedEntities[key];
	                regexp = new RegExp(key, "gi");
	                if (regexp.test(serialized)) {
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
	    Context.prototype.getSvg = function () {
	        return this.__root;
	    };

	    /**
	     * Will generate a group tag.
	     */
	    Context.prototype.save = function () {
	        var group = this.__createElement("g");
	        var parent = this.__closestGroupOrSvg();
	        this.__groupStack.push(parent);
	        parent.appendChild(group);
	        this.__currentElement = group;
	        const style = this.__getStyleState();

	        this.__debug('save style', style);
	        this.__styleStack.push(style);
	        if (!this.__transformMatrixStack) {
	            this.__transformMatrixStack = [];
	        }
	        this.__transformMatrixStack.push(this.getTransform());
	    };

	    /**
	     * Sets current element to parent, or just root if already root
	     */
	    Context.prototype.restore = function () {
	        this.__currentElement = this.__groupStack.pop();
	        this.__currentElementsToStyle = null;
	        //Clearing canvas will make the poped group invalid, currentElement is set to the root group node.
	        if (!this.__currentElement) {
	            this.__currentElement = this.__root.childNodes[1];
	        }
	        var state = this.__styleStack.pop();
	        this.__debug('restore style', state);
	        this.__applyStyleState(state);
	        if (this.__transformMatrixStack && this.__transformMatrixStack.length > 0) {
	            this.setTransform(this.__transformMatrixStack.pop());
	        }

	    };

	    /**
	     * Create a new Path Element
	     */
	    Context.prototype.beginPath = function () {
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
	    Context.prototype.__applyCurrentDefaultPath = function () {
	        var currentElement = this.__currentElement;
	        if (currentElement.nodeName === "path") {
	            currentElement.setAttribute("d", this.__currentDefaultPath);
	        } else {
	            console.error("Attempted to apply path command to node", currentElement.nodeName);
	        }
	    };

	    /**
	     * Helper function to add path command
	     * @private
	     */
	    Context.prototype.__addPathCommand = function (command) {
	        this.__currentDefaultPath += " ";
	        this.__currentDefaultPath += command;
	    };

	    /**
	     * Adds the move command to the current path element,
	     * if the currentPathElement is not empty create a new path element
	     */
	    Context.prototype.moveTo = function (x,y) {
	        if (this.__currentElement.nodeName !== "path") {
	            this.beginPath();
	        }

	        // creates a new subpath with the given point
	        this.__currentPosition = {x: x, y: y};
	        this.__addPathCommand(format("M {x} {y}", {
	            x: this.__matrixTransform(x, y).x,
	            y: this.__matrixTransform(x, y).y
	        }));
	    };

	    /**
	     * Closes the current path
	     */
	    Context.prototype.closePath = function () {
	        if (this.__currentDefaultPath) {
	            this.__addPathCommand("Z");
	        }
	    };

	    /**
	     * Adds a line to command
	     */
	    Context.prototype.lineTo = function (x, y) {
	        this.__currentPosition = {x: x, y: y};
	        if (this.__currentDefaultPath.indexOf('M') > -1) {
	            this.__addPathCommand(format("L {x} {y}", {
	                x: this.__matrixTransform(x, y).x,
	                y: this.__matrixTransform(x, y).y
	            }));
	        } else {
	            this.__addPathCommand(format("M {x} {y}", {
	                x: this.__matrixTransform(x, y).x,
	                y: this.__matrixTransform(x, y).y
	            }));
	        }
	    };

	    /**
	     * Add a bezier command
	     */
	    Context.prototype.bezierCurveTo = function (cp1x, cp1y, cp2x, cp2y, x, y) {
	        this.__currentPosition = {x: x, y: y};
	        this.__addPathCommand(format("C {cp1x} {cp1y} {cp2x} {cp2y} {x} {y}",
	            {
	                cp1x: this.__matrixTransform(cp1x, cp1y).x,
	                cp1y: this.__matrixTransform(cp1x, cp1y).y,
	                cp2x: this.__matrixTransform(cp2x, cp2y).x,
	                cp2y: this.__matrixTransform(cp2x, cp2y).y,
	                x: this.__matrixTransform(x, y).x,
	                y: this.__matrixTransform(x, y).y
	            }));
	    };

	    /**
	     * Adds a quadratic curve to command
	     */
	    Context.prototype.quadraticCurveTo = function (cpx, cpy, x, y) {
	        this.__currentPosition = {x: x, y: y};
	        this.__addPathCommand(format("Q {cpx} {cpy} {x} {y}", {
	            cpx: this.__matrixTransform(cpx, cpy).x,
	            cpy: this.__matrixTransform(cpx, cpy).y,
	            x: this.__matrixTransform(x, y).x,
	            y: this.__matrixTransform(x, y).y
	        }));
	    };


	    /**
	     * Return a new normalized vector of given vector
	     */
	    var normalize = function (vector) {
	        var len = Math.sqrt(vector[0] * vector[0] + vector[1] * vector[1]);
	        return [vector[0] / len, vector[1] / len];
	    };

	    /**
	     * Adds the arcTo to the current path
	     *
	     * @see http://www.w3.org/TR/2015/WD-2dcontext-20150514/#dom-context-2d-arcto
	     */
	    Context.prototype.arcTo = function (x1, y1, x2, y2, radius) {
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
	        var getAngle = function (vector) {
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
	    Context.prototype.stroke = function () {
	        if (this.__currentElement.nodeName === "path") {
	            this.__currentElement.setAttribute("paint-order", "fill stroke markers");
	        }
	        this.__applyCurrentDefaultPath();
	        this.__applyStyleToCurrentElement("stroke");
	    };

	    /**
	     * Sets fill properties on the current element
	     */
	    Context.prototype.fill = function () {
	        if (this.__currentElement.nodeName === "path") {
	            this.__currentElement.setAttribute("paint-order", "stroke fill markers");
	        }
	        this.__applyCurrentDefaultPath();
	        this.__applyStyleToCurrentElement("fill");
	    };

	    /**
	     *  Adds a rectangle to the path.
	     */
	    Context.prototype.rect = function (x, y, width, height) {
	        if (this.__currentElement.nodeName !== "path") {
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
	    Context.prototype.fillRect = function (x, y, width, height) {
	        let {a, b, c, d, e, f} = this.getTransform();
	        if (JSON.stringify([a, b, c, d, e, f]) === JSON.stringify([1, 0, 0, 1, 0, 0])) {
	            //clear entire canvas
	            if (x === 0 && y === 0 && width === this.width && height === this.height) {
	                this.__clearCanvas();
	            }
	        }
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
	        this.__applyTransformation(rect);
	        this.__applyStyleToCurrentElement("fill");
	    };

	    /**
	     * Draws a rectangle with no fill
	     * @param x
	     * @param y
	     * @param width
	     * @param height
	     */
	    Context.prototype.strokeRect = function (x, y, width, height) {
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
	        this.__applyTransformation(rect);
	        this.__applyStyleToCurrentElement("stroke");
	    };


	    /**
	     * Clear entire canvas:
	     * 1. save current transforms
	     * 2. remove all the childNodes of the root g element
	     */
	    Context.prototype.__clearCanvas = function () {
	        var rootGroup = this.__root.childNodes[1];
	        this.__root.removeChild(rootGroup);
	        this.__currentElement = this.__document.createElementNS("http://www.w3.org/2000/svg", "g");
	        this.__root.appendChild(this.__currentElement);
	        //reset __groupStack as all the child group nodes are all removed.
	        this.__groupStack = [];
	    };

	    /**
	     * "Clears" a canvas by just drawing a white rectangle in the current group.
	     */
	    Context.prototype.clearRect = function (x, y, width, height) {
	        let {a, b, c, d, e, f} = this.getTransform();
	        if (JSON.stringify([a, b, c, d, e, f]) === JSON.stringify([1, 0, 0, 1, 0, 0])) {
	            //clear entire canvas
	            if (x === 0 && y === 0 && width === this.width && height === this.height) {
	                this.__clearCanvas();
	                return;
	            }
	        }
	        var rect, parent = this.__closestGroupOrSvg();
	        rect = this.__createElement("rect", {
	            x : x,
	            y : y,
	            width : width,
	            height : height,
	            fill : "#FFFFFF"
	        }, true);
	        this.__applyTransformation(rect);
	        parent.appendChild(rect);
	    };

	    /**
	     * Adds a linear gradient to a defs tag.
	     * Returns a canvas gradient object that has a reference to it's parent def
	     */
	    Context.prototype.createLinearGradient = function (x1, y1, x2, y2) {
	        var grad = this.__createElement("linearGradient", {
	            id : randomString(this.__ids),
	            x1 : x1+"px",
	            x2 : x2+"px",
	            y1 : y1+"px",
	            y2 : y2+"px",
	            "gradientUnits" : "userSpaceOnUse"
	        }, false);
	        this.__defs.appendChild(grad);
	        return new CanvasGradient(grad, this);
	    };

	    /**
	     * Adds a radial gradient to a defs tag.
	     * Returns a canvas gradient object that has a reference to it's parent def
	     */
	    Context.prototype.createRadialGradient = function (x0, y0, r0, x1, y1, r1) {
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
	        return new CanvasGradient(grad, this);

	    };

	    /**
	     * Fills or strokes text
	     * @param text
	     * @param x
	     * @param y
	     * @param action - stroke or fill
	     * @private
	     */
	    Context.prototype.__applyText = function (text, x, y, action) {
	        var el = document.createElement("span");
	        el.setAttribute("style", 'font:' + this.font);

	        var style = el.style, // CSSStyleDeclaration object
	            parent = this.__closestGroupOrSvg(),
	            textElement = this.__createElement("text", {
	                "font-family": style.fontFamily,
	                "font-size": style.fontSize,
	                "font-style": style.fontStyle,
	                "font-weight": style.fontWeight,

	                // canvas doesn't support underline natively, but we do :)
	                "text-decoration": this.__fontUnderline,
	                "x": x,
	                "y": y,
	                "text-anchor": getTextAnchor(this.textAlign),
	                "dominant-baseline": getDominantBaseline(this.textBaseline)
	            }, true);

	        textElement.appendChild(this.__document.createTextNode(text));
	        this.__currentElement = textElement;
	        this.__applyTransformation(textElement);
	        this.__applyStyleToCurrentElement(action);

	        if (this.__fontHref) {
	            var a = this.__createElement("a");
	            // canvas doesn't natively support linking, but we do :)
	            a.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", this.__fontHref);
	            a.appendChild(textElement);
	            textElement = a;
	        }

	        parent.appendChild(textElement);
	    };

	    /**
	     * Creates a text element
	     * @param text
	     * @param x
	     * @param y
	     */
	    Context.prototype.fillText = function (text, x, y) {
	        this.__applyText(text, x, y, "fill");
	    };

	    /**
	     * Strokes text
	     * @param text
	     * @param x
	     * @param y
	     */
	    Context.prototype.strokeText = function (text, x, y) {
	        this.__applyText(text, x, y, "stroke");
	    };

	    /**
	     * No need to implement this for svg.
	     * @param text
	     * @return {TextMetrics}
	     */
	    Context.prototype.measureText = function (text) {
	        this.__ctx.font = this.font;
	        return this.__ctx.measureText(text);
	    };

	    /**
	     *  Arc command!
	     */
	    Context.prototype.arc = function (x, y, radius, startAngle, endAngle, counterClockwise) {
	        // in canvas no circle is drawn if no angle is provided.
	        if (startAngle === endAngle) {
	            return;
	        }
	        startAngle = startAngle % (2*Math.PI);
	        endAngle = endAngle % (2*Math.PI);
	        if (startAngle === endAngle) {
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
	        if (diff < 0) {
	            diff += 2*Math.PI;
	        }

	        if (counterClockwise) {
	            largeArcFlag = diff > Math.PI ? 0 : 1;
	        } else {
	            largeArcFlag = diff > Math.PI ? 1 : 0;
	        }

	        var scaleX = Math.hypot(this.__transformMatrix.a, this.__transformMatrix.b);
	        var scaleY = Math.hypot(this.__transformMatrix.c, this.__transformMatrix.d);

	        this.lineTo(startX, startY);
	        this.__addPathCommand(format("A {rx} {ry} {xAxisRotation} {largeArcFlag} {sweepFlag} {endX} {endY}",
	            {
	                rx:radius * scaleX,
	                ry:radius * scaleY,
	                xAxisRotation:0,
	                largeArcFlag:largeArcFlag,
	                sweepFlag:sweepFlag,
	                endX: this.__matrixTransform(endX, endY).x,
	                endY: this.__matrixTransform(endX, endY).y
	            }));

	        this.__currentPosition = {x: endX, y: endY};
	    };

	    /**
	     *  Ellipse command!
	     */
	     Context.prototype.ellipse = function(x, y, radiusX, radiusY, rotation, startAngle, endAngle, counterClockwise) {
	        if (startAngle === endAngle) {
	            return;
	        }

	        var transformedCenter = this.__matrixTransform(x, y);
	        x = transformedCenter.x;
	        y = transformedCenter.y;
	        var scale = this.__getTransformScale();
	        radiusX = radiusX * scale.x;
	        radiusY = radiusY * scale.y;
	        rotation = rotation + this.__getTransformRotation();

	        startAngle = startAngle % (2*Math.PI);
	        endAngle = endAngle % (2*Math.PI);
	        if(startAngle === endAngle) {
	            endAngle = ((endAngle + (2*Math.PI)) - 0.001 * (counterClockwise ? -1 : 1)) % (2*Math.PI);
	        }
	        var endX = x + Math.cos(-rotation) * radiusX * Math.cos(endAngle)
	                     + Math.sin(-rotation) * radiusY * Math.sin(endAngle),
	            endY = y - Math.sin(-rotation) * radiusX * Math.cos(endAngle)
	                     + Math.cos(-rotation) * radiusY * Math.sin(endAngle),
	            startX = x + Math.cos(-rotation) * radiusX * Math.cos(startAngle)
	                       + Math.sin(-rotation) * radiusY * Math.sin(startAngle),
	            startY = y - Math.sin(-rotation) * radiusX * Math.cos(startAngle)
	                       + Math.cos(-rotation) * radiusY * Math.sin(startAngle),
	            sweepFlag = counterClockwise ? 0 : 1,
	            largeArcFlag = 0,
	            diff = endAngle - startAngle;

	        if(diff < 0) {
	            diff += 2*Math.PI;
	        }

	        if(counterClockwise) {
	            largeArcFlag = diff > Math.PI ? 0 : 1;
	        } else {
	            largeArcFlag = diff > Math.PI ? 1 : 0;
	        }

	        // Transform is already applied, so temporarily remove since lineTo
	        // will apply it again.
	        var currentTransform = this.__transformMatrix;
	        this.resetTransform();
	        this.lineTo(startX, startY);
	        this.__transformMatrix = currentTransform;

	        this.__addPathCommand(format("A {rx} {ry} {xAxisRotation} {largeArcFlag} {sweepFlag} {endX} {endY}",
	            {
	                rx:radiusX, 
	                ry:radiusY, 
	                xAxisRotation:rotation*(180/Math.PI), 
	                largeArcFlag:largeArcFlag, 
	                sweepFlag:sweepFlag, 
	                endX:endX,
	                endY:endY
	            }));

	        this.__currentPosition = {x: endX, y: endY};
	    };

	    /**
	     * Generates a ClipPath from the clip command.
	     */
	    Context.prototype.clip = function () {
	        var group = this.__closestGroupOrSvg(),
	            clipPath = this.__createElement("clipPath"),
	            id =  randomString(this.__ids),
	            newGroup = this.__createElement("g");

	        this.__applyCurrentDefaultPath();
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
	    Context.prototype.drawImage = function () {
	        //convert arguments to a real array
	        var args = Array.prototype.slice.call(arguments),
	            image=args[0],
	            dx, dy, dw, dh, sx=0, sy=0, sw, sh, parent, svg, defs, group,
	            svgImage, canvas, context, id;

	        if (args.length === 3) {
	            dx = args[1];
	            dy = args[2];
	            sw = image.width;
	            sh = image.height;
	            dw = sw;
	            dh = sh;
	        } else if (args.length === 5) {
	            dx = args[1];
	            dy = args[2];
	            dw = args[3];
	            dh = args[4];
	            sw = image.width;
	            sh = image.height;
	        } else if (args.length === 9) {
	            sx = args[1];
	            sy = args[2];
	            sw = args[3];
	            sh = args[4];
	            dx = args[5];
	            dy = args[6];
	            dw = args[7];
	            dh = args[8];
	        } else {
	            throw new Error("Invalid number of arguments passed to drawImage: " + arguments.length);
	        }

	        parent = this.__closestGroupOrSvg();
	        const matrix = this.getTransform().translate(dx, dy);
	        if (image instanceof Context) {
	            //canvas2svg mock canvas context. In the future we may want to clone nodes instead.
	            //also I'm currently ignoring dw, dh, sw, sh, sx, sy for a mock context.
	            svg = image.getSvg().cloneNode(true);
	            if (svg.childNodes && svg.childNodes.length > 1) {
	                defs = svg.childNodes[0];
	                while(defs.childNodes.length) {
	                    id = defs.childNodes[0].getAttribute("id");
	                    this.__ids[id] = id;
	                    this.__defs.appendChild(defs.childNodes[0]);
	                }
	                group = svg.childNodes[1];
	                if (group) {
	                    this.__applyTransformation(group, matrix);
	                    parent.appendChild(group);
	                }
	            }
	        } else if (image.nodeName === "CANVAS" || image.nodeName === "IMG") {
	            //canvas or image
	            svgImage = this.__createElement("image");
	            svgImage.setAttribute("width", dw);
	            svgImage.setAttribute("height", dh);
	            svgImage.setAttribute("preserveAspectRatio", "none");

	            if (sx || sy || sw !== image.width || sh !== image.height) {
	                //crop the image using a temporary canvas
	                canvas = this.__document.createElement("canvas");
	                canvas.width = dw;
	                canvas.height = dh;
	                context = canvas.getContext("2d");
	                context.drawImage(image, sx, sy, sw, sh, 0, 0, dw, dh);
	                image = canvas;
	            }
	            this.__applyTransformation(svgImage, matrix);
	            svgImage.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href",
	                image.nodeName === "CANVAS" ? image.toDataURL() : image.getAttribute("src"));
	            parent.appendChild(svgImage);
	        }
	    };

	    /**
	     * Generates a pattern tag
	     */
	    Context.prototype.createPattern = function (image, repetition) {
	        var pattern = this.__document.createElementNS("http://www.w3.org/2000/svg", "pattern"), id = randomString(this.__ids),
	            img;
	        pattern.setAttribute("id", id);
	        pattern.setAttribute("width", image.width);
	        pattern.setAttribute("height", image.height);
	        // We want the pattern sizing to be absolute, and not relative
	        // https://developer.mozilla.org/en-US/docs/Web/SVG/Tutorial/Patterns
	        // https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/patternUnits
	        pattern.setAttribute("patternUnits", "userSpaceOnUse");

	        if (image.nodeName === "CANVAS" || image.nodeName === "IMG") {
	            img = this.__document.createElementNS("http://www.w3.org/2000/svg", "image");
	            img.setAttribute("width", image.width);
	            img.setAttribute("height", image.height);
	            img.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href",
	                image.nodeName === "CANVAS" ? image.toDataURL() : image.getAttribute("src"));
	            pattern.appendChild(img);
	            this.__defs.appendChild(pattern);
	        } else if (image instanceof Context) {
	            pattern.appendChild(image.__root.childNodes[1]);
	            this.__defs.appendChild(pattern);
	        }
	        return new CanvasPattern(pattern, this);
	    };

	    Context.prototype.setLineDash = function (dashArray) {
	        if (dashArray && dashArray.length > 0) {
	            this.lineDash = dashArray.join(",");
	        } else {
	            this.lineDash = null;
	        }
	    };

	    /**
	     * SetTransform changes the current transformation matrix to
	     * the matrix given by the arguments as described below.
	     *
	     * @see https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/setTransform
	     */
	    Context.prototype.setTransform = function (a, b, c, d, e, f) {
	        if (a instanceof DOMMatrix) {
	            this.__transformMatrix = new DOMMatrix([a.a, a.b, a.c, a.d, a.e, a.f]);
	        } else {
	            this.__transformMatrix = new DOMMatrix([a, b, c, d, e, f]);
	        }
	    };

	    /**
	     * GetTransform Returns a copy of the current transformation matrix,
	     * as a newly created DOMMAtrix Object
	     *
	     * @returns A DOMMatrix Object
	     */
	    Context.prototype.getTransform = function () {
	        let {a, b, c, d, e, f} = this.__transformMatrix;
	        return new DOMMatrix([a, b, c, d, e, f]);
	    };

	    /**
	     * ResetTransform resets the current transformation matrix to the identity matrix
	     *
	     * @see https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/resetTransform
	     */
	    Context.prototype.resetTransform = function () {
	        this.setTransform(1, 0, 0, 1, 0, 0);
	    };

	    /**
	     * Add the scaling transformation described by the arguments to the current transformation matrix.
	     *
	     * @param x The x argument represents the scale factor in the horizontal direction
	     * @param y The y argument represents the scale factor in the vertical direction.
	     * @see https://html.spec.whatwg.org/multipage/canvas.html#dom-context-2d-scale
	     */
	    Context.prototype.scale = function (x, y) {
	        if (y === undefined) {
	            y = x;
	        }
	        // If either of the arguments are infinite or NaN, then return.
	        if (isNaN(x) || isNaN(y) || !isFinite(x) || !isFinite(y)) {
	            return
	        }
	        let matrix = this.getTransform().scale(x, y);
	        this.setTransform(matrix);
	    };

	    /**
	     * Rotate adds a rotation to the transformation matrix.
	     *
	     * @param angle The rotation angle, clockwise in radians. You can use degree * Math.PI / 180 to calculate a radian from a degree.
	     * @see https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/rotate
	     * @see https://www.w3.org/TR/css-transforms-1
	     */
	    Context.prototype.rotate = function (angle) {
	        let matrix = this.getTransform().multiply(new DOMMatrix([
	            Math.cos(angle),
	            Math.sin(angle),
	            -Math.sin(angle),
	            Math.cos(angle),
	            0,
	            0
	        ]));
	        this.setTransform(matrix);
	    };

	    /**
	     * Translate adds a translation transformation to the current matrix.
	     *
	     * @param x Distance to move in the horizontal direction. Positive values are to the right, and negative to the left.
	     * @param y Distance to move in the vertical direction. Positive values are down, and negative are up.
	     * @see https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/translate
	     */
	    Context.prototype.translate = function (x, y) {
	        const matrix = this.getTransform().translate(x, y);
	        this.setTransform(matrix);
	    };

	    /**
	     * Transform multiplies the current transformation with the matrix described by the arguments of this method.
	     * This lets you scale, rotate, translate (move), and skew the context.
	     *
	     * @see https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/transform
	     */
	    Context.prototype.transform = function (a, b, c, d, e, f) {
	        const matrix = this.getTransform().multiply(new DOMMatrix([a, b, c, d, e, f]));
	        this.setTransform(matrix);
	    };

	    Context.prototype.__matrixTransform = function(x, y) {
	        return new DOMPoint(x, y).matrixTransform(this.__transformMatrix)
	    };

	    /**
	     * 
	     * @returns The scale component of the transform matrix as {x,y}.
	     */
	    Context.prototype.__getTransformScale = function() {
	        return {
	            x: Math.hypot(this.__transformMatrix.a, this.__transformMatrix.b),
	            y: Math.hypot(this.__transformMatrix.c, this.__transformMatrix.d)
	        };
	    };

	    /**
	     * 
	     * @returns The rotation component of the transform matrix in radians.
	     */
	    Context.prototype.__getTransformRotation = function() {
	        return Math.atan2(this.__transformMatrix.b, this.__transformMatrix.a);
	    };

	    /**
	     *
	     * @param {*} sx The x-axis coordinate of the top-left corner of the rectangle from which the ImageData will be extracted.
	     * @param {*} sy The y-axis coordinate of the top-left corner of the rectangle from which the ImageData will be extracted.
	     * @param {*} sw The width of the rectangle from which the ImageData will be extracted. Positive values are to the right, and negative to the left.
	     * @param {*} sh The height of the rectangle from which the ImageData will be extracted. Positive values are down, and negative are up.
	     * @param {Boolean} options.async Will return a Promise<ImageData> if true, must be set to true
	     * @returns An ImageData object containing the image data for the rectangle of the canvas specified. The coordinates of the rectangle's top-left corner are (sx, sy), while the coordinates of the bottom corner are (sx + sw, sy + sh).
	     */
	    Context.prototype.getImageData = function(sx, sy, sw, sh, options) {
	        return utils.getImageData(this.getSvg(), this.width, this.height, sx, sy, sw, sh, options);
	    };

	    /**
	     * Not yet implemented
	     */
	    Context.prototype.drawFocusRing = function () {};
	    Context.prototype.createImageData = function () {};
	    Context.prototype.putImageData = function () {};
	    Context.prototype.globalCompositeOperation = function () {};

	    return Context;
	}());

	function SVGCanvasElement(options) {

	    this.ctx = new Context(options);
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

	    Object.defineProperty(this, 'tagName', {
	        get: function() {
	            return "CANVAS";
	        },
	        set: function() {} // no-op
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
	                _this.ctx[prop] = val;
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

	SVGCanvasElement.prototype.getContext = function(type) {
	    if (type !== '2d') {
	        throw new Error('Unsupported type of context for SVGCanvas');
	    }

	    return this.ctx;
	};

	// you should always use URL.revokeObjectURL after your work done
	SVGCanvasElement.prototype.toObjectURL = function() {
	    var data = new XMLSerializer().serializeToString(this.svg);
	    var svg = new Blob([data], {type: 'image/svg+xml;charset=utf-8'});
	    return URL.createObjectURL(svg);
	};

	/**
	 * toDataURL returns a data URI containing a representation of the image in the format specified by the type parameter.
	 * 
	 * @param {String} type A DOMString indicating the image format. The default type is image/svg+xml; this image format will be also used if the specified type is not supported.
	 * @param {Number} encoderOptions A Number between 0 and 1 indicating the image quality to be used when creating images using file formats that support lossy compression (such as image/jpeg or image/webp). A user agent will use its default quality value if this option is not specified, or if the number is outside the allowed range.
	 * @param {Boolean} options.async Will return a Promise<String> if true, must be set to true if type is not image/svg+xml
	 */
	SVGCanvasElement.prototype.toDataURL = function(type, encoderOptions, options) {
	    return utils.toDataURL(this.svg, this.width, this.height, type, encoderOptions, options)
	};

	SVGCanvasElement.prototype.addEventListener = function() {
	    return this.svg.addEventListener.apply(this.svg, arguments);
	};

	// will return wrapper element: <div><svg></svg></div>
	SVGCanvasElement.prototype.getElement = function() {
	    return this.wrapper;
	};

	SVGCanvasElement.prototype.getAttribute = function(prop) {
	    return this.wrapper.getAttribute(prop);
	};

	SVGCanvasElement.prototype.setAttribute = function(prop, val) {
	    this.wrapper.setAttribute(prop, val);
	};

	svgcanvas.Context = Context;
	var Element = svgcanvas.Element = SVGCanvasElement;

	const config = {
	    pixelDensity: 3 // for 200% and 150%
	};

	// count non transparent pixels
	var countPixels = function (imgData) {
	    var count = 0;
	    for (var i = 3; i < imgData.data.length; i += 4) {
	        if (imgData.data[i] > 0) {
	            count++;
	        }
	    }
	    return count
	};

	var p5$2 = window.p5;

	class RendererTester {
	    // init p5 canvas instance and p5-svg instance
	    constructor() {
	        this.p5svg = new p5$2(function (p) {
	            p.setup = function () {
	                p.createCanvas(100, 100, p.SVG);
	                p.noLoop();
	                p.isSVG = true;
	                p.__ready = true;
	            };
	        });
	        this.p5canvas = new p5$2(function (p) {
	            p.setup = function () {
	                p.createCanvas(100, 100);
	                p.noLoop();
	                p.isSVG = false;
	                p.__ready = true;
	            };
	        });
	        this.pInstances = [this.p5svg, this.p5canvas];
	        this.maxPixelDiff = 0;
	        this.maxDiff = 0.05;
	    }

	    // wait until ready
	    async ready() {
	        while (true) {
	            if (this.p5svg.__ready && this.p5canvas.__ready) {
	                break
	            }
	            await new Promise((resolve) => setTimeout(resolve, 1000));
	        }
	    }

	    async test(options = {
	        draw: async (p, info) => { },
	        before: async (p, info) => { }
	    }) {
	        await this.ready();
	        // Set options
	        this.maxPixelDiff = 0;
	        this.maxDiff = 0.05;
	        this.waitUntil = 0;
	        // Draw
	        for (let p of this.pInstances) {
	            // reset
	            this.resetCanvas(p);
	            let info = {
	                renderer: p === this.p5svg ? 'svg' : 'canvas'
	            };
	            // Apply before
	            if (options.before) {
	                await options.before(p, info);
	            }
	            // Apply draw
	            await options.draw(p, info);
	        }
	        // Wait
	        while (Date.now() < this.waitUntil) {
	            await new Promise((resolve) => setTimeout(resolve, 100));
	        }
	        // Pixels
	        const svg = Element.prototype.toDataURL.call({ svg: this.p5svg._renderer.svg }, 'image/svg+xml');
	        const svgImage = await new Promise((resolve) => {
	            var svgImage = new Image();
	            svgImage.onload = function () {
	                resolve(svgImage);
	            };
	            svgImage.src = svg;
	        });
	        const svgPixels = this.getPixels(svgImage);
	        const canvasPixels = this.getPixels(this.p5canvas._curElement.elt);
	        const diffPixels = this.diffPixels(svgPixels, canvasPixels);
	        const removeThinLinesPixels = this.removeThinLines(this.removeThinLines(diffPixels));
	        // Report
	        const count = Math.max(countPixels(svgPixels), countPixels(canvasPixels));
	        const diffCount = countPixels(removeThinLinesPixels);
	        const diffRate = diffCount === 0 ? 0 : diffCount / count;
	        const match = diffRate <= this.maxDiff;
	        const fn = options.draw.toString();
	        await this.report({ canvasPixels, svgPixels, diffPixels, removeThinLinesPixels, svg, match, fn, diffRate });
	    }

	    getPixels(image) {
	        const canvas = document.createElement('canvas');
	        const width = 100 * config.pixelDensity;
	        const height = 100 * config.pixelDensity;
	        canvas.width = width;
	        canvas.height = height;
	        const ctx = canvas.getContext('2d');
	        ctx.drawImage(image, 0, 0, width, height);
	        return ctx.getImageData(0, 0, width, height)
	    }

	    diffPixels(imgData1, imgData2) {
	        const canvas = document.createElement('canvas');
	        const width = 100 * config.pixelDensity;
	        const height = 100 * config.pixelDensity;
	        const diffImgData = canvas.getContext('2d').getImageData(0, 0, width, height);
	        let $this = this;
	        for (var i = 0; i < imgData1.data.length; i += 4) {
	            var indexes = [i, i + 1, i + 2, i + 3];
	            indexes.forEach(function (i) {
	                diffImgData.data[i] = 0;
	            });
	            if (indexes.some(function (i) {
	                return Math.abs(imgData1.data[i] - imgData2.data[i]) > $this.maxPixelDiff
	            })) {
	                diffImgData.data[i + 3] = 255; // set black
	            }
	        }
	        return diffImgData
	    }

	    removeThinLines(imageData) {
	        const canvas = document.createElement('canvas');
	        const width = 100 * config.pixelDensity;
	        const height = 100 * config.pixelDensity;
	        canvas.width = width;
	        canvas.height = height;
	        const ctx = canvas.getContext('2d');
	        ctx.putImageData(imageData, 0, 0);
	        var imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
	        var imgDataCopy = ctx.getImageData(0, 0, canvas.width, canvas.height);

	        var getPixelIndex = function (x, y) {
	            return (y * width + x) * 4 + 3
	        };

	        var getPixel = function (x, y) {
	            var alphaIndex = getPixelIndex(x, y);
	            return imgDataCopy.data[alphaIndex]
	        };

	        var setPixel = function (x, y, value) {
	            imgData.data[getPixelIndex(x, y)] = value;
	        };

	        for (var x = 1; x < width - 1; x++) {
	            for (var y = 1; y < height - 1; y++) {
	                if (getPixel(x, y) == 0) {
	                    continue // ignore transparents
	                }
	                var links = [
	                    { x: x - 1, y: y - 1 },
	                    { x: x, y: y - 1 },
	                    { x: x + 1, y: y - 1 },
	                    { x: x - 1, y: y },
	                    { x: x + 1, y: y },
	                    { x: x - 1, y: y + 1 },
	                    { x: x, y: y + 1 },
	                    { x: x + 1, y: y + 1 }
	                ].map(function (p) {
	                    return getPixel(p.x, p.y)
	                }).filter(function (val) {
	                    return val > 0 // not transparent?
	                }).length;

	                if (links < 6) { // thin line
	                    setPixel(x, y, 0); // make it transparent
	                }
	            }
	        }
	        return imgData
	    }

	    getReportContainer() {
	        return document.querySelector('#test-graph')
	    }

	    async report({ canvasPixels, svgPixels, diffPixels, removeThinLinesPixels, svg, match, fn, diffRate }) {
	        const container = this.getReportContainer();
	        if (container) {
	            // width & height
	            const width = 100 * config.pixelDensity;
	            const height = 100 * config.pixelDensity;

	            const report = document.createElement('div');
	            report.innerHTML = `
                <div class="th">
                    <div>Rendered in SVG</div>
                    <div>Rendered in Canvas</div>
                    <div>Diff Bitmap</div>
                    <div>Diff Bitmap with thin line removed (8-connected neighborhood < 6)</div>
                    <div></div>
                </div>
                <canvas class="svg-pixels" width="${width}" height="${height}"></canvas>
                <canvas class="canvas-pixels" width="${width}" height="${height}"></canvas>
                <canvas class="diff-pixels" width="${width}" height="${height}"></canvas>
                <canvas class="diff-pixels-2" width="${width}" height="${height}"></canvas>
                <div class="match">
                    <i class="fa ${match ? 'fa-check' : 'fa-times'}"></i>
                </div>
                <hr>
                `;

	            container.appendChild(report);

	            report.querySelector('.svg-pixels').getContext('2d').putImageData(svgPixels, 0, 0);
	            report.querySelector('.canvas-pixels').getContext('2d').putImageData(canvasPixels, 0, 0);
	            report.querySelector('.diff-pixels').getContext('2d').putImageData(diffPixels, 0, 0);
	            report.querySelector('.diff-pixels-2').getContext('2d').putImageData(removeThinLinesPixels, 0, 0);
	        }

	        if (!match) {
	            throw new Error(JSON.stringify({
	                diffRate,
	            }))
	        }
	    }

	    resetCanvas(p) {
	        // clean up
	        p.clear();
	        p.noFill();
	        p.noStroke();
	        // reset
	        p.strokeWeight(3); // for using XOR with thin line removed (using 8-connected neighborhood < 5) for diff
	        p.fill(0);
	        p.fill(200); // fill has cache, update twice to force reset ctx.fillStyle
	        p.stroke(0);
	        p.ellipseMode(p.CENTER);
	        p.rectMode(p.CORNER);
	        p.smooth();
	        p.pixelDensity(config.pixelDensity);
	        p.resizeCanvas(100, 100);
	    }

	}

	const rendererTester = new RendererTester();


	var testRender = async function (draw, callback) {
	    try {
	        callback(await rendererTester.test({ draw }));
	    } catch (e) {
	        callback(e);
	    }
	};

	testRender.describe = function (str) {
	    const container = rendererTester.getReportContainer();
	    if (container) {
	        let h2 = document.createElement('h2');
	        h2.innerText = str;
	        container.appendChild(h2);
	    }
	};

	testRender.setMaxDiff = function (max) {
	    rendererTester.maxDiff = max;
	};

	testRender.setMaxPixelDiff = function (max) {
	    rendererTester.maxPixelDiff = max;
	};

	testRender.wait = function (ms) {
	    rendererTester.waitUntil = Date.now() + ms;
	};

	// add lock so testRender will wait
	testRender.lock = function () {
	    testRender.wait(1000 * 1000 * 1000);
	};

	// remove lock
	testRender.unlock = function () {
	    testRender.wait(0);
	};

	const p5$1 = window.p5;

	describe('Typography', function () {
	    this.timeout(0);

	    // https://p5js.org/reference/#/p5/loadFont
	    describe('loadFont', function () {
	        it('should load font', async function () {
	            let myFont;
	            await rendererTester.test({
	                before: async function (p) {
	                    myFont = await new Promise((resolve, reject) => {
	                        p.loadFont('https://unpkg.com/font-awesome@4.7.0/fonts/FontAwesome.otf', resolve, reject);
	                    });
	                },
	                draw: function (p) {
	                    p.fill('#ED225D');
	                    p.textFont(myFont);
	                    p.textSize(36);
	                    p.text('\uf092', 10, 50);
	                }
	            });
	        });
	    });

	});

	window.TESTIMG = window.__karma__ ? '/base/test/unit/filter/light_by_zenozeng.jpg' : './unit/filter/light_by_zenozeng.jpg';

	describe('Basic', function () {

	    var tests = {
	        resetMatrix: function (p) {
	            p.applyMatrix(1, 0, 0, 1, 50, 50);
	            p.rect(0, 0, 50, 50);
	            p.resetMatrix();
	            p.rect(0, 0, 20, 20);
	        },
	        push: function (p) {
	            // https://p5js.org/reference/#/p5/push
	            p.ellipse(0, 50, 33, 33);
	            p.push();
	            p.strokeWeight(10);
	            p.fill(204, 153, 0);
	            p.translate(50, 0);
	            p.ellipse(0, 50, 33, 33);
	            p.pop();
	            p.ellipse(100, 50, 33, 33);
	        }
	    };

	    Object.keys(tests).forEach(function (key) {
	        describe('Basic/' + key, function () {
	            it(key + ': SVG API should draw same image as Canvas API', function (done) {
	                this.timeout(0);
	                testRender.describe('Basic/' + key);
	                testRender(tests[key], done);
	            });
	        });
	    });

	});

	window.TESTIMG = window.__karma__ ? '/base/test/unit/filter/light_by_zenozeng.jpg' : './unit/filter/light_by_zenozeng.jpg';

	describe('Filters', function () {

	    var tests = {
	        // in SVG Renderer, I use feGaussianBlur,
	        // but Canvas Renderer uses a pixels based blur (port of processing's blur),
	        // so the results may not be exactly same.
	        blur: function (p) {
	            testRender.setMaxDiff(1); // ignore diff, see known issue
	            testRender.setMaxPixelDiff(2);
	            p.background(255);
	            p.stroke(255, 0, 0);
	            p.strokeWeight(10);
	            p.line(0, 0, 100, 100);
	            p.line(0, 100, 100, 0);
	            p.filter(p.BLUR, 5);
	        },
	        gray: function (p) {
	            testRender.setMaxPixelDiff(1);
	            p.background(200, 100, 50);
	            p.filter(p.GRAY);
	        },
	        invert: function (p) {
	            testRender.setMaxPixelDiff(1);
	            p.background(255, 0, 0);
	            p.filter(p.INVERT);
	            p.ellipse(50, 50, 50, 50);
	        },
	        threshold: function (p) {
	            p.background(255, 0, 0);
	            p.stroke(255);
	            p.strokeWeight(10);
	            p.line(0, 0, 100, 100);
	            p.filter(p.THRESHOLD, 0.5);
	        },
	        opaque: function (p) {
	            testRender.setMaxPixelDiff(1);
	            p.background(255, 0, 0, 127);
	            p.filter(p.OPAQUE); // Sets the alpha channel to 255
	        },
	        posterize: function (p) {
	            testRender.lock();
	            testRender.setMaxDiff(1); // ignore diff, see https://github.com/zenozeng/p5.js-svg/issues/124
	            p.loadImage(TESTIMG, function (img) {
	                p.image(img, 0, 0);
	                p.filter(p.POSTERIZE, 2);
	                testRender.unlock();
	            });
	        },
	        erode: function (p) {
	            testRender.lock();
	            testRender.setMaxDiff(1); // ignore diff, see known issue
	            p.loadImage(TESTIMG, function (img) {
	                p.image(img, 0, 0);
	                p.filter(p.ERODE);
	                testRender.unlock();
	            });
	        },
	        dilate: function (p) {
	            testRender.lock();
	            testRender.setMaxDiff(1); // ignore diff, see known issue
	            p.loadImage(TESTIMG, function (img) {
	                p.image(img, 0, 0);
	                p.filter(p.DILATE);
	                testRender.unlock();
	            });
	        },
	        custom: function (p) {
	            testRender.setMaxPixelDiff(1);
	            p.background(200, 100, 50);
	            p.registerSVGFilter('mygray', p5.SVGFilters.gray);
	            if (p.isSVG) {
	                p.filter('mygray');
	            } else {
	                p.filter(p.GRAY);
	            }
	        }
	    };

	    Object.keys(tests).forEach(function (key) {
	        describe('Filters/' + key, function () {
	            it(key + ': SVG API should draw same image as Canvas API', function (done) {
	                this.timeout(0);
	                testRender.describe('Filters/' + key);
	                testRender(tests[key], done);
	            });
	        });
	    });

	});

	describe('SVG Element API', function () {
	    it('querySVG', function () {
	        new p5$1(function (p) {
	            p.setup = function () {
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

	var SVGDataURL = 'data:image/svg+xml;charset=utf-8,<svg%20version%3D"1.1"%20xmlns%3D"http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg"%20xmlns%3Axlink%3D"http%3A%2F%2Fwww.w3.org%2F1999%2Fxlink"%20width%3D"100"%20height%3D"100"%20viewBox%3D"0%200%20100%20100"><defs%2F><g%20transform%3D"scale(1%2C1)"%2F><g><path%20fill%3D"none"%20stroke%3D"rgb(0%2C0%2C0)"%20paint-order%3D"fill%20stroke%20markers"%20d%3D"%20M%200%200%20L%20100%20100"%20stroke-opacity%3D"1"%20stroke-linecap%3D"round"%20stroke-miterlimit%3D"10"%20stroke-width%3D"10"%2F><g%20transform%3D"translate(0.5%2C0.5)"><path%20fill%3D"none"%20stroke%3D"rgb(0%2C0%2C0)"%20paint-order%3D"fill%20stroke%20markers"%20d%3D"%20M%200%200%20L%2050%20100"%20stroke-opacity%3D"1"%20stroke-linecap%3D"round"%20stroke-miterlimit%3D"10"%20stroke-width%3D"5"%2F><g%20transform%3D"translate(-0.5%2C-0.5)"%2F><%2Fg><%2Fg><%2Fsvg>';

	var SVGHTTPURL = window.__karma__ ? '/base/test/unit/svg/test.svg' : './unit/svg/test.svg';

	describe('SVG Manipulating API', function () {
	    it('Manipulate SVG', function (done) {
	        new p5$1(function (p) {
	            var svg;
	            var svg2;
	            p.preload = function () {
	                svg = p.loadSVG(SVGDataURL);
	                svg2 = p.loadSVG(SVGHTTPURL);
	            };
	            p.setup = function () {
	                svg2.query('path')[0].attribute('stroke-width', 100);
	                var pg = p.createGraphics(400, 400, p.SVG);
	                pg.image(svg, 0, 0, 400, 400);
	                var paths = pg.querySVG('path');
	                try {
	                    assert.equal(paths.length, 2);
	                    paths[0].attribute('stroke-width', 1);
	                    assert.equal(paths[0].attribute('stroke-width'), 1);
	                    pg.image(svg2, 0, 0);
	                    assert.equal(pg.querySVG('path')[2].attribute('stroke-width'),
	                        100);
	                    done();
	                } catch (e) {
	                    done(e);
	                }
	            };
	        });
	    });
	});

	describe('Rendering', function () {
	    this.timeout(0);

	    describe('noCanvas', function () {
	        it('should remove the <svg> created by createCanvas', function () {
	            new p5$1(function (p) {
	                p.setup = function () {
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
	    describe('createGraphics', function () {
	        it('createGraphics: SVG API should draw same image as Canvas API', async function () {
	            testRender.describe('createGraphics');
	            await rendererTester.test({
	                draw: function (p) {
	                    let pg = p.createGraphics(100, 100, p.isSVG ? p.SVG : p.P2D);
	                    p.background('blue');
	                    pg.background('red');
	                    pg.fill('yellow');
	                    pg.noStroke();
	                    pg.ellipse(pg.width / 2, pg.height / 2, 50, 50);
	                    p.image(pg, 50, 50);
	                    p.image(pg, 0, 0, 50, 50);
	                }
	            });
	        });
	        it('createGraphics: should be able to call querySVG on p5.Graphics instance', function () {
	            new p5$1(function (p) {
	                p.setup = function () {
	                    p.createCanvas(100, 100, p.SVG);
	                    let pg = p.createGraphics(100, 100, p.SVG);
	                    pg.ellipse(0, 0, 100, 100);
	                    expect(pg.querySVG('path')).to.have.lengthOf(1);
	                };
	            });
	        });
	    });
	    describe('resizeCanvas', function () {
	        it('resizeCanvas: should be scaled', function (done) {
	            testRender.describe('resizeCanvas: scaled');
	            testRender(function (p) {
	                p.resizeCanvas(200, 200);
	                p.strokeWeight(10);
	                p.ellipse(p.width / 2, p.height / 2, 50, 50);
	            }, done);
	        });
	        it('resizeCanvas: all pixels should be cleared after resize', function (done) {
	            testRender.describe('resizeCanvas: all pixels cleared');
	            testRender(function (p) {
	                p.ellipse(p.width / 2, p.height / 2, 50, 50);
	                p.resizeCanvas(200, 200);
	                p.resizeCanvas(100, 100);
	                p.strokeWeight(10);
	                p.ellipse(0, 0, 100, 100);
	            }, done);
	        });
	    });

	    describe('pixels', function () {
	        it('loadPixels: should be able to get pixel colors', async function () {
	            testRender.describe('loadPixels');
	            await rendererTester.test({
	                draw: async function (p) {
	                    p.background('red');
	                    p.ellipse(50, 50, 100);
	                    await p.loadPixels();
	                    p.fill(255 - p.pixels[0], 255 - p.pixels[1], 255 - p.pixels[2]);
	                    p.ellipse(0, 0, 100, 100);
	                }
	            });
	        });
	    });

	    describe('customGradient', function () {
	        it('customGradient', async function () {
	            testRender.describe('customGradient');
	            await rendererTester.test({
	                draw: function (p, { renderer }) {
	                    let pg = p.createGraphics(100, 100, p.isSVG ? p.SVG : p.P2D);
	                    p.background('blue');
	                    pg.background('red');
	                    pg.noStroke();
	                    p.image(pg, 50, 50);
	                    p.image(pg, 0, 0, 50, 50);

	                    // customGradient
	                    let width = p.width;
	                    let color1 = p.color('rgb(255,0,0)');
	                    let color2 = p.color('rgb(0,255,0)');
	                    let gradient = p.drawingContext.createLinearGradient(width / 2 - 100, width / 2 - 100, width / 2 + 100, width / 2 + 100);
	                    gradient.addColorStop(0, color1);
	                    gradient.addColorStop(1, color2);
	                    p.drawingContext.fillStyle = gradient;
	                    p.noStroke();
	                    p.ellipse(50, 50, 100);
	                }
	            });
	        });
	    });

	    describe('clear', () => {
	        it('clear after resizing should not have unwanted white background', async () => {
	            // https://github.com/zenozeng/p5.js-svg/issues/235
	            testRender.describe('clear after resize');
	            await rendererTester.test({
	                draw: function (p) {
	                    p.resizeCanvas(110, 100);
	                    p.clear();
	                }
	            });
	        });
	    });
	});

	describe('IO/saveFrames', function () {
	    it('should capture canvas frames', function (done) {
	        this.timeout(0);
	        new p5$1(function (p) {
	            p.setup = function () {
	                p.createCanvas(100, 100);
	                p.strokeWeight(3);
	                p.saveFrames('hello', 'png', 3, 10, function (frames) {
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
	            p.draw = function () {
	                var i = p.frameCount * 2;
	                p.line(0, 0, i, i);
	            };
	        });
	    });

	    it('should capture svg frames', function (done) {
	        this.timeout(0);
	        new p5$1(function (p) {
	            p.setup = function () {
	                p.createCanvas(100, 100, p.SVG);
	                p.strokeWeight(3);
	                p.saveFrames('hello', 'svg', 0.5, 10, function (frames) {
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
	            p.draw = function () {
	                var i = p.frameCount * 2;
	                p.line(0, 0, i, i);
	            };
	        });
	    });

	    it('should capture svg frames even omitting duration and fps', function (done) {
	        this.timeout(0);
	        new p5$1(function (p) {
	            p.setup = function () {
	                p.createCanvas(100, 100, p.SVG);
	                p.strokeWeight(3);
	                p.saveFrames('hello', 'svg', null, null, function (frames) {
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
	            p.draw = function () {
	                var i = p.frameCount * 2;
	                p.line(0, 0, i, i);
	            };
	        });
	    });

	    it('should download svg frames', function (done) {
	        this.timeout(0);
	        new p5$1(function (p) {
	            p.setup = function () {
	                p.createCanvas(100, 100, p.SVG);
	                var count = 0;
	                var _done;
	                p.downloadFile = function () {
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
	            p.draw = function () {
	                var i = p.frameCount * 2;
	                p.line(0, 0, i, i);
	            };
	        });
	    });

	    it('should wait all pending jobs done', function (done) {
	        this.timeout(0);
	        new p5$1(function (p) {
	            p.setup = function () {
	                p.createCanvas(100, 100, p.SVG);
	                var pending = 0;
	                var _makeSVGFrame = p._makeSVGFrame;
	                p._makeSVGFrame = function (options) {
	                    // slow version
	                    pending++;
	                    setTimeout(function () {
	                        _makeSVGFrame.call(p, options);
	                    }, 500);
	                };
	                p.downloadFile = function () {
	                    pending--;
	                    if (pending === 0) {
	                        p.noCanvas();
	                        done();
	                    }
	                };
	                p.saveFrames('hello', 'svg', 0.5, 10);
	            };
	            p.draw = function () {
	                var i = p.frameCount * 2;
	                p.line(0, 0, i, i);
	            };
	        });
	    });
	});

	var testDownload = function (filename, ext, fn, done, useCanvas) {
	    new p5$1(function (p) {
	        p.setup = function () {
	            p.createCanvas(100, 100, useCanvas ? p.P2D : p.SVG);
	            p.background(255);
	            p.stroke(0, 0, 0);
	            p.strokeWeight(3);
	            p.line(0, 0, 100, 100);

	            p.downloadFile = function (dataURL, _filename, _ext) {
	                try {
	                    assert.notEqual(dataURL.indexOf('image/octet-stream'), -1);
	                    assert.equal(_filename, filename);
	                    assert.equal(_ext, ext);
	                    p.noCanvas();
	                    done();
	                } catch (e) {
	                    p.noCanvas();
	                    done(e);
	                }
	            };
	            fn(p);
	        };
	    });
	};

	describe('IO/save', function () {
	    this.timeout(1000 * 5);

	    // See https://github.com/zenozeng/p5.js-svg/issues/176
	    it('should generate valid svg output', async function () {
	        const dataURL = await new Promise((resolve) => {
	            new p5$1((p) => {
	                p.setup = function () {
	                    p.createCanvas(600, 600, p.SVG);
	                    p.downloadFile = function (dataURL) {
	                        resolve(dataURL);
	                    };
	                };

	                p.draw = function () {
	                    p.rect(0, 0, 100, 100);
	                    p.line(30, 20, 85, 75);
	                    p.save();
	                    p.noLoop();
	                };
	            });
	        });
	        assert.equal(dataURL.indexOf('#'), -1);
	    });

	    it('save()', function (done) {
	        testDownload('untitled', 'svg', function (p) {
	            p.save();
	        }, done);
	    });

	    it('save(Graphics)', function (done) {
	        testDownload('untitled', 'svg', function (p) {
	            p.save(p._defaultGraphics);
	        }, done);
	    });

	    it('save(<svg>)', function (done) {
	        testDownload('untitled', 'svg', function (p) {
	            p.save(p._renderer.svg);
	        }, done);
	    });

	    it('canvas\'s save should still work', function (done) {
	        new p5$1(function (p) {
	            p.setup = function () {
	                var _saveCanvas = p5$1.prototype.saveCanvas;
	                p5$1.prototype.saveCanvas = function () {
	                    p5$1.prototype.saveCanvas = _saveCanvas;
	                    done();
	                };
	                p.save('canvas-save.png');
	            };
	        });
	    });
	});

	describe('IO/saveSVG', function () {

	    it('should save untitled.svg', function (done) {
	        testDownload('untitled', 'svg', function (p) {
	            p.saveSVG();
	        }, done);
	    });
	    it('should save hello.svg', function (done) {
	        testDownload('hello', 'svg', function (p) {
	            p.saveSVG('hello.svg');
	        }, done);
	    });
	    it('should save hello.jpg', function (done) {
	        testDownload('hello', 'jpg', function (p) {
	            p.saveSVG('hello', 'jpg');
	        }, done);
	    });
	    it('should save hello.jpeg', function (done) {
	        testDownload('hello', 'jpeg', function (p) {
	            p.saveSVG('hello.jpeg');
	        }, done);
	    });
	    it('should save hello.png', function (done) {
	        testDownload('hello', 'png', function (p) {
	            p.saveSVG('hello.png');
	        }, done);
	    });
	    it('source is Graphics', function (done) {
	        testDownload('source-graphics', 'png', function (p) {
	            var pg = p.createGraphics(100, 100, p.SVG);
	            pg.background(100);
	            p.saveSVG(pg, 'source-graphics.png');
	        }, done);
	    });
	    it('source is <svg>', function (done) {
	        testDownload('source-svg', 'png', function (p) {
	            var pg = p.createGraphics(100, 100, p.SVG);
	            pg.background(100);
	            p.saveSVG(pg._renderer.svg, 'source-svg.png');
	        }, done);
	    });
	    it('should throw if given unsupported type', function () {
	        new p5$1(function (p) {
	            p.setup = function () {
	                p.createCanvas(100, 100, p.SVG);
	                p.background(255);
	                p.stroke(0, 0, 0);
	                p.line(0, 0, 100, 100);
	                assert.throws(function () {
	                    p.saveSVG('hello.txt');
	                });
	                p.noCanvas();
	            };
	        });
	    });
	});

	describe('Shape/2d_primitives', function () {
	    // the tests code are from p5.js's example reference
	    var tests = {
	        arc: function (p) {
	            let { PI } = p;
	            p.arc(50, 55, 50, 50, 0, PI * 0.5);
	            p.noFill();
	            p.arc(50, 55, 60, 60, PI * 0.5, PI * 1.5);
	        },
	        circle: function (p) {
	            p.ellipse(56, 46, 55, 55);
	        },
	        ellipse: function (p) {
	            p.ellipse(56, 46, 55, 35);
	        },
	        line: function (p) {
	            p.strokeWeight(10);
	            p.line(30, 20, 85, 20);
	            p.stroke(126);
	            p.line(85, 20, 85, 75);
	            p.stroke(200);
	            p.line(85, 75, 30, 75);
	        },
	        point: function (p) {
	            p.point(30, 20);
	            p.point(85, 20);
	            p.point(85, 75);
	            p.point(30, 75);
	        },
	        quad: function (p) {
	            p.quad(38, 31, 86, 20, 69, 63, 30, 76);
	        },
	        rect: function (p) {
	            p.rect(30, 20, 55, 55);
	        },
	        roundRect: function (p) {
	            p.rect(30, 20, 55, 55, 20, 15, 10, 5);
	        },
	        triangle: function (p) {
	            p.triangle(30, 75, 58, 20, 86, 75);
	        }
	    };

	    Object.keys(tests).forEach(function (key) {
	        describe(key, function () {
	            it(key + ': SVG API should draw same image as Canvas API', function (done) {
	                testRender.describe(key);
	                testRender(tests[key], done);
	            });
	        });
	    });
	});

	describe('Shape/Attributes', function () {
	    // the tests code are from p5.js's example reference
	    var tests = {
	        strokeWeight: function (p) {
	            p.strokeWeight(10);
	            p.line(0, 0, 100, 100);
	            p.strokeWeight(5);
	            p.line(0, 0, 50, 100);
	        },
	        strokeCap: function (p) {
	            p.strokeWeight(12.0);
	            p.strokeCap(p.ROUND);
	            p.line(20, 30, 80, 30);
	            p.strokeCap(p.SQUARE);
	            p.line(20, 50, 80, 50);
	            p.strokeCap(p.PROJECT);
	            p.line(20, 70, 80, 70);
	        },
	        strokeJoinMiter: function (p) {
	            p.noFill();
	            p.strokeWeight(10.0);
	            p.strokeJoin(p.MITER);
	            p.beginShape();
	            p.vertex(35, 20);
	            p.vertex(65, 50);
	            p.vertex(35, 80);
	            p.endShape();
	        },
	        strokeJoinBevel: function (p) {
	            p.noFill();
	            p.strokeWeight(10.0);
	            p.strokeJoin(p.BEVEL);
	            p.beginShape();
	            p.vertex(35, 20);
	            p.vertex(65, 50);
	            p.vertex(35, 80);
	            p.endShape();
	        },
	        strokeJoinRound: function (p) {
	            p.noFill();
	            p.strokeWeight(10.0);
	            p.strokeJoin(p.ROUND);
	            p.beginShape();
	            p.vertex(35, 20);
	            p.vertex(65, 50);
	            p.vertex(35, 80);
	            p.endShape();
	        },
	        ellipseModeRadius: function (p) {
	            p.ellipseMode(p.RADIUS);
	            p.fill(255);
	            p.ellipse(50, 50, 30, 30);
	        },
	        ellipseModeCenter: function (p) {
	            p.ellipseMode(p.RADIUS);
	            p.fill(255);
	            p.ellipse(50, 50, 30, 30);
	            p.ellipseMode(p.CENTER);
	            p.fill(100);
	            p.ellipse(50, 50, 30, 30);
	        },
	        ellipseModeCorner: function (p) {
	            p.ellipseMode(p.RADIUS);
	            p.fill(255);
	            p.ellipse(50, 50, 30, 30);
	            p.ellipseMode(p.CORNER);
	            p.fill(255);
	            p.ellipse(25, 25, 50, 50);
	        },
	        ellipseModeCorners: function (p) {
	            p.ellipseMode(p.RADIUS);
	            p.fill(255);
	            p.ellipse(50, 50, 30, 30);
	            p.ellipseMode(p.CORNERS);
	            p.fill(100);
	            p.ellipse(25, 25, 50, 50);
	        },
	        rectModeCornerAndCorners: function (p) {
	            testRender.setMaxDiff(0.12);
	            p.rectMode(p.CORNER);
	            p.fill(255);
	            p.rect(25, 25, 50, 50);

	            p.rectMode(p.CORNERS);
	            p.fill(100);
	            p.rect(25, 25, 50, 50);
	        },
	        rectModeRadiusAndCenter: function (p) {
	            testRender.setMaxDiff(0.12);
	            p.rectMode(p.RADIUS);
	            p.fill(255);
	            p.rect(50, 50, 30, 30);

	            p.rectMode(p.CENTER);
	            p.fill(100);
	            p.rect(50, 50, 30, 30);
	        },
	        smooth: function (p) {
	            p.background(0);
	            p.fill(255);
	            p.noStroke();
	            p.smooth();
	            p.ellipse(30, 48, 36, 36);
	            p.noSmooth();
	            p.ellipse(70, 48, 36, 36);
	        }
	    };

	    Object.keys(tests).forEach(function (key) {
	        describe(key, function () {
	            it(key + ': SVG API should draw same image as Canvas API', function (done) {
	                testRender.describe(key);
	                testRender(tests[key], done);
	            });
	        });
	    });
	});

	describe('Shape/Curves', function () {

	    var tests = {
	        bezier: function (p) {
	            p.noFill();
	            p.stroke(255, 102, 0);
	            p.stroke(0, 0, 0);
	            p.bezier(85, 20, 10, 10, 90, 90, 15, 80);
	        },
	        bezierPoint: function (p) {
	            p.noFill();
	            p.bezier(85, 20, 10, 10, 90, 90, 15, 80);
	            p.fill(255);
	            p.stroke(100);
	            let steps = 10;
	            for (var i = 0; i <= steps; i++) {
	                var t = i / steps;
	                let x = p.bezierPoint(85, 10, 90, 15, t);
	                let y = p.bezierPoint(20, 10, 90, 80, t);
	                p.ellipse(x, y, 5, 5);
	            }
	        },
	        bezierTangent: function (p) {
	            p.noFill();
	            p.bezier(85, 20, 10, 10, 90, 90, 15, 80);
	            let steps = 6;
	            p.fill(255);
	            p.strokeWeight(10);
	            for (let i = 0; i <= steps; i++) {
	                let t = i / steps;
	                let x = p.bezierPoint(85, 10, 90, 15, t);
	                let y = p.bezierPoint(20, 10, 90, 80, t);
	                let tx = p.bezierTangent(85, 10, 90, 15, t);
	                let ty = p.bezierTangent(20, 10, 90, 80, t);
	                let a = p.atan2(ty, tx);
	                a += p.PI;
	                p.stroke(255, 102, 0);
	                p.line(x, y, p.cos(a) * 30 + x, p.sin(a) * 30 + y);
	                p.stroke(0);
	            }
	        },
	        curve: function (p) {
	            p.noFill();
	            p.stroke(255, 102, 0);
	            p.curve(5, 26, 5, 26, 73, 24, 73, 61);
	            p.stroke(0);
	            p.curve(5, 26, 73, 24, 73, 61, 15, 65);
	            p.stroke(255, 102, 0);
	            p.curve(73, 24, 73, 61, 15, 65, 15, 65);
	        },
	        curvePoint: function (p) {
	            p.noFill();
	            p.curve(5, 26, 5, 26, 73, 24, 73, 61);
	            p.curve(5, 26, 73, 24, 73, 61, 15, 65);
	            p.fill(255);
	            p.ellipseMode(p.CENTER);
	            let steps = 6;
	            for (let i = 0; i <= steps; i++) {
	                let t = i / steps;
	                let x = p.curvePoint(5, 5, 73, 73, t);
	                let y = p.curvePoint(26, 26, 24, 61, t);
	                p.ellipse(x, y, 5, 5);
	                x = p.curvePoint(5, 73, 73, 15, t);
	                y = p.curvePoint(26, 24, 61, 65, t);
	                p.ellipse(x, y, 5, 5);
	            }
	        },
	        curveTangent: function (p) {
	            p.noFill();
	            p.curve(5, 26, 73, 24, 73, 61, 15, 65);
	            let steps = 6;
	            for (let i = 0; i <= steps; i++) {
	                let t = i / steps;
	                let x = p.curvePoint(5, 73, 73, 15, t);
	                let y = p.curvePoint(26, 24, 61, 65, t);
	                //ellipse(x, y, 5, 5);
	                let tx = p.curveTangent(5, 73, 73, 15, t);
	                let ty = p.curveTangent(26, 24, 61, 65, t);
	                let a = p.atan2(ty, tx);
	                a -= p.PI / 2.0;
	                p.line(x, y, p.cos(a) * 8 + x, p.sin(a) * 8 + y);
	            }
	        },
	        curveTightness: function (p) {
	            p.curveTightness(10);
	            p.beginShape();
	            p.curveVertex(10, 26);
	            p.curveVertex(10, 26);
	            p.curveVertex(83, 24);
	            p.curveVertex(83, 61);
	            p.curveVertex(25, 65);
	            p.curveVertex(25, 65);
	            p.endShape();
	        }
	    };

	    Object.keys(tests).forEach(function (key) {
	        describe(key, function () {
	            it(key + ': SVG API should draw same image as Canvas API', function (done) {
	                testRender.describe(key);
	                testRender(tests[key], done);
	            });
	        });
	    });

	});

	describe('Shape/Vertex', function () {
	    var tests = {
	        contour: function (p) {
	            p.translate(50, 50);
	            p.stroke(255, 0, 0);
	            p.beginShape();
	            p.vertex(-40, -40);
	            p.vertex(40, -40);
	            p.vertex(40, 40);
	            p.vertex(-40, 40);
	            p.beginContour();
	            p.vertex(-20, -20);
	            p.vertex(-20, 20);
	            p.vertex(20, 20);
	            p.vertex(20, -20);
	            p.endContour();
	            p.endShape(p.CLOSE);
	            p.translate(-50, -50);
	        },
	        bezierVertex: function (p) {
	            p.beginShape();
	            p.vertex(30, 20);
	            p.bezierVertex(80, 0, 80, 75, 30, 75);
	            p.bezierVertex(50, 80, 60, 25, 30, 20);
	            p.endShape();
	        },
	        curveVertex: function (p) {
	            p.noFill();
	            p.beginShape();
	            p.curveVertex(84, 91);
	            p.curveVertex(84, 91);
	            p.curveVertex(68, 19);
	            p.curveVertex(21, 17);
	            p.curveVertex(32, 100);
	            p.curveVertex(32, 100);
	            p.endShape();
	        },
	        quadraticVertex: function (p) {
	            p.noFill();
	            p.strokeWeight(4);
	            p.beginShape();
	            p.vertex(20, 20);
	            p.quadraticVertex(80, 20, 50, 50);
	            p.quadraticVertex(20, 80, 80, 80);
	            p.vertex(80, 60);
	            p.endShape();
	        }
	    };

	    Object.keys(tests).forEach(function (key) {
	        describe(key, function () {
	            it(key + ': SVG API should draw same image as Canvas API', function (done) {
	                testRender.describe(key);
	                testRender(tests[key], done);
	            });
	        });
	    });
	});

	mocha.setup('bdd');
	mocha.setup({ timeout: 10000, slow: 2000 });

	var test = function () {
	    
	    
	    
	    
	    
	    
	    
	    
	    
	    
	    
	    
	    

	    // Note that since recent version of karma, mocha.run will be called automatically
	    // So, we only call mocah.run() if not running inside karma
	    if (!window.__karma__) {
	        mocha.run();
	    }
	};

	test();

	return unit;

})();
//# sourceMappingURL=test.js.map
