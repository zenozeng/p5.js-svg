describe('Shape/Vertex', function() {
    var tests = {
        contour: function() {
            translate(50, 50);
            stroke(255, 0, 0);
            beginShape();
            // Exterior part of shape, clockwise winding
            vertex(-40, -40);
            vertex(40, -40);
            vertex(40, 40);
            vertex(-40, 40);
            // Interior part of shape, counter-clockwise winding
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
        }
    };

    Object.keys(tests).forEach(function(key) {
        describe(key, function() {
            it(key + ': SVG API should draw same image as Canvas API', function(done) {
                testRender(tests[key], done);
            });
        });
    });
});
