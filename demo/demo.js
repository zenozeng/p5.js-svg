var n = 0;

function setup() {
    createSVG(600, 600);
}

function draw() {
    background(100);
    n++;
    ellipse(200, 200, 100, n % 50);
}
