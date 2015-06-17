define(function(require) {

    var p5 = require('p5');
    require('p5.svg');
    var assert = require('chai').assert;

    describe('Rendering', function() {
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
    });
});
