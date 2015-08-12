function setup() {
    createCanvas(100, 100, SVG);
    ellipse(width/2, height/2, 50, 50);
    ellipse(width/2, height/2, 50, 50);
    ellipse(width/2, height/2, 50, 50);
    frameRate(10);
    var elt = querySVG('g path')[0].parentNode();
    elt.filter(BLUR, 5);
    elt.unfilter(BLUR, 5);
    noLoop();
}

function draw() {
}
