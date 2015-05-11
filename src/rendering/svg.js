define(function(require) {
    "use strict";

    var p5 = require('core');

    /**
     * Creates a SVG element in the document, and sets its width and
     * height in pixels. This method should be called only once at
     * the start of setup.
     * @param {Number} width - Width (in px) for SVG Element
     * @param {Number} height - Height (in px) for SVG Element
     * @return {p5.SVGElement} p5.SVGElement represents the SVG Element created
     */
    // TODO: fix return type
    p5.prototype.createSVG = function(width, height) {

        var svgCanvas = new (require('SVGCanvas'));
        var svg = svgCanvas.svg;

        // Override ctx.fillRect & clearRect,
        // to make the svg remove all child element to save resources
        ["fillRect", "clearRect"].forEach(function(method) {
            var _fn = svgCanvas.ctx[method];
            svgCanvas.ctx[method] = function(x, y, w, h) {

                _fn.call(svgCanvas.ctx, x, y, w, h);

                if (x === 0 && y === 0 && w === svgCanvas.width && h === svgCanvas.height) {
                    // clear all child element
                    var elements = svg.querySelectorAll('g > *');
                    if (elements) {
                        console.log('going to gc', elements);
                        // use setTimeout to ensure current frame to have enough time to stay
                        setTimeout(function() {
                            // remove invisible elements
                            console.log('gc', elements);
                            for (var i = 0; i < elements.length - 1; i++) {
                                elements[i].remove();
                            }
                        }, 100);
                    }
                }
            };
        });

        document.body.appendChild(svg);
        this.svg = svg;

        // for debug
        window.p = this;

        // override default graphics (original is created by createCanvas at _start)
        this.noCanvas();
        this._defaultGraphics = new p5.Graphics(svgCanvas, this, true);
        this._elements.push(this._defaultGraphics);
        this._defaultGraphics.resize(width, height);
        this._defaultGraphics._applyDefaults();

        return svg;
    };
});
