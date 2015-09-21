var assert = require('assert');
var testDownload = require('./test-download.js');
var p5 = require('../../lib/p5');

describe('IO/saveSVG', function() {

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
    it('source is Graphics', function(done) {
        testDownload('source-graphics', 'png', function(p) {
            var pg = p.createGraphics(100, 100, p.SVG);
            pg.background(100);
            p.saveSVG(pg, 'source-graphics.png');
        }, done);
    });
    it('source is <svg>', function(done) {
        testDownload('source-svg', 'png', function(p) {
            var pg = p.createGraphics(100, 100, p.SVG);
            pg.background(100);
            p.saveSVG(pg._renderer.svg, 'source-svg.png');
        }, done);
    });
    it('should throw if given unsupported type', function() {
        new p5(function(p) {
            p.setup = function() {
                p.createCanvas(100, 100, p.SVG);
                p.background(255);
                p.stroke(0, 0, 0);
                p.line(0, 0, 100, 100);
                assert.throws(function() {
                    p.saveSVG('hello.txt');
                });
                p.noCanvas();
            };
        });
    });
});
