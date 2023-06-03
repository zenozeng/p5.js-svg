import p5 from 'p5'
import init, { p5svg } from '../..'

const sketch = (p: p5svg) => {

    p.setup = () => {
        p.createCanvas(100, 100, p.SVG)
    }

    p.draw = () => {
        p.background(0)
    }

}

const p5svg = new (init(p5))(sketch, document.body)
