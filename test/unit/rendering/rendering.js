var p5 = require('../../lib/p5');
var testRender = require('../../lib/test-render');
var assert = require('assert');

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
            testRender(function() {
                pg = createGraphics(400, 400, isSVG ? SVG : P2D);
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
                testRender.wait(1000); // wait loadGraphics before run diff
            }, done);
        });
    });
    describe('resizeCanvas', function() {
        it('resizeCanvas: should be scaled', function(done) {
            testRender.describe('resizeCanvas: scaled');
            testRender(function() {
                resizeCanvas(200, 200);
                strokeWeight(10);
                ellipse(width/2, height/2, 50, 50);
            }, done);
        });
        it('resizeCanvas: all pixels should be cleared after resize', function(done) {
            testRender.describe('resizeCanvas: all pixels cleared');
            testRender(function() {
                ellipse(width/2, height/2, 50, 50);
                resizeCanvas(200, 200);
                resizeCanvas(100, 100);
                strokeWeight(10);
                ellipse(0, 0, 100, 100);
            }, done);
        });
    });
});
