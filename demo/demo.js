var n = 0;

function setup() {
    createSVG(100, 100);
    pg = createGraphics(400, 400, SVG);
    background(200);
    pg.background(100);
    pg.noStroke();
    pg.ellipse(pg.width/2, pg.height/2, 50, 50);
    loadGraphics(pg, function(pg) {
        image(pg, 50, 50);
        image(pg, 0, 0, 50, 50);
    });
    noLoop();
}

function draw() {
    background(100);
    n++;
    line(300, 300, 400, n % 50);
    ellipse(200, 200, 100, n % 50);
}
