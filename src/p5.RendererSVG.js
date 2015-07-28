define(function(require) {
    'use strict';

    var p5 = require('core');

    function RendererSVG(elt, pInst, isMainCanvas) {
        p5.Renderer.call(this, elt, pInst, isMainCanvas);
    }

    RendererSVG.prototype = Object.create(p5.Renderer.prototype);

    p5.RendererSVG = RendererSVG;
});
