var testRender = require('../../lib/test-render');

describe('Filters', function() {
    var tests = {
        // blur: function(done) {
        //     background(255);
        //     stroke(255, 0, 0);
        //     strokeWeight(10);
        //     line(0, 0, 100, 100);
        //     line(0, 100, 100, 0);
        //     filter(BLUR, 10);
        // }
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
