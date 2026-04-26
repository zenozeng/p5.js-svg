import { testRender } from '../../lib'

const supportedInP5v2 = {
    contour: true,
    bezierVertex: true
}

describe('Shape/Vertex', function () {
    var tests = {
        contour: function (p) {
            p.translate(50, 50)
            p.stroke(255, 0, 0)
            p.beginShape()
            p.vertex(-40, -40)
            p.vertex(40, -40)
            p.vertex(40, 40)
            p.vertex(-40, 40)
            p.beginContour()
            p.vertex(-20, -20)
            p.vertex(-20, 20)
            p.vertex(20, 20)
            p.vertex(20, -20)
            p.endContour()
            p.endShape(p.CLOSE)
            p.translate(-50, -50)
        },
        bezierVertex: function (p) {
            p.beginShape()
            p.vertex(30, 20)
            p.bezierVertex(80, 0)
            p.bezierVertex(80, 75)
            p.bezierVertex(30, 75)
            p.bezierVertex(50, 80)
            p.bezierVertex(60, 25)
            p.bezierVertex(30, 20)
            p.endShape()
        },
        curveVertex: function (p) {
            p.noFill()
            p.beginShape()
            p.curveVertex(84, 91)
            p.curveVertex(84, 91)
            p.curveVertex(68, 19)
            p.curveVertex(21, 17)
            p.curveVertex(32, 100)
            p.curveVertex(32, 100)
            p.endShape()
        },
        quadraticVertex: function (p) {
            p.noFill()
            p.strokeWeight(4)
            p.beginShape()
            p.vertex(20, 20)
            p.quadraticVertex(80, 20, 50, 50)
            p.quadraticVertex(20, 80, 80, 80)
            p.vertex(80, 60)
            p.endShape()
        }
    }

    Object.keys(tests).forEach(function (key) {
        if (window.p5 && /^2\./.test(window.p5.VERSION || '') && !supportedInP5v2[key]) {
            return
        }
        describe(key, function () {
            it(key + ': SVG API should draw same image as Canvas API', function (done) {
                testRender.describe(key)
                testRender(tests[key], done)
            })
        })
    })
})
