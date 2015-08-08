define(function(require) {

    var p5 = require('p5');
    require('p5.svg');
    var assert = require('chai').assert;
    var testRender = require('testRender');

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
                    pg = createGraphics(100, 100, isSVG ? SVG : P2D);
                    background(200);
                    pg.background(100);
                    pg.noStroke();
                    pg.ellipse(pg.width/2, pg.height/2, 50, 50);
                    image(pg, 50, 50);
                    image(pg, 0, 0, 50, 50);
                }, done);
            });
        });
    });
});
