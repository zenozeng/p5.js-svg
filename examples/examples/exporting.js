function setup() {
    createCanvas(600, 200, SVG); // Create SVG Canvas
    strokeWeight(2);
    stroke('#ED225D');
}

function draw() {
    var x = frameCount / 100;
    var y = sin(x * PI * 2);
    line(x * width, height * 0.5,
         x * width, y * height / 2 + height * 0.5);
    if (frameCount > 100) {
        noLoop();
        save();
    }
}
