var img;
function setup() {
    createCanvas(600, 200, SVG);
    img = createGraphics(200, 200, SVG);
    img.strokeWeight(50);
    img.stroke('#ED225D');
    img.ellipse(img.width / 2, img.height / 2, img.width - 50, img.height - 50);
}

var pos = -200;
var speed = 3;
function draw() {
    clear();
    pos += 2;
    if (pos > 600) {
        pos = -200;
    }
    image(img, pos, 0, 200, 200);
}
