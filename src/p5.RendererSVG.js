import {Element as SVGCanvasElement} from 'svgcanvas';

export default function(p5) {
    /**
     * @namespace RendererSVG
     * @constructor
     * @param {Element} elt canvas element to be replaced
     * @param {p5} pInst p5 Instance
     * @param {Bool} isMainCanvas
     */
    function RendererSVG(elt, pInst, isMainCanvas) {
        var svgCanvas = new SVGCanvasElement();
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

        p5.Renderer2D.call(this, elt, pInst, isMainCanvas);

        this.isSVG = true;
        this.svg = svg;

        return this;
    }

    RendererSVG.prototype = Object.create(p5.Renderer2D.prototype);

    RendererSVG.prototype._applyDefaults = function() {
        p5.Renderer2D.prototype._applyDefaults.call(this);
        this.drawingContext.lineWidth = 1;
    };

    RendererSVG.prototype.line = function(x1, y1, x2, y2) {
        var styleEmpty = 'rgba(0,0,0,0)';
        var ctx = this.drawingContext;
        if (!this._doStroke) {
            return this;
        } else if(ctx.strokeStyle === styleEmpty){
            return this;
        }
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
        return this;
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
        this._withPixelDensity(function() {
            p5.Renderer2D.prototype.resize.call(this, w, h);
        });
        // For scale, crop
        // see also: http://sarasoueidan.com/blog/svg-coordinate-systems/
        this.svg.setAttribute('viewBox', [0, 0, w, h].join(' '));
    };

    /**
     * @private
     */
    RendererSVG.prototype._withPixelDensity = function(fn) {
        let pixelDensity = this._pInst._pixelDensity;
        this._pInst._pixelDensity = 1; // 1 is OK for SVG
        fn.apply(this);
        this._pInst._pixelDensity = pixelDensity;
    };

    RendererSVG.prototype.background = function() {
        var args = arguments;
        this._withPixelDensity(function() {
            p5.Renderer2D.prototype.background.apply(this, args);
        });
    };

    RendererSVG.prototype.resetMatrix = function() {
        this._withPixelDensity(function() {
            p5.Renderer2D.prototype.resetMatrix.apply(this);
        });
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
            this.appendChild(elt);
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

    p5.RendererSVG = RendererSVG;
}