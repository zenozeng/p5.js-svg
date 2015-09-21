var graphics;
function setup() {
    graphics = createCanvas(600, 200, SVG); // Create SVG Canvas
    fill('#ED225D');
    noStroke();
    window.mouseClickedFlag = false;
}

function draw() {
    if (window.mouseClickedFlag) {
        var dataURL = getDataURL();
        // Note that because draw is in setTimeout, if we call noLoop inside mouseClicked, draw will still be called one more time
        noLoop();
        // draw the dataurl
        var svg = loadSVG(dataURL, function(svg) {
            image(svg, 50, 50, 600, 200);
        });
    } else {
        clear();
        var a = min(frameCount, 1200);
        var b = min(frameCount, 400);
        ellipse(0, 0, a, b);
        if (frameCount > 1200) {
            noLoop();
        }
    }
}

function mouseClicked() {
    window.mouseClickedFlag = true;
}
