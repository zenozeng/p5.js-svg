import './style.css'
import p5 from 'p5'
import init, { p5SVG } from 'p5.js-svg'

init(p5)

const sketch = (p: p5SVG) => {

    p.setup = () => {
        p.createCanvas(100, 100, p.SVG)
    }

    p.draw = () => {
        p.background(0)
    }

}

new p5(sketch, document.body)
