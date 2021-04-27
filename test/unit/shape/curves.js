import {testRender} from '../../lib';

describe('Shape/Curves', function() {

    var tests = {
        bezier: function(p) {
            p.noFill();
            p.stroke(255, 102, 0);
            p.stroke(0, 0, 0);
            p.bezier(85, 20, 10, 10, 90, 90, 15, 80);
        },
        bezierPoint: function(p) {
            p.noFill();
            p.bezier(85, 20, 10, 10, 90, 90, 15, 80);
            p.fill(255);
            p.stroke(100);
            let steps = 10;
            for (var i = 0; i <= steps; i++) {
                var t = i / steps;
                let x = p.bezierPoint(85, 10, 90, 15, t);
                let y = p.bezierPoint(20, 10, 90, 80, t);
                p.ellipse(x, y, 5, 5);
            }
        },
        bezierTangent: function(p) {
            p.noFill();
            p.bezier(85, 20, 10, 10, 90, 90, 15, 80);
            let steps = 6;
            p.fill(255);
            p.strokeWeight(10);
            for (let i = 0; i <= steps; i++) {
                let t = i / steps;
                let x = p.bezierPoint(85, 10, 90, 15, t);
                let y = p.bezierPoint(20, 10, 90, 80, t);
                let tx = p.bezierTangent(85, 10, 90, 15, t);
                let ty = p.bezierTangent(20, 10, 90, 80, t);
                let a = p.atan2(ty, tx);
                a += p.PI;
                p.stroke(255, 102, 0);
                p.line(x, y, p.cos(a)*30 + x, p.sin(a)*30 + y);
                p.stroke(0);
            }
        },
        curve: function(p) {
            p.noFill();
            p.stroke(255, 102, 0);
            p.curve(5, 26, 5, 26, 73, 24, 73, 61);
            p.stroke(0);
            p.curve(5, 26, 73, 24, 73, 61, 15, 65);
            p.stroke(255, 102, 0);
            p.curve(73, 24, 73, 61, 15, 65, 15, 65);
        },
        curvePoint: function(p) {
            p.noFill();
            p.curve(5, 26, 5, 26, 73, 24, 73, 61);
            p.curve(5, 26, 73, 24, 73, 61, 15, 65);
            p.fill(255);
            p.ellipseMode(p.CENTER);
            let steps = 6;
            for (let i = 0; i <= steps; i++) {
                let t = i / steps;
                let x = p.curvePoint(5, 5, 73, 73, t);
                let y = p.curvePoint(26, 26, 24, 61, t);
                p.ellipse(x, y, 5, 5);
                x = p.curvePoint(5, 73, 73, 15, t);
                y = p.curvePoint(26, 24, 61, 65, t);
                p.ellipse(x, y, 5, 5);
            }
        },
        curveTangent: function(p) {
            p.noFill();
            p.curve(5, 26, 73, 24, 73, 61, 15, 65);
            let steps = 6;
            for (let i = 0; i <= steps; i++) {
                let t = i / steps;
                let x = p.curvePoint(5, 73, 73, 15, t);
                let y = p.curvePoint(26, 24, 61, 65, t);
                //ellipse(x, y, 5, 5);
                let tx = p.curveTangent(5, 73, 73, 15, t);
                let ty = p.curveTangent(26, 24, 61, 65, t);
                let a = p.atan2(ty, tx);
                a -= p.PI/2.0;
                p.line(x, y, p.cos(a)*8 + x, p.sin(a)*8 + y);
            }
        },
        curveTightness: function(p) {
            p.curveTightness(10);
            p.beginShape();
            p.curveVertex(10, 26);
            p.curveVertex(10, 26);
            p.curveVertex(83, 24);
            p.curveVertex(83, 61);
            p.curveVertex(25, 65);
            p.curveVertex(25, 65);
            p.endShape();
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
