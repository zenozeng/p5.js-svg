function setup() {
    createCanvas(100, 100, SVG);
    ellipse(width/2, height/2, 50, 50);
    var g = querySVG('g path')[0].parentNode('g');
    g.filter(BLUR, 5);
    noLoop();
}

function draw() {}
