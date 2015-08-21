function setup() {
    createCanvas(600, 200, SVG);
    strokeWeight(20);
    stroke('#ED225D');
    line(0, 0, width, height);
}

function draw() {
    // get path element from current SVG Graphics
    var path = querySVG('g path')[0];
    // edit existing element
    path.attribute('stroke-width', frameCount % 100);
}
