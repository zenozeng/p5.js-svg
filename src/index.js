import RendererSVG from './p5.RendererSVG';
import Rendering from './rendering';
import IO from './io';
import Element from './element';
import Filters from './filters';
import constants from './constants';

(function(p5) {
    /**
     * @namespace p5
     */
    RendererSVG(p5);
    Rendering(p5);
    IO(p5);
    Element(p5);
    Filters(p5);

    // attach constants to p5 instance
    Object.keys(constants).forEach(function(k) {
        p5.prototype[k] = constants[k];
    });
})(window.p5);
