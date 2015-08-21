function setup() {
    createCanvas(600, 200, SVG); // Create SVG Canvas
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
