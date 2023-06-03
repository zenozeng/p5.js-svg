import { P5SVG } from './types'

export default function (p5: P5SVG) {
    /**
     * Convert SVG Element to jpeg / png data url
     *
     * @private
     * @param {SVGElement} svg SVG Element
     * @param {String} mine Mine
     * @param {Function} callback
     */
    const svg2img = function (svg: SVGElement, mine: string, callback: (err: Error | null, dataURL: string) => void) {
        let svgText = (new XMLSerializer()).serializeToString(svg)
        svgText = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgText)
        if (mine == 'image/svg+xml') {
            callback(null, svgText)
            return
        }
        const img = new Image()
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        img.onload = function () {
            canvas.width = img.width
            canvas.height = img.height
            ctx.drawImage(img, 0, 0)
            const dataURL = canvas.toDataURL(mine)
            callback(null, dataURL)
        }
        img.src = svgText
    }

    /**
     * Get SVG frame, and convert to target type
     *
     * @private
     * @param {Object} options
     * @param {SVGElement} options.svg SVG Element, defaults to current svg element
     * @param {String} options.filename
     * @param {String} options.ext Extension: 'svg' or 'jpg' or 'jpeg' or 'png'
     * @param {Function} options.callback
     */
    p5.prototype._makeSVGFrame = function (options: {
        svg: SVGElement
        filename?: string
        extension?: string
        callback: (err: Error | null, frame: {
            imageData: string,
            filename: string,
            ext: string
        }) => void
    }) {
        let filename = options.filename || 'untitled'
        let ext = options.extension
        ext = ext || this._checkFileExtension(filename, ext)[1]
        const regexp = new RegExp('\\.' + ext + '$')
        filename = filename.replace(regexp, '')
        if (ext === '') {
            ext = 'svg'
        }
        const mine = {
            png: 'image/png',
            jpeg: 'image/jpeg',
            jpg: 'image/jpeg',
            svg: 'image/svg+xml'
        }[ext]
        if (!mine) {
            throw new Error('Fail to getFrame, invalid extension: ' + ext + ', please use png | jpeg | jpg | svg.')
        }

        const svg = options.svg || this._renderer.svg
        svg2img(svg, mine, function (err, dataURL) {
            const downloadMime = 'image/octet-stream'
            dataURL = dataURL.replace(mine, downloadMime)
            options.callback(err, {
                imageData: dataURL,
                filename: filename,
                ext: ext
            })
        })
    }

    /**
     * Save the current SVG as an image. In Safari, will open the
     * image in the window and the user must provide their own
     * filename on save-as. Other browsers will either save the
     * file immediately, or prompt the user with a dialogue window.
     *
     * @function saveSVG
     * @memberof p5.prototype
     * @param {Graphics|Element|SVGElement} [svg] Source to save
     * @param {String} [filename]
     * @param {String} [extension] Extension: 'svg' or 'jpg' or 'jpeg' or 'png'
     */
    p5.prototype.saveSVG = function (...args: any[]) {
        args = [args[0], args[1], args[2]]

        let svg

        if (args[0] instanceof p5.Graphics) {
            svg = args[0]._renderer.svg
            args.shift()
        }

        if (args[0] && args[0].elt) {
            svg = args[0].elt
            args.shift()
        }

        if (typeof args[0] == 'object') {
            svg = args[0]
            args.shift()
        }

        const filename = args[0]
        const ext = args[1]

        this._makeSVGFrame({
            svg: svg,
            filename: filename,
            extension: ext,
            callback: (err: Error | null, frame: {
                imageData: string,
                filename: string,
                ext: string
            }) => {
                if (err) {
                    throw err
                }
                this.downloadFile(frame.imageData, frame.filename, frame.ext)
            }
        })
    }

    /**
     * Extends p5's saveFrames with SVG support
     *
     * @function saveFrames
     * @memberof p5.prototype
     * @param {String} filename filename
     * @param {String} extension Extension: 'svg' or 'jpg' or 'jpeg' or 'png'
     * @param {Number} duration duration
     * @param {Number} fps fps
     * @param {Function} callback callback
     */
    const _saveFrames = p5.prototype.saveFrames
    p5.prototype.saveFrames = function (...args: any) {
        const filename: string = args[0]
        const extension: string = args[1]
        let duration: number = args[2]
        let fps: number = args[3]
        const callback: any = args[4]

        if (!this._renderer.svg) {
            return _saveFrames.apply(this, args)
        }

        duration = duration || 3
        duration = p5.prototype.constrain(duration, 0, 15)
        duration = duration * 1000
        fps = fps || 15
        fps = p5.prototype.constrain(fps, 0, 22)
        let count = 0

        const frames: any = []
        let pending = 0

        const frameFactory = setInterval(() => {
            ((count) => {
                pending++
                this._makeSVGFrame({
                    filename: filename + count,
                    extension: extension,
                    callback: function (err: Error | null, frame: any) {
                        if (err) {
                            throw err
                        }
                        frames[count] = frame
                        pending--
                    }
                })
            })(count)
            count++
        }, 1000 / fps)

        const done = () => {
            if (pending > 0) {
                setTimeout(function () {
                    done()
                }, 10)
                return
            }
            if (callback) {
                callback(frames)
            } else {
                frames.forEach((f: any) => {
                    this.downloadFile(f.imageData, f.filename, f.ext)
                })
            }
        }

        setTimeout(function () {
            clearInterval(frameFactory)
            done()
        }, duration + 0.01)
    }

    /**
     * Extends p5's save method with SVG support
     *
     * @function save
     * @memberof p5.prototype
     * @param {Graphics|Element|SVGElement} [source] Source to save
     * @param {String} [filename] filename
     */
    const _save = p5.prototype.save
    p5.prototype.save = function (...args: any[]) {
        let svg

        if (args[0] instanceof p5.Graphics) {
            const svgcanvas = args[0].elt
            svg = svgcanvas.svg
            args.shift()
        }

        if (args[0] && args[0].elt) {
            svg = args[0].elt
            args.shift()
        }

        if (typeof args[0] == 'object') {
            svg = args[0]
            args.shift()
        }

        svg = svg || (this._renderer && this._renderer.svg)

        const filename = args[0]
        const supportedExtensions = ['jpeg', 'png', 'jpg', 'svg', '']
        const ext = this._checkFileExtension(filename, '')[1]

        const useSVG = svg && svg.nodeName && svg.nodeName.toLowerCase() === 'svg' && supportedExtensions.indexOf(ext) > -1

        if (useSVG) {
            this.saveSVG(svg, filename)
        } else {
            return _save.apply(this, args)
        }
    }

    /**
     * Custom get in p5.svg (handles http and dataurl)
     * @private
     */
    p5.prototype._svg_get = function (path: string, successCallback: any, failureCallback: any) {
        if (path.indexOf('data:') === 0) {
            if (path.indexOf(',') === -1) {
                failureCallback(new Error('Fail to parse dataurl: ' + path))
                return
            }
            let svg = path.split(',').pop()
            // force request to dataurl to be async
            // so that it won't make preload mess
            setTimeout(function () {
                if (path.indexOf(';base64,') > -1) {
                    svg = atob(svg)
                } else {
                    svg = decodeURIComponent(svg)
                }
                successCallback(svg)
            }, 1)
            return svg
        } else {
            this.httpGet(path, successCallback)
            return null
        }
    }

    /**
     * loadSVG (like loadImage, but will return SVGElement)
     *
     * @function loadSVG
     * @memberof p5.prototype
     * @returns {p5.SVGElement}
     */
    p5.prototype.loadSVG = function (path: string, successCallback: any, failureCallback: any) {
        const div = document.createElement('div')
        const element = new p5.SVGElement(div)
        this._incrementPreload()
        new Promise((resolve, reject) => {
            this._svg_get(path, function (svg: string) {
                div.innerHTML = svg
                const svgEl = div.querySelector('svg')
                if (!svgEl) {
                    reject('Fail to create <svg>.')
                    return
                }
                element.elt = svgEl
                resolve(element)
            }, reject)
        }).then((v) => {
            successCallback && successCallback(v)
        }).catch((e) => {
            failureCallback && failureCallback(e)
        }).finally(() => {
            this._decrementPreload()
        })
        return element
    }

    p5.prototype.getDataURL = function () {
        return this._renderer.elt.toDataURL('image/svg+xml')
    }
}