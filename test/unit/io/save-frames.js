var assert = require('assert');
var p5 = require('../../lib/p5');

describe('IO/saveFrames', function() {
    it('should capture canvas frames', function(done) {
        new p5(function(p) {
            p.setup = function() {
                p.createCanvas(100, 100);
                p.strokeWeight(3);
                p.saveFrames('hello', 'png', 3, 10, function(frames) {
                    try {
                        assert.ok(frames.length > 1);
                        p.noCanvas();
                        done();
                    } catch (e) {
                        p.noCanvas();
                        done(e);
                    }
                });
            };
            p.draw = function() {
                var i = p.frameCount * 2;
                p.line(0, 0, i, i);
            };
        });
    });

    it('should capture svg frames', function(done) {
        new p5(function(p) {
            p.setup = function() {
                p.createCanvas(100, 100, p.SVG);
                p.strokeWeight(3);
                p.saveFrames('hello', 'svg', 0.5, 10, function(frames) {
                    try {
                        assert.ok(frames.length > 1);
                        p.noCanvas();
                        done();
                    } catch (e) {
                        p.noCanvas();
                        done(e);
                    }
                });
            };
            p.draw = function() {
                var i = p.frameCount * 2;
                p.line(0, 0, i, i);
            };
        });
    });

    it('should capture svg frames even omitting duration and fps', function(done) {
        this.timeout(0);
        new p5(function(p) {
            p.setup = function() {
                p.createCanvas(100, 100, p.SVG);
                p.strokeWeight(3);
                p.saveFrames('hello', 'svg', null, null, function(frames) {
                    try {
                        assert.ok(frames.length > 1);
                        p.noCanvas();
                        done();
                    } catch (e) {
                        p.noCanvas();
                        done(e);
                    }
                });
            };
            p.draw = function() {
                var i = p.frameCount * 2;
                p.line(0, 0, i, i);
            };
        });
    });

    it('should download svg frames', function(done) {
        new p5(function(p) {
            p.setup = function() {
                p.createCanvas(100, 100, p.SVG);
                var _downloadFile = p.downloadFile;
                var count = 0;
                var _done;
                p.downloadFile = function() {
                    count++;
                    if (count > 1) {
                        if (!_done) {
                            p.noCanvas();
                            done();
                            _done = true;
                        }
                    }
                };
                p.saveFrames('hello', 'svg', 0.5, 10);
            };
            p.draw = function() {
                var i = p.frameCount * 2;
                p.line(0, 0, i, i);
            };
        });
    });

    it('should wait all pending jobs done', function(done) {
        this.timeout(0);
        new p5(function(p) {
            p.setup = function() {
                p.createCanvas(100, 100, p.SVG);
                var pending = 0;
                var _makeSVGFrame = p._makeSVGFrame;
                p._makeSVGFrame = function(options) {
                    // slow version
                    pending++;
                    setTimeout(function() {
                        _makeSVGFrame.call(p, options);
                    }, 500);
                };
                p.downloadFile = function() {
                    pending--;
                    if (pending === 0) {
                        p.noCanvas();
                        done();
                    }
                };
                p.saveFrames('hello', 'svg', 0.5, 10);
            };
            p.draw = function() {
                var i = p.frameCount * 2;
                p.line(0, 0, i, i);
            };
        });
    });
});
