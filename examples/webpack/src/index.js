import p5 from "p5"
import p5Svg from "p5.js-svg"

p5Svg(p5);

const sketch = (p) => {

    p.setup = () => {
        p.createCanvas(100, 100, p.SVG);
    }

    p.draw = () => {
        p.background(0);
    }

}

new p5(sketch, document.body);