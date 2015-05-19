$(function() {
    var p5canvas = new p5();
    var canvasGraphics = p5canvas.createCanvas(100, 100, true);

    var p5svg = new p5();
    var svgGraphics = p5svg.createSVG(100, 100);

    console.log(canvasGraphics);

    window.testRender = function(draw) {
        p5svg.background(255);
        p5canvas.background(255);

        var fnbody = draw.toString();
        fnbody = fnbody.substring(fnbody.indexOf('{') + 1, fnbody.lastIndexOf('}'));
        [p5svg, p5canvas].forEach(function(p) {
            with (p) {
                eval(fnbody);
            }
        });
        draw(p5svg);
        draw(p5canvas);

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

        match = svgpng === canvaspng ? 'fa-check-circle' : 'fa-times-circle';
        $('#tests').append('<div class="match"><i class="fa ' + match + '"></i></div>');

        $('#tests').append('<div class="function">' + fnbody.replace(/;/g, ';<br>') + '</div>');
        $('#tests').append('<br><br>');
    };

    testRender(function() {
        ellipse(50, 50, 50, 25);
    });

    testRender(function() {
        line(30, 20, 85, 20);
        stroke(126);
        line(85, 20, 85, 75);
        stroke(255);
        line(85, 75, 30, 75);
    });
});
