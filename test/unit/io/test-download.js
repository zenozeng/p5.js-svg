var assert = require('assert');
var p5 = require('../../lib/p5');

var testDownload = function(filename, ext, fn, done, useCanvas) {
    new p5(function(p) {
        p.setup = function() {
            p.createCanvas(100, 100, useCanvas ? p.P2D : p.SVG);
            p.background(255);
            p.stroke(0, 0, 0);
            p.strokeWeight(3);
            p.line(0, 0, 100, 100);

            p.downloadFile = function(dataURL, _filename, _ext) {
                try {
                    assert.notEqual(dataURL.indexOf('image/octet-stream'), -1);
                    assert.equal(_filename, filename);
                    assert.equal(_ext, ext);
                    p.noCanvas();
                    done();
                } catch(e) {
                    p.noCanvas();
                    done(e);
                }
            };
            fn(p);
        };
    });
};

module.exports = testDownload;
