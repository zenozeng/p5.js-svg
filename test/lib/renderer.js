var p5 = window.p5;
import { Element as SVGCanvasElement } from 'svgcanvas';
import { countPixels, config } from './canvas';

class RendererTester {
    // init p5 canvas instance and p5-svg instance
    constructor() {
        this.p5svg = new p5(function (p) {
            p.setup = function () {
                p.createCanvas(100, 100, p.SVG);
                p.noLoop();
                p.isSVG = true;
                p.__ready = true;
            };
        });
        this.p5canvas = new p5(function (p) {
            p.setup = function () {
                p.createCanvas(100, 100);
                p.noLoop();
                p.isSVG = false;
                p.__ready = true;
            };
        });
        this.pInstances = [this.p5svg, this.p5canvas];
        this.maxPixelDiff = 0;
        this.maxDiff = 0.05;
    }

    // wait until ready
    async ready() {
        while (true) {
            if (this.p5svg.__ready && this.p5canvas.__ready) {
                break;
            }
            await new Promise((resolve) => setTimeout(resolve, 1000));
        }
    }

    async test(options = {
        draw: async (p, info) => { },
        before: async (p, info) => { }
    }) {
        await this.ready();
        // Set options
        this.maxPixelDiff = 0;
        this.maxDiff = 0.05;
        this.waitUntil = 0;
        // Draw
        for (let p of this.pInstances) {
            // reset
            this.resetCanvas(p);
            let info = {
                renderer: p === this.p5svg ? 'svg' : 'canvas'
            }
            // Apply before
            if (options.before) {
                await options.before(p, info);
            }
            // Apply draw
            await options.draw(p, info);
        }
        // Wait
        while (Date.now() < this.waitUntil) {
            await new Promise((resolve) => setTimeout(resolve, 100));
        }
        // Pixels
        const svg = SVGCanvasElement.prototype.toDataURL.call({ svg: this.p5svg._renderer.svg }, "image/svg+xml");
        const svgImage = await new Promise((resolve) => {
            var svgImage = new Image();
            svgImage.onload = function () {
                resolve(svgImage)
            }
            svgImage.src = svg;
        })
        const svgPixels = this.getPixels(svgImage);
        const canvasPixels = this.getPixels(this.p5canvas._curElement.elt)
        const diffPixels = this.diffPixels(svgPixels, canvasPixels);
        const removeThinLinesPixels = this.removeThinLines(this.removeThinLines(diffPixels));
        // Report
        const count = Math.max(countPixels(svgPixels), countPixels(canvasPixels));
        const diffCount = countPixels(removeThinLinesPixels);
        const diffRate = diffCount === 0 ? 0 : diffCount / count;
        const match = diffRate <= this.maxDiff;
        const fn = options.draw.toString();
        await this.report({ canvasPixels, svgPixels, diffPixels, removeThinLinesPixels, svg, match, fn, diffRate })
    }

    getPixels(image) {
        const canvas = document.createElement('canvas');
        const width = 100 * config.pixelDensity;
        const height = 100 * config.pixelDensity;
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(image, 0, 0, width, height);
        return ctx.getImageData(0, 0, width, height);
    }

    diffPixels(imgData1, imgData2) {
        const canvas = document.createElement('canvas');
        const width = 100 * config.pixelDensity;
        const height = 100 * config.pixelDensity;
        const diffImgData = canvas.getContext('2d').getImageData(0, 0, width, height);
        let $this = this;
        for (var i = 0; i < imgData1.data.length; i += 4) {
            var indexes = [i, i + 1, i + 2, i + 3];
            indexes.forEach(function (i) {
                diffImgData.data[i] = 0;
            });
            if (indexes.some(function (i) {
                return Math.abs(imgData1.data[i] - imgData2.data[i]) > $this.maxPixelDiff;
            })) {
                diffImgData.data[i + 3] = 255; // set black
            }
        }
        return diffImgData;
    }

