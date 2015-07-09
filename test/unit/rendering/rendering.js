define(function(require) {

    var p5 = require('p5');
    require('p5.svg');
    var assert = require('chai').assert;
    var testRender = require('testRender');

    describe('Rendering', function() {
        describe('createSVG', function() {
            it('should be 100 * 100 by default', function() {
                new p5(function(p) {
                    p.setup = function() {
                        p.createSVG();
                        assert.equal(p.canvas.width, 100);
                        assert.equal(p.canvas.height, 100);
                    };
                });
            });
        });
        describe('noSVG', function() {
            it('should remove the <svg> created by createSVG', function() {
                new p5(function(p) {
                    p.setup = function() {
                        p.createSVG(100, 100);
                        var svg = p.svg;
                        p.line(0, 0, 100, 100);
                        p.noSVG();
                        assert.strictEqual(svg.parentElement, null);
                        assert.strictEqual(p.svg, null);
                        // assert.strictEqual(p.canvas, null);
                    };
                });
            });
        });
        describe('createGraphics', function() {
            it('createGraphics: SVG API should draw same image as Canvas API', function(done) {
                testRender.describe('createGraphics');
                testRender(function() {
                    if (isSVG) {
                    }
                }, done);
            });
        });
    });
});
