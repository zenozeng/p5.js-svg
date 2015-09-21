function setup() {
    createCanvas(600, 200, SVG);
    background(255);
    fill(128);
    beginShape();
    vertex(0, 0);
    vertex(0, 200); // Line from 0, 0 to 0, 200
    // http://p5js.org/reference/#/p5/bezierVertex
    // Curve from 0, 200 to 200, 0
    bezierVertex(0, 0, 0, 0, 200, 0);
    vertex(0, 0);
    endShape();
    noLoop();
}

function draw() {
}

