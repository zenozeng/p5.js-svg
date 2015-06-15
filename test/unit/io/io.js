define(function(require) {
    var p5 = require('p5');
    require('p5.svg');

    describe('IO', function() {
        describe('IO/SVG', function() {
            it('should save SVG', function() {
                new p5(function(p) {
                    p.setup = function() {
                        p.createSVG(100, 100);
                        p.stroke(0, 0, 0);
                        p.line(0, 0, 100, 100);
                        p.saveSVG();
                    };
                });
            });
        });
    });
});
