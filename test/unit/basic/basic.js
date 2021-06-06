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
