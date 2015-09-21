var testRender = require('../../lib/test-render');

window.TESTIMG = window.__karma__ ? "/base/test/unit/filter/light_by_zenozeng.jpg" : "./unit/filter/light_by_zenozeng.jpg";

describe('Filters', function() {

    var tests = {
        // in SVG Renderer, I use feGaussianBlur,
        // but Canvas Renderer uses a pixels based blur (port of processing's blur),
        // so the results may not be exactly same.
        blur: function() {
            testRender.setMaxDiff(1); // ignore diff, see known issue
            testRender.setMaxPixelDiff(2);
            background(255);
            stroke(255, 0, 0);
            strokeWeight(10);
            line(0, 0, 100, 100);
            line(0, 100, 100, 0);
            filter(BLUR, 5);
        },
        gray: function() {
            testRender.setMaxPixelDiff(1);
            background(200, 100, 50);
            filter(GRAY);
        },
        invert: function() {
            testRender.setMaxPixelDiff(1);
            background(255, 0, 0);
            filter(INVERT);
            ellipse(50, 50, 50, 50);
        },
        threshold: function() {
            background(255, 0, 0);
            stroke(255);
            strokeWeight(10);
            line(0, 0, 100, 100);
            filter(THRESHOLD, 0.5);
        },
        opaque: function() {
            testRender.setMaxPixelDiff(1);
            background(255, 0, 0, 127);
            filter(OPAQUE); // Sets the alpha channel to 255
        },
        posterize: function() {
            testRender.lock();
            testRender.setMaxDiff(1); // ignore diff, see https://github.com/zenozeng/p5.js-svg/issues/124
            loadImage(TESTIMG, function(img) {
                image(img, 0, 0);
                filter(POSTERIZE, 2);
                if (_isSafari()) {
                }
                testRender.unlock();
            });
        },
        erode: function() {
            testRender.lock();
            testRender.setMaxDiff(1); // ignore diff, see known issue
            loadImage(TESTIMG, function(img) {
                image(img, 0, 0);
                filter(ERODE);
                testRender.unlock();
            });
        },
        dilate: function() {
            testRender.lock();
            testRender.setMaxDiff(1); // ignore diff, see known issue
            loadImage(TESTIMG, function(img) {
                image(img, 0, 0);
                filter(DILATE);
                testRender.unlock();
            });
        },
        custom: function() {
            testRender.setMaxPixelDiff(1);
            background(200, 100, 50);
            registerSVGFilter('mygray', p5.SVGFilters.gray);
            if (isSVG) {
                filter('mygray');
            } else {
                filter(GRAY);
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
