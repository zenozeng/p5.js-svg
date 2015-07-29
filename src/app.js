define(function(require) {
    var p5 = require('core');
    require('rendering.svg');
    require('output');

    // attach constants to p5 instance
    var cons = require('constants');
    Object.keys(cons).forEach(function(k) {
        p5.prototype[k] = cons[k];
    });
});
