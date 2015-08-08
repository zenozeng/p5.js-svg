var testRender = require('../../lib/test-render');

describe('Shape/Attributes', function() {
    // the tests code are from p5.js's example reference
    var tests = {
        strokeWeight: function() {
            strokeWeight(10);
            line(0, 0, 100, 100);
            strokeWeight(5);
            line(0, 0, 50, 100);
        },
        strokeCap: function() {
            strokeWeight(12.0);
            strokeCap(ROUND);
            line(20, 30, 80, 30);
            strokeCap(SQUARE);
            line(20, 50, 80, 50);
            strokeCap(PROJECT);
            line(20, 70, 80, 70);
        },
        strokeJoinMiter: function() {
            noFill();
            strokeWeight(10.0);
            strokeJoin(MITER);
            beginShape();
            vertex(35, 20);
            vertex(65, 50);
            vertex(35, 80);
            endShape();
        },
        strokeJoinBevel: function() {
            noFill();
            strokeWeight(10.0);
            strokeJoin(BEVEL);
            beginShape();
            vertex(35, 20);
            vertex(65, 50);
            vertex(35, 80);
            endShape();
        },
        strokeJoinRound: function() {
            noFill();
            strokeWeight(10.0);
            strokeJoin(ROUND);
            beginShape();
            vertex(35, 20);
            vertex(65, 50);
            vertex(35, 80);
            endShape();
        },
        ellipseModeRadius: function() {
            ellipseMode(RADIUS);
            fill(255);
            ellipse(50, 50, 30, 30);
        },
        ellipseModeCenter: function() {
            ellipseMode(RADIUS);
            fill(255);
            ellipse(50, 50, 30, 30);
            ellipseMode(CENTER);
            fill(100);
            ellipse(50, 50, 30, 30);
        },
        ellipseModeCorner: function() {
            ellipseMode(RADIUS);
            fill(255);
            ellipse(50, 50, 30, 30);
            ellipseMode(CORNER);
            fill(255);
            ellipse(25, 25, 50, 50);
        },
        ellipseModeCorners: function() {
            ellipseMode(RADIUS);
            fill(255);
            ellipse(50, 50, 30, 30);
            ellipseMode(CORNERS);
            fill(100);
            ellipse(25, 25, 50, 50);
        },
        rectModeCornerAndCorners: function() {
            rectMode(CORNER);
            fill(255);
            rect(25, 25, 50, 50);

            rectMode(CORNERS);
            fill(100);
            rect(25, 25, 50, 50);
        },
        rectModeRadiusAndCenter: function() {
            rectMode(RADIUS);
            fill(255);
            rect(50, 50, 30, 30);

            rectMode(CENTER);
            fill(100);
            rect(50, 50, 30, 30);
        },
        smooth: function() {
            background(0);
            fill(255);
            noStroke();
            smooth();
            ellipse(30, 48, 36, 36);
            noSmooth();
            ellipse(70, 48, 36, 36);
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
