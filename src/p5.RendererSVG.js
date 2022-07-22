import {Element as SVGCanvasElement} from 'svgcanvas';
import {DEBUG} from './config';

export default function(p5) {
    /**
     * @namespace RendererSVG
     * @constructor
     * @param {Element} elt canvas element to be replaced
     * @param {p5} pInst p5 Instance
     * @param {Bool} isMainCanvas
     */
    function RendererSVG(elt, pInst, isMainCanvas) {
        var svgCanvas = new SVGCanvasElement({debug: DEBUG});
        var svg = svgCanvas.svg;

        // replace <canvas> with <svg> and copy id, className
        var parent = elt.parentNode;
        var id = elt.id;
        var className = elt.className;
        parent.replaceChild(svgCanvas.getElement(), elt);
        svgCanvas.id = id;
        svgCanvas.className = className;
        elt = svgCanvas; // our fake <canvas>

        elt.parentNode = {
            // fake parentNode.removeChild so that noCanvas will work
            removeChild: function(element) {
                if (element === elt) {
                    var wrapper = svgCanvas.getElement();
                    wrapper.parentNode.removeChild(wrapper);
                }
            }
        };

        const pInstProxy = new Proxy(pInst, {
            get: function(target, prop) {
                if (prop === '_pixelDensity') {
                    // 1 is OK for SVG
                    return 1;
                }
                return target[prop];
            }
        });

        p5.Renderer2D.call(this, elt, pInstProxy, isMainCanvas);

        this.isSVG = true;
        this.svg = svg;

        if (DEBUG) {
            console.debug({svgCanvas});
            console.debug(this.drawingContext);
        }

        return this;
    }

    RendererSVG.prototype = Object.create(p5.Renderer2D.prototype);

    RendererSVG.prototype._applyDefaults = function() {
        p5.Renderer2D.prototype._applyDefaults.call(this);
        this.drawingContext.lineWidth = 1;
    };

    RendererSVG.prototype.resize = function(w, h) {
        if (!w || !h) {
            return;
        }
        if (this.width !== w || this.height !== h) {
            // canvas will be cleared if its size changed
            // so, we do same thing for SVG
            // note that at first this.width and this.height is undefined
            this.drawingContext.__clearCanvas();
        }

        p5.Renderer2D.prototype.resize.call(this, w, h);

        // For scale, crop
        // see also: http://sarasoueidan.com/blog/svg-coordinate-systems/
        this.svg.setAttribute('viewBox', [0, 0, w, h].join(' '));
    };

    /**
     * Append a element to current SVG Graphics
     *
     * @function appendChild
     * @memberof RendererSVG.prototype
     * @param {SVGElement|Element} element
     */
    RendererSVG.prototype.appendChild = function(element) {
        if (element && element.elt) {
            element = element.elt;
        }
        var g = this.drawingContext.__closestGroupOrSvg();
        g.appendChild(element);
    };

    /**
     * Draw an image or SVG to current SVG Graphics
     *
     * FIXME: sx, sy, sWidth, sHeight
     *
     * @function image
     * @memberof RendererSVG.prototype
     * @param {p5.Graphics|SVGGraphics|SVGElement|Element} image
     * @param {Number} x
     * @param {Number} y
     * @param {Number} width
     * @param {Number} height
     */
    RendererSVG.prototype.image = function(img, sx, sy, sWidth, sHeight, x, y, w, h) {
        if (!img) {
            throw new Error('Invalid image: ' + img);
        }
        var elt = img._renderer && img._renderer.svg; // handle SVG Graphics
        elt = elt || (img.elt && img.elt.nodeName && (img.elt.nodeName.toLowerCase() === 'svg') && img.elt); // SVGElement
        elt = elt || (img.nodeName && (img.nodeName.toLowerCase() == 'svg') && img); // <svg>
        if (elt) {
            // it's <svg> element, let's handle it
            elt = elt.cloneNode(true);
            elt.setAttribute('width', w);
            elt.setAttribute('height', h);
            elt.setAttribute('x', x);
            elt.setAttribute('y', y);
            if (sx || sy || sWidth || sHeight) {
                sWidth /= this._pInst._pixelDensity;
                sHeight /= this._pInst._pixelDensity;
                elt.setAttribute('viewBox', [sx, sy, sWidth, sHeight].join(', '));
            }

            let g = p5.SVGElement.create('g');
            this.drawingContext.__applyTransformation(g.elt);
            g.elt.appendChild(elt);
            this.appendChild(g.elt);
        } else {
            p5.Renderer2D.prototype.image.apply(this, arguments);
        }
    };

    /**
     * @method parent
     * @return {p5.Element}
     *
     * @see https://github.com/zenozeng/p5.js-svg/issues/187
     */
    RendererSVG.prototype.parent = function() {
        const $this = {
            elt: this.elt.getElement()
        };
        return p5.Element.prototype.parent.apply($this, arguments);
    };


    RendererSVG.prototype.loadPixels = async function() {
        const pixelsState = this._pixelsState; // if called by p5.Image
        const pd = pixelsState._pixelDensity;
        const w = this.width * pd;
        const h = this.height * pd;
        const imageData = await this.drawingContext.getImageData(0, 0, w, h, {async: true});
        pixelsState._setProperty('imageData', imageData);
        pixelsState._setProperty('pixels', imageData.data);
    }

    p5.RendererSVG = RendererSVG;
}