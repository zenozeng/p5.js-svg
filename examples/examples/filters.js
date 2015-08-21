function setup() {
    createCanvas(600, 200, SVG);
    stroke('#ED225D');
    strokeWeight(20);
    frameRate(10);
}

function draw() {
    clear();
    line(0, 0, width, height);
    // BLUR
    filter(BLUR, sin(frameCount % 30 / 30 * PI) * 15);
    // Other filters including:
    // GRAY, INVERT, THRESHOLD, OPAQUE, ERODE, DILATE
}
