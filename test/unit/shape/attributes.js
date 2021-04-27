import {testRender} from '../../lib';

describe('Shape/Attributes', function() {
    // the tests code are from p5.js's example reference
    var tests = {
        strokeWeight: function(p) {
            p.strokeWeight(10);
            p.line(0, 0, 100, 100);
            p.strokeWeight(5);
            p.line(0, 0, 50, 100);
        },
        strokeCap: function(p) {
            p.strokeWeight(12.0);
            p.strokeCap(p.ROUND);
            p.line(20, 30, 80, 30);
            p.strokeCap(p.SQUARE);
            p.line(20, 50, 80, 50);
            p.strokeCap(p.PROJECT);
            p.line(20, 70, 80, 70);
        },
        strokeJoinMiter: function(p) {
            p.noFill();
            p.strokeWeight(10.0);
            p.strokeJoin(p.MITER);
            p.beginShape();
            p.vertex(35, 20);
            p.vertex(65, 50);
            p.vertex(35, 80);
            p.endShape();
        },
        strokeJoinBevel: function(p) {
            p.noFill();
            p.strokeWeight(10.0);
            p.strokeJoin(p.BEVEL);
            p.beginShape();
            p.vertex(35, 20);
            p.vertex(65, 50);
            p.vertex(35, 80);
            p.endShape();
        },
        strokeJoinRound: function(p) {
            p.noFill();
            p.strokeWeight(10.0);
            p.strokeJoin(p.ROUND);
            p.beginShape();
            p.vertex(35, 20);
            p.vertex(65, 50);
            p.vertex(35, 80);
            p.endShape();
        },
        ellipseModeRadius: function(p) {
            p.ellipseMode(p.RADIUS);
            p.fill(255);
            p.ellipse(50, 50, 30, 30);
        },
        ellipseModeCenter: function(p) {
            p.ellipseMode(p.RADIUS);
            p.fill(255);
            p.ellipse(50, 50, 30, 30);
            p.ellipseMode(p.CENTER);
            p.fill(100);
            p.ellipse(50, 50, 30, 30);
        },
        ellipseModeCorner: function(p) {
            p.ellipseMode(p.RADIUS);
            p.fill(255);
            p.ellipse(50, 50, 30, 30);
            p.ellipseMode(p.CORNER);
            p.fill(255);
            p.ellipse(25, 25, 50, 50);
        },
        ellipseModeCorners: function(p) {
            p.ellipseMode(p.RADIUS);
            p.fill(255);
            p.ellipse(50, 50, 30, 30);
            p.ellipseMode(p.CORNERS);
            p.fill(100);
            p.ellipse(25, 25, 50, 50);
        },
        rectModeCornerAndCorners: function(p) {
            testRender.setMaxDiff(0.12);
            p.rectMode(p.CORNER);
            p.fill(255);
            p.rect(25, 25, 50, 50);

            p.rectMode(p.CORNERS);
            p.fill(100);
            p.rect(25, 25, 50, 50);
        },
        rectModeRadiusAndCenter: function(p) {
            testRender.setMaxDiff(0.12);
            p.rectMode(p.RADIUS);
            p.fill(255);
            p.rect(50, 50, 30, 30);

            p.rectMode(p.CENTER);
            p.fill(100);
            p.rect(50, 50, 30, 30);
        },
        smooth: function(p) {
            p.background(0);
            p.fill(255);
            p.noStroke();
            p.smooth();
            p.ellipse(30, 48, 36, 36);
            p.noSmooth();
            p.ellipse(70, 48, 36, 36);
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
