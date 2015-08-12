var p5 = require('../../lib/p5');
var assert = require('assert');

var SVGDataURL = 'data:image/svg+xml;charset=utf-8,<svg%20version%3D"1.1"%20xmlns%3D"http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg"%20xmlns%3Axlink%3D"http%3A%2F%2Fwww.w3.org%2F1999%2Fxlink"%20width%3D"100"%20height%3D"100"%20viewBox%3D"0%200%20100%20100"><defs%2F><g%20transform%3D"scale(1%2C1)"%2F><g><path%20fill%3D"none"%20stroke%3D"rgb(0%2C0%2C0)"%20paint-order%3D"fill%20stroke%20markers"%20d%3D"%20M%200%200%20L%20100%20100"%20stroke-opacity%3D"1"%20stroke-linecap%3D"round"%20stroke-miterlimit%3D"10"%20stroke-width%3D"10"%2F><g%20transform%3D"translate(0.5%2C0.5)"><path%20fill%3D"none"%20stroke%3D"rgb(0%2C0%2C0)"%20paint-order%3D"fill%20stroke%20markers"%20d%3D"%20M%200%200%20L%2050%20100"%20stroke-opacity%3D"1"%20stroke-linecap%3D"round"%20stroke-miterlimit%3D"10"%20stroke-width%3D"5"%2F><g%20transform%3D"translate(-0.5%2C-0.5)"%2F><%2Fg><%2Fg><%2Fsvg>';

var SVGHTTPURL = window.__karma__ ? "/base/test/unit/svg/test.svg" : "./unit/svg/test.svg";

describe('SVG Manipulating API', function() {
    it('Manipulate SVG', function(done) {
        new p5(function(p) {
            var svg;
            var svg2;
            p.preload = function() {
                svg = p.loadSVG(SVGDataURL);
                svg2 = p.loadSVG(SVGHTTPURL);
            };
            p.setup = function() {
                svg2.query("path")[0].attribute("stroke-width", 100);
                var pg = p.createGraphics(400, 400, p.SVG);
                pg.image(svg, 0, 0, 400, 400);
                var paths = pg.querySVG('path');
                try {
                    assert.equal(paths.length, 2);
                    paths[0].attribute("stroke-width", 1);
                    assert.equal(paths[0].attribute("stroke-width"), 1);
                    pg.image(svg2, 0, 0);
                    assert.equal(pg.querySVG('path')[2].attribute("stroke-width"),
                                 100);
                    done();
                } catch(e) {
                    done(e);
                }
            };
        });
    });
});
