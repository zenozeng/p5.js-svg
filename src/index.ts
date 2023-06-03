import { P5, P5Global } from './types';
import RendererSVG from './p5.RendererSVG';
import Rendering from './rendering';
import IO from './io';
import CreateClassSVGElement from './element';
import Filters from './filters';
import Image from './image';
import constants from './constants';

function init(p5: P5) {
    RendererSVG(p5);
    Rendering(p5);
    IO(p5);
    Filters(p5);
    Image(p5);

    const SVGElement = CreateClassSVGElement(p5)

    class P5SVG extends p5 {
        static SVG: string = constants.SVG;
        static SVGElement = SVGElement;

        protected _renderer: { svg?: any }

        /**
         * Returns an Array of SVGElements of current SVG Graphics matching given selector
         * 
         * @param selector CSS selector for query
         */
        querySVG(selector: string) {
            var svg = this._renderer && this._renderer.svg
            if (!svg) {
                return null
            }
            return SVGElement.prototype.query.call({ elt: svg }, selector)
        }
    }

    const p5svg = p5 as typeof P5SVG
    p5svg.SVGElement = SVGElement
    p5svg.prototype = P5SVG.prototype;

    return p5svg
}

const global = window as unknown as P5Global;
if (typeof global.p5 !== 'undefined') {
    init(global.p5);
}

export default init;