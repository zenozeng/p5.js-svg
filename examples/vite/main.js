import './style.css'
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

document.querySelector('#app').innerHTML = `
    <h1>Hello Vite!</h1>
    <a href="https://vitejs.dev/guide/features.html" target="_blank">Documentation</a>
`
