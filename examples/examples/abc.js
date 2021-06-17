var svg, path;
function preload() {
    let container = document.createElement('div')
    ABCJS.renderAbc(container, "X:1\nK:D\nDDAA|BBA2|\n");
    svg = container.querySelector('svg');
    frameRate(20);
}

function setup() {
    createCanvas(600, 200, SVG);
    image(svg, 0, 0, 200, 200);
}

function draw() {
}
