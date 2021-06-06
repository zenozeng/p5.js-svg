import {assert, p5, testRender} from '../../lib';

describe('Rendering', function() {
    this.timeout(0);

    describe('noCanvas', function() {
        it('should remove the <svg> created by createCanvas', function() {
            new p5(function(p) {
                p.setup = function() {
                    p.createCanvas(100, 100, p.SVG);
                    var svg = p._renderer.svg;
                    assert.strictEqual(true, document.body.contains(svg));
                    p.line(0, 0, 100, 100);
                    p.noCanvas();
                    assert.strictEqual(false, document.body.contains(svg));
                };
            });
        });
    });
    describe('createGraphics', function() {
        it('createGraphics: SVG API should draw same image as Canvas API', function(done) {
            testRender.describe('createGraphics');
            testRender(function(p) {
                let pg = p.createGraphics(400, 400, p.isSVG ? p.SVG : p.P2D);
                p.background(200);
                pg.background(100);
                pg.noStroke();
                pg.ellipse(pg.width/2, pg.height/2, 50, 50);
                p.image(pg, 50, 50);
                p.image(pg, 0, 0, 50, 50);
                p.ellipse(p.width/2, p.height/2, 50, 50);
            }, done);
        });
    });
    describe('resizeCanvas', function() {
        it('resizeCanvas: should be scaled', function(done) {
            testRender.describe('resizeCanvas: scaled');
            testRender(function(p) {
                p.resizeCanvas(200, 200);
                p.strokeWeight(10);
                p.ellipse(p.width/2, p.height/2, 50, 50);
            }, done);
        });
        it('resizeCanvas: all pixels should be cleared after resize', function(done) {
            testRender.describe('resizeCanvas: all pixels cleared');
            testRender(function(p) {
                p.ellipse(p.width/2, p.height/2, 50, 50);
                p.resizeCanvas(200, 200);
                p.resizeCanvas(100, 100);
                p.strokeWeight(10);
                p.ellipse(0, 0, 100, 100);
            }, done);
        });
    });
});
