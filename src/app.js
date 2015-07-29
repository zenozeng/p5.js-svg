define(function(require) {
    var p5 = require('core');
    require('rendering.svg');
    require('output');

    // attach constants to p5 instance
    var constants = require('constants');
    constants.keys().forEach(function(k) {
        p5.prototype[k] = constants[k];
    });
});
