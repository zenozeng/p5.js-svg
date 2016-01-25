var p5 = require('./p5');
var assert = require('assert');
var _ = window._; // lodash
var SVGCanvas = require('svgcanvas');

// init p5 canvas instance and p5-svg instance
var canvasGraphics, svgGraphics, p5svg, p5canvas;
p5svg = new p5(function(p) {
    p.setup = function() {
        svgGraphics = p.createCanvas(100, 100, p.SVG);
        p.noLoop();
        p.isSVG = true;
    };
}, true);
p5canvas = new p5(function(p) {
    p.setup = function() {
        canvasGraphics = p.createCanvas(100, 100);
        p.noLoop();
        p.isSVG = false;
    };
}, true);

var resetCanvas = function(p) {
    p.clear();
    p.strokeWeight(6); // for using XOR with thin line removed (using 8-connected neighborhood < 5) for diff
    p.fill(200);
    p.stroke(0);
    p.ellipseMode(p.CENTER);
    p.rectMode(p.CORNER);
    p.smooth();
};

// count non transparent pixels
var countPixels = function(imgData) {
    var count = 0;
    for (var i = 3; i < imgData.data.length; i += 4) {
        if (imgData.data[i] > 0) {
            count++;
        }
    }
    return count;
};

var maxPixelDiff = 0;
var diffPixels = function(imgData1, imgData2, diffImgData) {
    for (var i = 0; i < imgData1.data.length; i += 4) {
        var indexes = [i, i+1, i+2, i+3];
        indexes.forEach(function(i) {
            diffImgData.data[i] = 0;
        });
        if(indexes.some(function(i) {
            return Math.abs(imgData1.data[i] - imgData2.data[i]) > maxPixelDiff;
        })) {
            diffImgData.data[i+3] = 255; // set black
        }
    }
};

// remove thin lines using 8-connected neighborhood < 5
var removeThinLines = function(canvas) {
    var ctx = canvas.getContext('2d');
    var width = canvas.width;
    var height = canvas.height;
    var imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    var imgDataCopy = ctx.getImageData(0, 0, canvas.width, canvas.height);

    var getPixelIndex = function(x, y) {
        return (y * width + x) * 4 + 3;
    };

    var getPixel = function(x, y) {
        var alphaIndex = getPixelIndex(x, y);
        return imgDataCopy.data[alphaIndex];
    };

    var setPixel = function(x, y, value) {
        imgData.data[getPixelIndex(x, y)] = value;
    };

    for (var x = 1; x < width - 1; x++) {
        for (var y = 1; y < height - 1; y++) {
            if (getPixel(x, y) == 0) {
                continue; // ignore transparents
            }
            var links = [
                {x: x - 1, y: y - 1},
                {x: x, y: y - 1},
                {x: x + 1, y: y - 1},
                {x: x - 1, y: y},
                {x: x + 1, y: y},
                {x: x - 1, y: y + 1},
                {x: x, y: y + 1},
                {x: x + 1, y: y + 1}
            ].map(function(p) {
                return getPixel(p.x, p.y);
            }).filter(function(val) {
                return val > 0; // not transparent?
            }).length;

            if (links < 5) { // is a thin line
                setPixel(x, y, 0); // make it transparent
            }
        }
    }
    canvas.getContext('2d').putImageData(imgData, 0, 0);
};

// render given function
var render = function(draw) {
    var fnbody = draw.toString();
    fnbody = fnbody.substring(fnbody.indexOf('{') + 1, fnbody.lastIndexOf('}'));
    [p5svg, p5canvas].forEach(function(p) {
        resetCanvas(p);
        with (p) {
            p.canvas.getContext('2d').__history = [];
            eval(fnbody);
        }
    });
};

