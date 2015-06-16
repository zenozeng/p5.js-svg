define(function(require) {
    var p5 = require('p5');
    require('p5.svg');
    var assert = require('chai').assert;

    describe('IO', function() {
        describe('IO/saveSVG', function() {
            var testDownload = function(filename, ext, fn, done) {
                new p5(function(p) {
                    p.setup = function() {
                        p.createSVG(100, 100);
                        p.background(255);
                        p.stroke(0, 0, 0);
                        p.line(0, 0, 100, 100);

                        p.downloadFile = function(dataURL, _filename, _ext) {
                            try {
                                assert.notEqual(dataURL.indexOf('image/octet-stream'), -1);
                                assert.equal(_filename, filename);
                                assert.equal(_ext, ext);
                                done();
                                p.svg.remove();
                            } catch(e) {
                                done(e);
                            }
                        };
                        fn(p);
                    };
                });
            };

            it('should save untitled.svg', function(done) {
                testDownload('untitled', 'svg', function(p) {
                    p.saveSVG();
                }, done);
            });
            it('should save hello.svg', function(done) {
                testDownload('hello', 'svg', function(p) {
                    p.saveSVG('hello.svg');
                }, done);
            });
            it('should save hello.jpg', function(done) {
                testDownload('hello', 'jpg', function(p) {
                    p.saveSVG('hello', 'jpg');
                }, done);
            });
            it('should save hello.jpeg', function(done) {
                testDownload('hello', 'jpeg', function(p) {
                    p.saveSVG('hello.jpeg');
                }, done);
            });
            it('should save hello.png', function(done) {
                testDownload('hello', 'png', function(p) {
                    p.saveSVG('hello.png');
                }, done);
            });
        });

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
                            }
                            p.canvas.remove();
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
                            p.svg.remove();
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
                                p.svg.remove();
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
});
