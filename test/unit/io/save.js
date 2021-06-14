import {p5, assert} from '../../lib';
import {testDownload} from './test-download';

describe('IO/save', function() {
    this.timeout(1000 * 5);

    // See https://github.com/zenozeng/p5.js-svg/issues/176
    it('should generate valid svg output', async function() {
        const dataURL = await new Promise((resolve) => {
            new p5((p) => {
                p.setup = function () {
                    p.createCanvas(600, 600, p.SVG);
                    p.downloadFile = function(dataURL) {
                        resolve(dataURL)
                    }
                }

                p.draw = function() {
                    p.rect(0, 0, 100, 100);
                    p.line(30, 20, 85, 75);
                    p.save();
                    p.noLoop();
                }
            })
        });
        assert.equal(dataURL.indexOf('#'), -1);
    })

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
