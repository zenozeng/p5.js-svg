var testRender = require('../../lib/test-render');

describe('Shape/Vertex', function() {
    var tests = {
        contour: function() {
            translate(50, 50);
            stroke(255, 0, 0);
            beginShape();
            vertex(-40, -40);
            vertex(40, -40);
            vertex(40, 40);
            vertex(-40, 40);
            beginContour();
            vertex(-20, -20);
            vertex(-20, 20);
            vertex(20, 20);
            vertex(20, -20);
            endContour();
            endShape(CLOSE);
            translate(-50, -50);
        },
        bezierVertex: function() {
            beginShape();
            vertex(30, 20);
            bezierVertex(80, 0, 80, 75, 30, 75);
            bezierVertex(50, 80, 60, 25, 30, 20);
            endShape();
        },
        curveVertex: function() {
            noFill();
            beginShape();
            curveVertex(84,  91);
            curveVertex(84,  91);
            curveVertex(68,  19);
            curveVertex(21,  17);
            curveVertex(32, 100);
            curveVertex(32, 100);
            endShape();
        },
        quadraticVertex: function() {
            noFill();
            strokeWeight(4);
            beginShape();
            vertex(20, 20);
            quadraticVertex(80, 20, 50, 50);
            quadraticVertex(20, 80, 80, 80);
            vertex(80, 60);
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
