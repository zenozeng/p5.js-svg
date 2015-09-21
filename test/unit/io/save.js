var assert = require('assert');
var p5 = require('../../lib/p5');
var testDownload = require('./test-download.js');

describe('IO/save', function() {
    this.timeout(1000 * 5);

    it('save()', function(done) {
        testDownload('untitled', 'svg', function(p) {
            p.save();
        }, done);
    });

    it('save(Graphics)', function(done) {
        testDownload('untitled', 'svg', function(p) {
            p.save(p._defaultGraphics);
        }, done);
    });

    it('save(<svg>)', function(done) {
        testDownload('untitled', 'svg', function(p) {
            p.save(p._renderer.svg);
        }, done);
    });

    it('canvas\'s save should still work', function(done) {
        new p5(function(p) {
            p.setup = function() {
                var _saveCanvas = p5.prototype.saveCanvas;
                p5.prototype.saveCanvas = function() {
                    p5.prototype.saveCanvas = _saveCanvas;
                    done();
                };
                p.save('canvas-save.png');
            };
        });
    });
});