// prepare dom for tests container
var prepareDom = function(draw) {
    var $container = $('#test-graph');

    var status = {};

    // draw header
    var th = '<div class="th"><div>Rendered in SVG</div><div>Rendered in Canvas<br>Converted to PNG</div><div>Diff Bitmap</div><div>Diff Bitmap with thin line removed (8-connected neighborhood < 5)</div><div></div><div class="function">p5.js</div></div>';
    $container.append(th);

    // the svg result
    var svg = new Image();
    svg.onload = function() {
        status.svg = true;
    };
    svg.src = SVGCanvas.prototype.toDataURL.call({svg: p5svg._renderer.svg},
                                                 "image/svg+xml");
    var _svg = p5svg._renderer.svg.cloneNode(true);
    _svg.id = null;
    _svg.className = 'svg';
    $container.append(_svg);

    // the canvas result
    var canvas = new Image();
    canvas.onload = function() {
        status.canvas = true;
    };
    canvas.src = p5canvas._curElement.elt.toDataURL('image/png');
    $container.append(canvas);

    // diff canvas
    var diffCanvas = document.createElement('canvas');
    diffCanvas.width = 100 * window.devicePixelRatio;
    diffCanvas.height = 100 * window.devicePixelRatio;;
    $container.append(diffCanvas);

    // diff canvas2 for removing thin lines
    var diffCanvas2 = document.createElement('canvas');
    diffCanvas2.width = 100 * window.devicePixelRatio;;
    diffCanvas2.height = 100 * window.devicePixelRatio;;
    $container.append(diffCanvas2);

    // match?
    var $match = $('<div class="match"></div>');
    $container.append($match);

    // p5.js API call history
    var fnbody = draw.toString();
    fnbody = fnbody.substring(fnbody.indexOf('{') + 1, fnbody.lastIndexOf('}'));
    // re-indent
    var indent = fnbody.match(/( +)/)[0].length;
    indent = new RegExp('^[ ]{' + indent + '}', 'gm');
    fnbody = fnbody.replace(indent, '');
    $container.append('<pre class="function">' + fnbody + '</pre>');

    // canvas API call history
    // var history = p5svg.canvas.getContext('2d').__history;
    // $container.append('<div class="canvas-fn">' + history.join('<br>') + '</div>');

    $container.append('<hr>');

    return {
        svg: svg,
        canvas: canvas,
        diffCanvas: diffCanvas,
        diffCanvas2: diffCanvas2,
        $match: $match,
        isReady: function() {
            return status.svg && status.canvas;
        }
    };
};

var testRender = function(draw, callback) {

    testRender.setMaxDiff(0.05); // reset maxDiff
    testRender.setMaxPixelDiff(0); // reset maxPixelDiff

    render(draw);

    var diff = function(el) {

        // wait until ready
        // if (!el.svg.complete || !el.canvas.complete) {
        if (!el.isReady()) {
            // 100 is workround for NS_ERROR_NOT_AVAILABLE in karma
            setTimeout(function() {
                diff(el);
            }, 100);
            return;
        }

        var ctx = el.diffCanvas.getContext('2d');
        var w = 100 * window.devicePixelRatio;
        var h = 100 * window.devicePixelRatio;

        // svg render result
        ctx.clearRect(0, 0, w, h);
        ctx.drawImage(el.svg, 0, 0, w, h);
        var imgData1 = ctx.getImageData(0, 0, w, h);

        // canvas render result
        ctx.clearRect(0, 0, w, h);
        ctx.drawImage(el.canvas, 0, 0, w, h);
        var imgData2 = ctx.getImageData(0, 0, w, h);

        // get diff
        var diffImgData = ctx.getImageData(0, 0, w, h);
        diffPixels(imgData1, imgData2, diffImgData);
        ctx.putImageData(diffImgData, 0, 0);

        // get diff with thin line removed (8-connected neighborhood < 5)
        ctx = el.diffCanvas2.getContext('2d');
        ctx.putImageData(diffImgData, 0, 0);
        removeThinLines(el.diffCanvas2);
        removeThinLines(el.diffCanvas2); // twice
        var diffImgData2 = ctx.getImageData(0, 0, w, h);

        // match?
        var count = Math.max(countPixels(imgData1), countPixels(imgData2));
        var diffCount = countPixels(diffImgData2);
        var rate = diffCount / count;
        var match = rate <= (testRender.maxDiff || 0.05);

        // update $match
        var icon = match ? 'fa-check': 'fa-times';
        el.$match.html('<i class="fa ' + icon + '"></i>');

        var err = null;
        if (!match) {
            err = new Error(JSON.stringify({
                maxPixelDiff: maxPixelDiff,
                maxDiffRate: testRender.maxDiff,
                pixels: count,
                diffPixels: diffCount,
                rate: rate
            }));
        }

        // callback
        callback(err);
    };

    var next = function() {
        // handle testRender.wait(ms);
        if (testRender.waitUntil && (Date.now() < testRender.waitUntil)) {
            setTimeout(next, 100);
            return;
        }
        var el = prepareDom(draw);
        diff(el);
    };

    next();
};

testRender.describe = function(str) {
    $(function() {
        var $container = $('#test-graph');
        $container.append('<h2>' + str + '</h2>');
    });
};

testRender.setMaxDiff = function(max) {
    testRender.maxDiff = max;
};

testRender.setMaxPixelDiff = function(max) {
    maxPixelDiff = max;
};

testRender.wait = function(ms) {
    testRender.waitUntil = Date.now() + ms;
};

// add lock so testRender will wait
testRender.lock = function() {
    testRender.wait(1000 * 1000 * 1000);
};

// remove lock
testRender.unlock = function() {
    testRender.wait(0);
};

module.exports = testRender;
