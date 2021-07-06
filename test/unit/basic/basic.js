import {testRender} from '../../lib';

window.TESTIMG = window.__karma__ ? "/base/test/unit/filter/light_by_zenozeng.jpg" : "./unit/filter/light_by_zenozeng.jpg";

describe('Basic', function() {

    var tests = {
        resetMatrix: function(p) {
            p.applyMatrix(1, 0, 0, 1, 50, 50);
            p.rect(0, 0, 50, 50);
            p.resetMatrix();
            p.rect(0, 0, 20, 20);
        },
        push: function(p) {
            // https://p5js.org/reference/#/p5/push
            p.ellipse(0, 50, 33, 33);
            p.push();
            p.strokeWeight(10);
            p.fill(204, 153, 0);
            p.translate(50, 0);
            p.ellipse(0, 50, 33, 33);
            p.pop();
            p.ellipse(100, 50, 33, 33);
        }
    };

    Object.keys(tests).forEach(function(key) {
        describe("Basic/" + key, function() {
            it(key + ': SVG API should draw same image as Canvas API', function(done) {
                this.timeout(0);
                testRender.describe("Basic/" + key);
                testRender(tests[key], done);
            });
        });
    });

});
