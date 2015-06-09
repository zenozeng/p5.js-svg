/**
 * @module Data
 * @submodule Output
 * @for p5
 * @requires core
 */
define(function (require) {

    'use strict';

    var p5 = require('core');

    var _save = p5.prototype.save;
    p5.prototype.save = function() {
        var args = arguments;

        if (!this.svg) {
            _save.apply(this, args);
            return;
        }

        if (args.length === 0) {
        }

    };
});
