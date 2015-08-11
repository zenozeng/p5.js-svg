var p5 = require('../../lib/p5');
var assert = require('assert');

describe('SVG Manipulating API', function() {
    it('Manipulate SVG', function() {
        new p5(function(p) {
            var svg;
            var url;
            p.preload = function() {
                svg = p.loadSVG(url);
            };
            p.setup = function() {
                var pg = p.createCanvas(400, 400, p.SVG);
                pg.image(svg, 0, 0, 400, 400);
                var paths = pg.querySVG('path');
            };
        });
    });
});
