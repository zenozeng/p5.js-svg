var graphics;
function setup() {
    graphics = createCanvas(600, 200, SVG); // Create SVG Canvas
    fill('#ED225D');
    noStroke();
}

function draw() {
    clear();
    var a = min(frameCount, 1200);
    var b = min(frameCount, 400);
    ellipse(0, 0, a, b);
    if (frameCount > 1200) {
        noLoop();
    }
}

function mouseClicked() {
    var dataURL = getSerializedSVG('image/svg+xml');
    // draw the dataurl
    var svg = loadSVG(dataURL, function(svg) {
        console.log(svg);
        noLoop();
        image(svg, 50, 50, 600, 200);
    });
}
