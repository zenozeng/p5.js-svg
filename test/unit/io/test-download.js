define(function(require) {
    var p5 = require('p5');
    require('p5.svg');
    var assert = require('chai').assert;

    var testDownload = function(filename, ext, fn, done, useCanvas) {
        new p5(function(p) {
            p.setup = function() {
                useCanvas ? p.createCanvas(100, 100) : p.createSVG(100, 100);
                p.background(255);
                p.stroke(0, 0, 0);
                p.strokeWeight(3);
                p.line(0, 0, 100, 100);

                var _downloadFile = p5.prototype.downloadFile;
                p5.prototype.downloadFile = function(dataURL, _filename, _ext) {
                    try {
                        assert.notEqual(dataURL.indexOf('image/octet-stream'), -1);
                        assert.equal(_filename, filename);
                        assert.equal(_ext, ext);
                        useCanvas ? p.noCanvas() : p.noSVG();
                        done();
                    } catch(e) {
                        useCanvas ? p.noCanvas() : p.noSVG();
                        done(e);
                    }
                };
                fn(p);
            };
        });
    };

    return testDownload;
});