    removeThinLines(imageData) {
        const canvas = document.createElement('canvas');
        const width = 100 * config.pixelDensity;
        const height = 100 * config.pixelDensity;
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.putImageData(imageData, 0, 0);
        var imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        var imgDataCopy = ctx.getImageData(0, 0, canvas.width, canvas.height);

        var getPixelIndex = function (x, y) {
            return (y * width + x) * 4 + 3;
        };

        var getPixel = function (x, y) {
            var alphaIndex = getPixelIndex(x, y);
            return imgDataCopy.data[alphaIndex];
        };

        var setPixel = function (x, y, value) {
            imgData.data[getPixelIndex(x, y)] = value;
        };

        for (var x = 1; x < width - 1; x++) {
            for (var y = 1; y < height - 1; y++) {
                if (getPixel(x, y) == 0) {
                    continue; // ignore transparents
                }
                var links = [
                    { x: x - 1, y: y - 1 },
                    { x: x, y: y - 1 },
                    { x: x + 1, y: y - 1 },
                    { x: x - 1, y: y },
                    { x: x + 1, y: y },
                    { x: x - 1, y: y + 1 },
                    { x: x, y: y + 1 },
                    { x: x + 1, y: y + 1 }
                ].map(function (p) {
                    return getPixel(p.x, p.y);
                }).filter(function (val) {
                    return val > 0; // not transparent?
                }).length;

                if (links < 5) { // is a thin line
                    setPixel(x, y, 0); // make it transparent
                }
            }
        }
        return imgData;
    }

    getReportContainer() {
        return document.querySelector('#test-graph');
    }

    async report({ canvasPixels, svgPixels, diffPixels, removeThinLinesPixels, svg, match, fn, diffRate }) {
        const container = this.getReportContainer();
        if (container) {
            // width & height
            const width = 100 * config.pixelDensity;
            const height = 100 * config.pixelDensity;

            const report = document.createElement('div');
            report.innerHTML = `
                <div class="th">
                    <div>Rendered in SVG</div>
                    <div>Rendered in Canvas</div>
                    <div>Diff Bitmap</div>
                    <div>Diff Bitmap with thin line removed (8-connected neighborhood < 5)</div>
                    <div></div>
                </div>
                <canvas class="svg-pixels" width="${width}" height="${height}"></canvas>
                <canvas class="canvas-pixels" width="${width}" height="${height}"></canvas>
                <canvas class="diff-pixels" width="${width}" height="${height}"></canvas>
                <canvas class="diff-pixels-2" width="${width}" height="${height}"></canvas>
                <div class="match">
                    <i class="fa ${match ? 'fa-check' : 'fa-times'}"></i>
                </div>
                <hr>
                `

            container.appendChild(report);

            report.querySelector('.svg-pixels').getContext('2d').putImageData(svgPixels, 0, 0);
            report.querySelector('.canvas-pixels').getContext('2d').putImageData(canvasPixels, 0, 0);
            report.querySelector('.diff-pixels').getContext('2d').putImageData(diffPixels, 0, 0);
            report.querySelector('.diff-pixels-2').getContext('2d').putImageData(removeThinLinesPixels, 0, 0);
        }

        if (!match) {
            throw new Error(JSON.stringify({
                diffRate,
            }));
        }
    }

    resetCanvas(p) {
        // clean up
        p.clear();
        p.noFill();
        p.noStroke();
        // reset
        p.strokeWeight(3); // for using XOR with thin line removed (using 8-connected neighborhood < 5) for diff
        p.fill(0);
        p.fill(200); // fill has cache, update twice to force reset ctx.fillStyle
        p.stroke(0);
        p.ellipseMode(p.CENTER);
        p.rectMode(p.CORNER);
        p.smooth();
        p.pixelDensity(config.pixelDensity);
    }

}

const rendererTester = new RendererTester();


var testRender = async function (draw, callback) {
    try {
        callback(await rendererTester.test({ draw }));
    } catch (e) {
        callback(e);
    }
};

testRender.describe = function (str) {
    const container = rendererTester.getReportContainer();
    if (container) {
        let h2 = document.createElement('h2');
        h2.innerText = str;
        container.appendChild(h2);
    }
};

testRender.setMaxDiff = function (max) {
    rendererTester.maxDiff = max;
};

testRender.setMaxPixelDiff = function (max) {
    rendererTester.maxPixelDiff = max;
};

testRender.wait = function (ms) {
    rendererTester.waitUntil = Date.now() + ms;
};

// add lock so testRender will wait
testRender.lock = function () {
    testRender.wait(1000 * 1000 * 1000);
};

// remove lock
testRender.unlock = function () {
    testRender.wait(0);
};

export default testRender;

export { rendererTester }