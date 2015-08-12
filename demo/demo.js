function setup() {
    createCanvas(100, 100, SVG);
    ellipse(width/2, height/2, 50, 50);
    ellipse(width/2, height/2, 50, 50);
    ellipse(width/2, height/2, 50, 50);
    frameRate(10);
    filter(BLUR, 5);
    noLoop();
}

function draw() {
}
