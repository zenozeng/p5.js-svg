function setup() {
    createCanvas(100, 100, SVG);
    background(255);
    stroke(255, 0, 0);
    strokeWeight(10);
    line(0, 0, 100, 100);
    line(0, 100, 100, 0);
    filter(BLUR, 10);
    noLoop();
}

function draw() {
}
