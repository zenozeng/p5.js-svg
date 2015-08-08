var p5 = require('../../lib/p5');
var testRender = require('../../lib/test-render');
var assert = require('assert');

describe('Rendering', function() {
    describe('noCanvas', function() {
        it('should remove the <svg> created by createCanvas', function() {
            new p5(function(p) {
                p.setup = function() {
                    p.createSVG(100, 100);
                    var svg = p._graphics.svg;
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
                pg = createGraphics(400, 400, SVG);
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
    // describe('resizeCanvas', function() {
    //     it('resizeCanvas: SVG API should draw same image as Canvas API', function(done) {
    //         testRender.describe('resizeCanvas');
    //         testRender(function() {
    //             background(200);
    //             resizeCanvas(50, 50);
    //             pg.ellipse(width/2, height/2, 20, 20);
    //             resizeCanvas(100, 100);
    //         }, done);
    //     });
    // });
});
