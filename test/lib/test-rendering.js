import testRender from './test-render';
import {p5svg, p5canvas} from './test-render';

export default async function testRendering(options = {
    draw: (p) => {},
    before: async (p) => {}
}) {
    // Waiting for p5svg & p5canvas setup done
    while (true) {
        if (p5svg.__ready && p5canvas.__ready) {
            break;
        }
        await new Promise((resolve) => setTimeout(resolve, 1000));
    }
    // Before
    if (options.before) {
        await options.before(p5svg);
        await options.before(p5canvas);
    }
    // Draw
    return new Promise((resolve, reject) => {
        testRender(options.draw, (err) => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
}