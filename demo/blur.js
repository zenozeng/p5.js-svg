function setup() {
    createCanvas(100, 100, SVG);
    ellipse(width/2, height/2, 50, 50);
    frameRate(10);
    // noLoop();
}

function draw() {
    var g = querySVG('g path')[0].parentNode('g');
    g.filter(BLUR, 1);
    if (frameCount == 100) {
        noLoop();
    }
}
