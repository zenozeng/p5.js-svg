define(function(require) {
    var p5 = require('p5');
    require('p5.svg');
    var assert = require('chai').assert;

    describe('IO/saveFrames', function() {
        it('should capture canvas frames', function(done) {
            new p5(function(p) {
                p.setup = function() {
                    p.createCanvas(100, 100);
                    p.strokeWeight(3);
                    p.saveFrames('hello', 'png', 0.5, 10, function(frames) {
                        try {
                            assert.ok(frames.length > 1);
                            done();
                        } catch (e) {
                            done(e);
                        } finally {
                            p.noCanvas();
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
                    p.createSVG(100, 100);
                    p.strokeWeight(3);
                    p.saveFrames('hello', 'svg', 0.5, 10, function(frames) {
                        try {
                            assert.ok(frames.length > 1);
                            done();
                        } catch (e) {
                            done(e);
                        }
                        p.noSVG();
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
                    p.createSVG(100, 100);
                    p.strokeWeight(3);
                    p.saveFrames('hello', 'svg', null, null, function(frames) {
                        try {
                            assert.ok(frames.length > 1);
                            done();
                        } catch (e) {
                            done(e);
                        }
                        p.noSVG();
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
                    p.createSVG(100, 100);
                    var _downloadFile = p.downloadFile;
                    var count = 0;
                    p.downloadFile = function() {
                        count++;
                        if (count > 1) {
                            done();
                            p.noSVG();
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
            new p5(function(p) {
                p.setup = function() {
                    p.createSVG(100, 100);
                    var _downloadFile = p.downloadFile;
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
                            done();
                            p.noSVG();
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

});
