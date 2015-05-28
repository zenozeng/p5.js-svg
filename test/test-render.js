(function(global) {
    var canvasGraphics, svgGraphics;
    var sync = true;

    // see also: http://p5js.org/learn/examples/Instance_Mode_Instantiation.php
    var inited = false;
    var p5svg, p5canvas;

    // init p5 canvas instance and p5-svg instance
    var init = function() {
        inited = true;
        p5svg = new p5(function(p) {
            p.setup = function() {
                svgGraphics = p.createSVG(100, 100);
                p.noLoop();
            };
        }, sync);

        p5canvas = new p5(function(p) {
            p.setup = function() {
                canvasGraphics = p.createCanvas(100, 100);
                p.noLoop();
            };
        }, sync);
    };

    var _testRender = function(draw, callback) {
        var fnbody = draw.toString();
        fnbody = fnbody.substring(fnbody.indexOf('{') + 1, fnbody.lastIndexOf('}'));
        [p5svg, p5canvas].forEach(function(p) {
            p.clear();
            p.strokeWeight(1);
            p.fill(200);
            p.stroke(0);
            p.ellipseMode(p.CENTER);
            p.rectMode(p.CORNER);
            p.smooth();
            with (p) {
                eval(fnbody);
            }
        });

        var img, svgpng, canvaspng, match, svgimg, canvasimg;

        var $container = $('#test-graph');

        // draw original svg
        img = new Image();
        svgGraphics.toDataURL(function(err, svg) {
            img.src = svg;
        });
        img.className = 'svg';
        $container.append(img);

        var svgimgComplete, canvasimgComplete;

        // load svg->png
        svgimg = new Image();
        svgimg.onload = function() {
            svgimgComplete = true;
        };
        svgGraphics.toDataURL('image/png', {}, function(err, png) {
            svgimg.src = png;
        });

        // load canvas->png
        canvasimg = new Image();
        canvaspng = canvasGraphics.elt.toDataURL('image/png');
        canvasimg.onload = function() {
            canvasimgComplete = true;
        };
        canvasimg.src = canvaspng;
        canvasimg.className = 'canvasimg';
        $container.append(canvasimg);

        var canvas = document.createElement('canvas');
        canvas.width = canvasGraphics.width;
        canvas.height = canvasGraphics.height;
        $container.append(canvas);
        var ctx = canvas.getContext('2d');

        var $match = $('<div class="match"></div>');
        $container.append($match);
        $container.append('<div class="function">' + fnbody.replace(/;/g, ';<br>') + '</div>');
        $container.append('<br><br>');

        var diff = function() {
            if (!svgimgComplete || !canvasimgComplete) {
                setTimeout(diff, 10);
                return;
            }
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(svgimg, 0, 0);
            var svgpngData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(canvasimg, 0, 0);
            var canvaspngData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            var count = 0;
            var mismatch = 0;
            var mismatchval = 0;
            for (var i = 0; i < svgpngData.data.length; i += 4) {
                var r1 = svgpngData.data[i];
                var g1 = svgpngData.data[i + 1];
                var b1 = svgpngData.data[i + 2];
                var a1 = svgpngData.data[i + 3];

                var r2 = canvaspngData.data[i];
                var g2 = canvaspngData.data[i + 1];
                var b2 = canvaspngData.data[i + 2];
                var a2 = canvaspngData.data[i + 3];

                if (canvaspngData.data[i + 3] > 0 || svgpngData.data[i + 3] > 0) {
                    count++;
                }
                if ((r1 === r2) && (g1 === g2) && (b1 === b2) && (a1 === a2)) {
                    canvaspngData.data[i] = 0;
                    canvaspngData.data[i + 1] = 0;
                    canvaspngData.data[i + 2] = 0;
                    canvaspngData.data[i + 3] = 255;
                } else {
                    var diffv = Math.abs(r1 - r2) + Math.abs(g1 - g2) + Math.abs(b1 - b2) + Math.abs(a1 - a2);
                    diffv /= 255 * 4;
                    mismatchval += diffv;
                    // todo: maybe use sin to make small value smaller, big value bigger?

                    canvaspngData.data[i] = diffv;
                    canvaspngData.data[i + 1] = diffv;
                    canvaspngData.data[i + 2] = diffv;
                    canvaspngData.data[i + 3] = diffv;
                }
            }

            ctx.putImageData(canvaspngData, 0, 0);

            var mismatchLevel = mismatchval / count;

            var matchp = mismatchLevel <= 0.02;
            var icon = matchp ? 'fa-check': 'fa-times';
            $match.html('<i class="fa ' + icon + '"></i>');

            if (matchp) {
                callback();
            } else {
                var err = JSON.stringify({
                    count: count,
                    mismatchPixels: mismatch,
                    mismatchLevel: mismatchLevel
                });
                callback(new Error(err));
            }
        };
        diff();

    };

    global.testRender = function(draw, callback) {

        $(function() {
            if (!inited) {
                init();
            }
            _testRender(draw, callback);
        });


    };
})(this);
