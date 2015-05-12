var n = 0;

function setup() {
    // frameRate(1);
    createSVG(600, 600);
}

function draw() {
    background(100);
    n++;
    ellipse(200, 200, 100, n % 50);
}
