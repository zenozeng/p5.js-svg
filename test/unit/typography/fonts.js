import { assert, rendererTester } from '../../lib'

describe('Typography', function () {
    this.timeout(0)

    // https://p5js.org/reference/#/p5/loadFont
    describe('loadFont', function () {
        it('should load font', async function () {
            await rendererTester.ready()
            const p = rendererTester.p5svg
            rendererTester.resetCanvas(p)

            const myFont = await p.loadFont('https://unpkg.com/font-awesome@4.7.0/fonts/FontAwesome.otf')
            p.fill('#ED225D')
            p.textFont(myFont)
            p.textSize(36)
            p.text('\uf092', 10, 50)

            const texts = p.querySVG('text')
            assert.strictEqual(texts.length, 2)
            assert.strictEqual(texts[0].attribute('font-family'), 'FontAwesome')
            assert.strictEqual(texts[1].attribute('font-family'), 'FontAwesome')
        })
    })

})
