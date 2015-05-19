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
            p.strokeWeight(2);
            p.fill(200);
            p.background(250);
            p.stroke(0);
            with (p) {
                eval(fnbody);
            }
        });

        var img, svgpng, canvaspng, match;

        img = new Image();
        img.src = svgGraphics.toDataURL();
        $('#tests').append(img);

        img = new Image();
        svgpng = svgGraphics.toDataURL('image/png');
        img.src = svgpng;
        $('#tests').append(img);

        img = new Image();
        canvaspng = canvasGraphics.elt.toDataURL('image/png');
        img.src = canvaspng;
        $('#tests').append(img);

        match = svgpng === canvaspng;
        console.log(svgpng, canvaspng);

        var icon = match ? 'fa-check' : 'fa-times';
        $('#tests').append('<div class="match"><i class="fa ' + icon + '"></i></div>');

        $('#tests').append('<div class="function">' + fnbody.replace(/;/g, ';<br>') + '</div>');
        $('#tests').append('<br><br>');

        return match;
    };

    mocha.run();
});
