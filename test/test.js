$(function() {
    var p5canvas = new p5();
    var canvasGraphics = p5canvas.createCanvas(100, 100, true);

    var p5svg = new p5();
    var svgGraphics = p5svg.createSVG(100, 100);

    console.log(canvasGraphics);

    window.testRender = function(draw) {
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

        $('#tests').append('<div class="function">' + draw.toString() + '</div>');
        $('#tests').append('<br>');
    };

    testRender(function(p) {
        p.ellipse(50, 50, 50, 25);
    });
});
