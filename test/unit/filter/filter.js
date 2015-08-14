var testRender = require('../../lib/test-render');

describe('Filters', function() {

    var tests = {
        // in SVG Renderer, I use feGaussianBlur,
        // but Canvas Renderer uses a pixels based blur (port of processing's blur),
        // so the results may not be exactly same.
        // blur: function() {
        //     background(255);
        //     stroke(255, 0, 0);
        //     strokeWeight(10);
        //     line(0, 0, 100, 100);
        //     line(0, 100, 100, 0);
        //     filter(BLUR, 10);
        // }
        gray: function() {
            background(200, 100, 50);
            filter(GRAY);
        },
        threshold: function() {
            background(255, 0, 0);
            stroke(255);
            strokeWeight(10);
            line(0, 0, 100, 100);
            filter(THRESHOLD, 0.5);
        },
        invert: function() {
            background(255, 0, 0);
            filter(INVERT);
        }
    };

    Object.keys(tests).forEach(function(key) {
        describe("Filters/" + key, function() {
            it(key + ': SVG API should draw same image as Canvas API', function(done) {
                testRender.describe("Filters/" + key);
                testRender(tests[key], done);
            });
        });
    });

});
