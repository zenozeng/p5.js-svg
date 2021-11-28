const sketch = (p) => {

    p.setup = () => {
        p.createCanvas(100, 100, p.SVG);
    }

    p.draw = () => {
        p.background(0);
    }

}

new p5(sketch, document.body);