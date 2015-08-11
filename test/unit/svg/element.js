var p5 = require('../../lib/p5');
var assert = require('assert');

describe('SVG Element API', function() {
    describe('querySVG', function() {
        new p5(function(p) {
            p.setup = function() {
                p.createCanvas(100, 100, p.SVG);
                p.ellipse(50, 50, 50, 50);
                assert.equal(p.querySVG('path').nodeName.toLowerCase(), 'path');

                var pg = p.createGraphics(100, 100, p.SVG);
                pg.ellipse(60, 60, 50, 50);
                assert.equal(pg.querySVG('path').nodeName.toLowerCase(), 'path');
            };
        });
    });
});
