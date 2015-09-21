module.exports = function(p5) {
    /**
     * @namespace p5
     */
    require('./p5.RendererSVG')(p5);
    require('./rendering')(p5);
    require('./io')(p5);
    require('./element')(p5);
    require('./filters')(p5);

    // attach constants to p5 instance
    var constants = require('./constants');
    Object.keys(constants).forEach(function(k) {
        p5.prototype[k] = constants[k];
    });
};
