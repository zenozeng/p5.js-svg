function setup() {
    createCanvas(600, 200, SVG);
    strokeWeight(20);
    stroke('#ED225D');
    line(0, 0, width, height);
    frameRate(30);
}

function draw() {
    // get path element from current SVG Graphics
    var path = querySVG('g path')[0];
    // edit existing element
    path.attribute('stroke-width', frameCount % 100);

    // apply filter to parent group
    var g = path.parentNode();
    if (frameCount % 200 == 0) {
        g.unfilter(GRAY); // cancel last filter applied
    } else if (frameCount % 100 == 0) {
        g.filter(GRAY); // apply gray filter
    }
}
