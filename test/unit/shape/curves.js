var testRender = require('../../lib/test-render');

describe('Shape/Curves', function() {

    var tests = {
        bezier: function() {
            noFill();
            stroke(255, 102, 0);
            stroke(0, 0, 0);
            bezier(85, 20, 10, 10, 90, 90, 15, 80);
        },
        bezierPoint: function() {
            noFill();
            bezier(85, 20, 10, 10, 90, 90, 15, 80);
            fill(255);
            stroke(100);
            steps = 10;
            for (var i = 0; i <= steps; i++) {
                var t = i / steps;
                x = bezierPoint(85, 10, 90, 15, t);
                y = bezierPoint(20, 10, 90, 80, t);
                ellipse(x, y, 5, 5);
            }
        },
        bezierTangent: function() {
            noFill();
            bezier(85, 20, 10, 10, 90, 90, 15, 80);
            steps = 6;
            fill(255);
            strokeWeight(10);
            for (i = 0; i <= steps; i++) {
                t = i / steps;
                x = bezierPoint(85, 10, 90, 15, t);
                y = bezierPoint(20, 10, 90, 80, t);
                tx = bezierTangent(85, 10, 90, 15, t);
                ty = bezierTangent(20, 10, 90, 80, t);
                a = atan2(ty, tx);
                a += PI;
                stroke(255, 102, 0);
                line(x, y, cos(a)*30 + x, sin(a)*30 + y);
                stroke(0);
                // ellipse(x, y, 5, 5);
            }
        },
        curve: function() {
            noFill();
            stroke(255, 102, 0);
            curve(5, 26, 5, 26, 73, 24, 73, 61);
            stroke(0);
            curve(5, 26, 73, 24, 73, 61, 15, 65);
            stroke(255, 102, 0);
            curve(73, 24, 73, 61, 15, 65, 15, 65);
        },
        curvePoint: function() {
            noFill();
            curve(5, 26, 5, 26, 73, 24, 73, 61);
            curve(5, 26, 73, 24, 73, 61, 15, 65);
            fill(255);
            ellipseMode(CENTER);
            steps = 6;
            for (i = 0; i <= steps; i++) {
                t = i / steps;
                x = curvePoint(5, 5, 73, 73, t);
                y = curvePoint(26, 26, 24, 61, t);
                ellipse(x, y, 5, 5);
                x = curvePoint(5, 73, 73, 15, t);
                y = curvePoint(26, 24, 61, 65, t);
                ellipse(x, y, 5, 5);
            }
        },
        curveTangent: function() {
            noFill();
            curve(5, 26, 73, 24, 73, 61, 15, 65);
            steps = 6;
            for (i = 0; i <= steps; i++) {
                t = i / steps;
                x = curvePoint(5, 73, 73, 15, t);
                y = curvePoint(26, 24, 61, 65, t);
                //ellipse(x, y, 5, 5);
                tx = curveTangent(5, 73, 73, 15, t);
                ty = curveTangent(26, 24, 61, 65, t);
                a = atan2(ty, tx);
                a -= PI/2.0;
                line(x, y, cos(a)*8 + x, sin(a)*8 + y);
            }
        },
        curveTightness: function() {
            curveTightness(10);
            beginShape();
            curveVertex(10, 26);
            curveVertex(10, 26);
            curveVertex(83, 24);
            curveVertex(83, 61);
            curveVertex(25, 65);
            curveVertex(25, 65);
            endShape();
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
