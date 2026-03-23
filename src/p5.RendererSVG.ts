import { DEBUG } from './config'
import { P5SVG, p5 } from './types'
import { Element as SVGCanvasElement } from 'svgcanvas'

export default function (p5: P5SVG) {
    const normalizeContextTransform = function (ctx: CanvasRenderingContext2D & { resetTransform?: () => void }) {
        if (typeof ctx.resetTransform === 'function') {
            ctx.resetTransform()
            return
        }
        ctx.setTransform(1, 0, 0, 1, 0, 0)
    }

    const drawShapeToContext = function (ctx: any, shape: any) {
        shape.accept({
            visitAnchor(anchor: any) {
                const vertex = anchor.getEndVertex()
                ctx.moveTo(vertex.position.x, vertex.position.y)
            },
            visitLineSegment(lineSegment: any) {
                if (lineSegment.isClosing) {
                    ctx.closePath()
                    return
                }
                const vertex = lineSegment.getEndVertex()
                ctx.lineTo(vertex.position.x, vertex.position.y)
            },
            visitBezierSegment(bezierSegment: any) {
                const [v1, v2, v3] = bezierSegment.vertices
                if (bezierSegment.order === 2) {
                    ctx.quadraticCurveTo(
                        v1.position.x,
                        v1.position.y,
                        v2.position.x,
                        v2.position.y
                    )
                    return
                }
                ctx.bezierCurveTo(
                    v1.position.x,
                    v1.position.y,
                    v2.position.x,
                    v2.position.y,
                    v3.position.x,
                    v3.position.y
                )
            },
            visitSplineSegment(splineSegment: any) {
                const shape = splineSegment._shape
                const startVertex = splineSegment._firstInterpolatedVertex
                if (!splineSegment._comesAfterSegment && startVertex) {
                    ctx.moveTo(startVertex.position.x, startVertex.position.y)
                }
                const arrayVertices = splineSegment.getControlPoints().map(function (v: any) {
                    return shape.vertexToArray(v)
                })
                const bezierArrays = shape.catmullRomToBezier(
                    arrayVertices,
                    splineSegment._splineProperties.tightness
                ).map(function (arr: any[]) {
                    return arr.map(function (vertArr: any) {
                        return shape.arrayToVertex(vertArr)
                    })
                })
                for (const array of bezierArrays) {
                    const points = array.flatMap(function (vert: any) {
                        return [vert.position.x, vert.position.y]
                    })
                    ctx.bezierCurveTo(...points)
                }
            },
            visitPoint(point: any) {
                const { x, y } = point.vertices[0].position
                ctx.moveTo(x, y)
                ctx.lineTo(x + 0.00001, y)
            },
            visitLine(line: any) {
                const { x: x0, y: y0 } = line.vertices[0].position
                const { x: x1, y: y1 } = line.vertices[1].position
                ctx.moveTo(x0, y0)
                ctx.lineTo(x1, y1)
            },
            visitTriangle(triangle: any) {
                const [v0, v1, v2] = triangle.vertices
                ctx.moveTo(v0.position.x, v0.position.y)
                ctx.lineTo(v1.position.x, v1.position.y)
                ctx.lineTo(v2.position.x, v2.position.y)
                ctx.closePath()
            },
            visitQuad(quad: any) {
                const [v0, v1, v2, v3] = quad.vertices
                ctx.moveTo(v0.position.x, v0.position.y)
                ctx.lineTo(v1.position.x, v1.position.y)
                ctx.lineTo(v2.position.x, v2.position.y)
                ctx.lineTo(v3.position.x, v3.position.y)
                ctx.closePath()
            },
            visitTriangleFan(triangleFan: any) {
                const [v0, ...rest] = triangleFan.vertices
                for (let i = 0; i < rest.length - 1; i++) {
                    const v1 = rest[i]
                    const v2 = rest[i + 1]
                    ctx.moveTo(v0.position.x, v0.position.y)
                    ctx.lineTo(v1.position.x, v1.position.y)
                    ctx.lineTo(v2.position.x, v2.position.y)
                    ctx.closePath()
                }
            },
            visitTriangleStrip(triangleStrip: any) {
                for (let i = 0; i < triangleStrip.vertices.length - 2; i++) {
                    const v0 = triangleStrip.vertices[i]
                    const v1 = triangleStrip.vertices[i + 1]
                    const v2 = triangleStrip.vertices[i + 2]
                    ctx.moveTo(v0.position.x, v0.position.y)
                    ctx.lineTo(v1.position.x, v1.position.y)
                    ctx.lineTo(v2.position.x, v2.position.y)
                    ctx.closePath()
                }
            },
            visitQuadStrip(quadStrip: any) {
                for (let i = 0; i < quadStrip.vertices.length - 3; i += 2) {
                    const v0 = quadStrip.vertices[i]
                    const v1 = quadStrip.vertices[i + 1]
                    const v2 = quadStrip.vertices[i + 2]
                    const v3 = quadStrip.vertices[i + 3]
                    ctx.moveTo(v0.position.x, v0.position.y)
                    ctx.lineTo(v1.position.x, v1.position.y)
                    ctx.lineTo(v3.position.x, v3.position.y)
                    ctx.lineTo(v2.position.x, v2.position.y)
                    ctx.closePath()
                }
            }
        })
    }

    /**
     * @namespace RendererSVG
     * @constructor
     * @param elt canvas element to be replaced
     * @param pInst p5 Instance
     * @param isMainCanvas
     */
    function RendererSVG(elt: HTMLCanvasElement, pInst: p5, isMainCanvas: boolean) {
        const width = elt.width || (pInst as any).width || 0
        const height = elt.height || (pInst as any).height || 0
        const id = elt.id
        const className = elt.className
        const parent = elt.parentNode

        if (parent) {
            parent.removeChild(elt)
        }

        const svgCanvas = new SVGCanvasElement({ debug: DEBUG }) as {
            getContext: (type: string) => CanvasRenderingContext2D
            toDataURL: (type?: string, encoderOptions?: number, options?: { async?: boolean }) => string | Promise<string>
            svg: SVGElement
            getElement(): HTMLDivElement
            width: number
            height: number
        }
        const svg = svgCanvas.svg
        const wrapper = svgCanvas.getElement() as HTMLDivElement & {
            getContext(type: string): CanvasRenderingContext2D
            toDataURL(type?: string, encoderOptions?: number, options?: { async?: boolean }): string | Promise<string>
            svg: SVGElement
        }

        wrapper.getContext = function (type: string) {
            return svgCanvas.getContext(type)
        }
        wrapper.toDataURL = function (type?: string, encoderOptions?: number, options?: { async?: boolean }) {
            return svgCanvas.toDataURL(type, encoderOptions, options)
        }
        wrapper.svg = svg
        if (id) {
            wrapper.id = id
        }
        if (className) {
            wrapper.className = className
        }

        const pInstProxy = new Proxy(pInst, {
            get: function (target: any, prop) {
                if (prop === '_pixelDensity') {
                    // 1 is OK for SVG
                    return 1
                }
                return target[prop]
            }
        })

        const renderer2D = Reflect.construct(
            p5.Renderer2D,
            [pInstProxy, width, height, isMainCanvas, wrapper],
            RendererSVG
        )

        Object.assign(this, renderer2D)

        this.isSVG = true
        this._pixelDensity = 1
        if ((this._pInst as any)) {
            (this._pInst as any)._pixelDensity = 1
        }
        this.svg = svg
        this.svgCanvas = svgCanvas
        normalizeContextTransform(this.drawingContext)

        if (DEBUG) {
            console.debug({ svgCanvas })
            console.debug(this.drawingContext)
        }

        return this
    }

    RendererSVG.prototype = Object.create(p5.Renderer2D.prototype)

    RendererSVG.prototype._applyDefaults = function () {
        p5.Renderer2D.prototype._applyDefaults.call(this)
        this.drawingContext.lineWidth = 1
    }

    RendererSVG.prototype.resize = function (w: number, h: number) {
        if (!w || !h) {
            return
        }
        if (this.width !== w || this.height !== h) {
            // canvas will be cleared if its size changed
            // so, we do same thing for SVG
            // note that at first this.width and this.height is undefined
            this.drawingContext.__clearCanvas()
        }

        this._pixelDensity = 1
        if ((this._pInst as any)) {
            (this._pInst as any)._pixelDensity = 1
        }
        p5.Renderer2D.prototype.resize.call(this, w, h)
        normalizeContextTransform(this.drawingContext)
        this.svgCanvas.width = this.elt.width
        this.svgCanvas.height = this.elt.height

        // For scale, crop
        // see also: http://sarasoueidan.com/blog/svg-coordinate-systems/
        this.svg.setAttribute('viewBox', [0, 0, w, h].join(' '))
    }

    RendererSVG.prototype.clear = function () {
        p5.Renderer2D.prototype.clear.call(this)
        this.drawingContext.__clearCanvas()
    }

    RendererSVG.prototype.drawShape = function (shape: any) {
        const ctx = this.clipPath || this.drawingContext
        ctx.beginPath()
        drawShapeToContext(ctx, shape)
        if (this._clipping) {
            return
        }
        if (this.states.fillColor) {
            ctx.fill()
        }
        if (this.states.strokeColor) {
            ctx.stroke()
        }
    }

    /**
     * Append a element to current SVG Graphics
     *
     * @function appendChild
     * @memberof RendererSVG.prototype
     * @param {SVGElement|Element} element
     */
    RendererSVG.prototype.appendChild = function (element: { elt: Element } | Element) {
        if (element && (element as { elt: Element }).elt) {
            element = (element as { elt: Element }).elt
        }
        const g = this.drawingContext.__closestGroupOrSvg()
        g.appendChild(element)
    }

    /**
     * Draw an image or SVG to current SVG Graphics
     *
     * FIXME: sx, sy, sWidth, sHeight
     *
     * @function image
     * @memberof RendererSVG.prototype
     * @param {p5.Graphics|SVGGraphics|SVGElement|Element} image
     * @param {Number} x
     * @param {Number} y
     * @param {Number} width
     * @param {Number} height
     */
    RendererSVG.prototype.image = function (img: any, sx: number, sy: number, sWidth: number, sHeight: number, x: number, y: number, w: number, h: number) {
        if (!img) {
            throw new Error('Invalid image: ' + img)
        }
        let elt = img._renderer && img._renderer.svg // handle SVG Graphics
        elt = elt || (img.elt && img.elt.nodeName && (img.elt.nodeName.toLowerCase() === 'svg') && img.elt) // SVGElement
        elt = elt || (img.nodeName && (img.nodeName.toLowerCase() == 'svg') && img) // <svg>
        if (elt) {
            // it's <svg> element, let's handle it
            elt = elt.cloneNode(true)
            elt.setAttribute('width', w)
            elt.setAttribute('height', h)
            elt.setAttribute('x', x)
            elt.setAttribute('y', y)
            if (sx || sy || sWidth || sHeight) {
                sWidth /= this._pInst._pixelDensity
                sHeight /= this._pInst._pixelDensity
                elt.setAttribute('viewBox', [sx, sy, sWidth, sHeight].join(', '))
            }

            const g = p5.SVGElement.create('g')
            this.drawingContext.__applyTransformation(g.elt)
            g.elt.appendChild(elt)
            this.appendChild(g.elt)
        } else {
            p5.Renderer2D.prototype.image.apply(this, [img, sx, sy, sWidth, sHeight, x, y, w, h])
        }
    }

    /**
     * @method parent
     * @return {p5.Element}
     *
     * @see https://github.com/zenozeng/p5.js-svg/issues/187
     */
    RendererSVG.prototype.parent = function (...args: any[]) {
        const $this = {
            elt: this.elt.getElement ? this.elt.getElement() : this.elt
        }
        return p5.Element.prototype.parent.apply($this, args)
    }


    RendererSVG.prototype.loadPixels = async function () {
        const pixelsState = this._pixelsState || this
        const pd = pixelsState._pixelDensity || this._pixelDensity || 1
        const w = this.width * pd
        const h = this.height * pd
        const imageData = await this.drawingContext.getImageData(0, 0, w, h, { async: true })
        if (typeof pixelsState._setProperty === 'function') {
            pixelsState._setProperty('imageData', imageData)
            pixelsState._setProperty('pixels', imageData.data)
        } else {
            pixelsState.imageData = imageData
            pixelsState.pixels = imageData.data
        }
    }

    p5.RendererSVG = RendererSVG
}
