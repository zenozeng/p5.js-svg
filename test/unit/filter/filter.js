import {testRender} from '../../lib';

window.TESTIMG = window.__karma__ ? "/base/test/unit/filter/light_by_zenozeng.jpg" : "./unit/filter/light_by_zenozeng.jpg";

describe('Filters', function() {

    var tests = {
        // in SVG Renderer, I use feGaussianBlur,
        // but Canvas Renderer uses a pixels based blur (port of processing's blur),
        // so the results may not be exactly same.
        blur: function(p) {
            testRender.setMaxDiff(1); // ignore diff, see known issue
            testRender.setMaxPixelDiff(2);
            p.background(255);
            p.stroke(255, 0, 0);
            p.strokeWeight(10);
            p.line(0, 0, 100, 100);
            p.line(0, 100, 100, 0);
            p.filter(p.BLUR, 5);
        },
        gray: function(p) {
            testRender.setMaxPixelDiff(1);
            p.background(200, 100, 50);
            p.filter(p.GRAY);
        },
        invert: function(p) {
            testRender.setMaxPixelDiff(1);
            p.background(255, 0, 0);
            p.filter(p.INVERT);
            p.ellipse(50, 50, 50, 50);
        },
        threshold: function(p) {
            p.background(255, 0, 0);
            p.stroke(255);
            p.strokeWeight(10);
            p.line(0, 0, 100, 100);
            p.filter(p.THRESHOLD, 0.5);
        },
        opaque: function(p) {
            testRender.setMaxPixelDiff(1);
            p.background(255, 0, 0, 127);
            p.filter(p.OPAQUE); // Sets the alpha channel to 255
        },
        posterize: function(p) {
            testRender.lock();
            testRender.setMaxDiff(1); // ignore diff, see https://github.com/zenozeng/p5.js-svg/issues/124
            p.loadImage(TESTIMG, function(img) {
                p.image(img, 0, 0);
                p.filter(p.POSTERIZE, 2);
                testRender.unlock();
            });
        },
        erode: function(p) {
            testRender.lock();
            testRender.setMaxDiff(1); // ignore diff, see known issue
            p.loadImage(TESTIMG, function(img) {
                p.image(img, 0, 0);
                p.filter(p.ERODE);
                testRender.unlock();
            });
        },
        dilate: function(p) {
            testRender.lock();
            testRender.setMaxDiff(1); // ignore diff, see known issue
            p.loadImage(TESTIMG, function(img) {
                p.image(img, 0, 0);
                p.filter(p.DILATE);
                testRender.unlock();
            });
        },
        custom: function(p) {
            testRender.setMaxPixelDiff(1);
            p.background(200, 100, 50);
            p.registerSVGFilter('mygray', p5.SVGFilters.gray);
            if (p.isSVG) {
                p.filter('mygray');
            } else {
                p.filter(p.GRAY);
            }
        }
    };

    Object.keys(tests).forEach(function(key) {
        describe("Filters/" + key, function() {
            it(key + ': SVG API should draw same image as Canvas API', function(done) {
                this.timeout(0);
                testRender.describe("Filters/" + key);
                testRender(tests[key], done);
            });
        });
    });

});
