$(function() {
    // see also: http://p5js.org/learn/examples/Instance_Mode_Instantiation.php
    var canvasGraphics, svgGraphics;
    var sync = true;
    var p5canvas = new p5(function(p) {
        p.setup = function() {
            canvasGraphics = p.createCanvas(100, 100);
            p.noLoop();
        };
    }, sync);
    var p5svg = new p5(function(p) {
        p.setup = function() {
            svgGraphics = p.createSVG(100, 100);
            p.noLoop();
        };
    }, sync);

    window.testRender = function(draw) {
        var fnbody = draw.toString();
        fnbody = fnbody.substring(fnbody.indexOf('{') + 1, fnbody.lastIndexOf('}'));
        [p5svg, p5canvas].forEach(function(p) {
            p.strokeWeight(5);
            p.fill(200);
            p.background(250);
            p.stroke(0);
            with (p) {
                eval(fnbody);
            }
        });

        var img, svgpng, canvaspng, match, svgimg, canvasimg;

        img = new Image();
        img.src = svgGraphics.toDataURL();
        $('#tests').append(img);

        svgimg = new Image();
        svgpng = svgGraphics.toDataURL('image/png');
        svgimg.src = svgpng;
        $('#tests').append(svgimg);

        canvasimg = new Image();
        canvaspng = canvasGraphics.elt.toDataURL('image/png');
        canvasimg.src = canvaspng;
        $('#tests').append(canvasimg);

        var canvas = document.createElement('canvas');
        canvas.width = canvasGraphics.width;
        canvas.height = canvasGraphics.height;
        $('#tests').append(canvas);
        var ctx = canvas.getContext('2d');
        $(svgimg).load(function() {
            $(canvasimg).load(function() {
                ctx.drawImage(svgimg, 0, 0);
                var svgpngData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                ctx.drawImage(canvasimg, 0, 0);
                var canvaspngData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                for (var i = 0; i < svgpngData.data.length; i += 4) {
                    var r1 = svgpngData.data[i];
                    var r2 = canvaspngData.data[i];
                    if (r1 === r2) {
                        canvaspngData.data[i] = 0;
                        canvaspngData.data[i + 1] = 0;
                        canvaspngData.data[i + 2] = 0;
                        canvaspngData.data[i + 3] = 255;
                    } else {
                        console.log(i);
                        canvaspngData.data[i] = 255;
                        canvaspngData.data[i + 1] = 255;
                        canvaspngData.data[i + 2] = 255;
                        canvaspngData.data[i + 3] = 255;
                    }
                }
                ctx.putImageData(canvaspngData, 0, 0);
            });
        });

        match = svgpng === canvaspng;

        var icon = match ? 'fa-check' : 'fa-times';
        $('#tests').append('<div class="match"><i class="fa ' + icon + '"></i></div>');

        $('#tests').append('<div class="function">' + fnbody.replace(/;/g, ';<br>') + '</div>');
        $('#tests').append('<br><br>');

        return match;
    };

    mocha.run();
});
