import {testRender} from '../../lib';

describe('Shape/2d_primitives', function() {
    // the tests code are from p5.js's example reference
    var tests = {
        arc: function(p) {
            let {PI} = p;
            p.arc(50, 55, 50, 50, 0, PI * 0.5);
            p.noFill();
            p.arc(50, 55, 60, 60, PI * 0.5, PI * 1.5);
        },
        circle: function(p) {
            p.ellipse(56, 46, 55, 55);
        },
        ellipse: function(p) {
            p.ellipse(56, 46, 55, 35);
        },
        line: function(p) {
            p.strokeWeight(10);
            p.line(30, 20, 85, 20);
            p.stroke(126);
            p.line(85, 20, 85, 75);
            p.stroke(200);
            p.line(85, 75, 30, 75);
        },
        point: function(p) {
            p.point(30, 20);
            p.point(85, 20);
            p.point(85, 75);
            p.point(30, 75);
        },
        quad: function(p) {
            p.quad(38, 31, 86, 20, 69, 63, 30, 76);
        },
        rect: function(p) {
            p.rect(30, 20, 55, 55);
        },
        roundRect: function(p) {
            p.rect(30, 20, 55, 55, 20, 15, 10, 5);
        },
        triangle: function(p) {
            p.triangle(30, 75, 58, 20, 86, 75);
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
