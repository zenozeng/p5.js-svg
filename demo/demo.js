function setup() {
    createCanvas(100, 100, SVG);
    var pg = createGraphics(400, 400, SVG);
    background(200);
    pg.background(100);
    pg.noStroke();
    pg.ellipse(pg.width/2, pg.height/2, 50, 50);
    loadGraphics(pg, function(pg) {
        image(pg, 50, 50);
        image(pg, 0, 0, 50, 50);
        ellipse(width/2, height/2, 50, 50);
    }, function(err) {
        console.error(err);
    });
    noLoop();
}

function draw() {}
