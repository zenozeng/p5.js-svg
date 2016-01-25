var testRender = require('../../lib/test-render');

describe('Shape/2d_primitives', function() {
    // the tests code are from p5.js's example reference
    var tests = {
        arc: function() {
            arc(50, 55, 50, 50, 0, PI * 0.5);
            noFill();
            arc(50, 55, 60, 60, PI * 0.5, PI * 1.5);
        },
        circle: function() {
            ellipse(56, 46, 55, 55);
        },
        ellipse: function() {
            ellipse(56, 46, 55, 35);
        },
        line: function() {
            strokeWeight(10);
            line(30, 20, 85, 20);
            stroke(126);
            line(85, 20, 85, 75);
            stroke(200);
            line(85, 75, 30, 75);
        },
        point: function() {
            point(30, 20);
            point(85, 20);
            point(85, 75);
            point(30, 75);
        },
        quad: function() {
            quad(38, 31, 86, 20, 69, 63, 30, 76);
        },
        rect: function() {
            rect(30, 20, 55, 55);
        },
        roundRect: function() {
            rect(30, 20, 55, 55, 20, 15, 10, 5);
        },
        triangle: function() {
            triangle(30, 75, 58, 20, 86, 75);
        }
    };

    Object.keys(tests).forEach(function(key) {
        describe(key, function() {
            it(key + ': SVG API should draw same image as Canvas API', function(done) {
                testRender.describe(key);
                testRender(tests[key], done);
            });
        });
    });
});
