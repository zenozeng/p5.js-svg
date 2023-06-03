import { P5SVG, SVGElement } from './types'

export default function (p5: P5SVG) {
    /**
     * Generate discrete table values based on the given color map function
     *
     * @private
     * @param {Function} fn - Function to map channel values (val ∈ [0, 255])
     * @see http://www.w3.org/TR/SVG/filters.html#feComponentTransferElement
     */
    const _discreteTableValues = function (fn: (val: number) => number) {
        const table = []
        for (let val = 0; val < 256; val++) {
            const newval = fn(val)
            table.push(newval / 255) // map to ∈ [0, 1]
        }
        return table
    }

    const generateID = function () {
        return Date.now().toString() + Math.random().toString().replace(/0\./, '')
    }

    const _blendOffset = function (inGraphics: string, resultGraphics: string, mode: string) {
        const elements: SVGElement[] = [];
        [
            ['left', -1, 0],
            ['right', 1, 0],
            ['up', 0, -1],
            ['down', 0, 1]
        ].forEach(function (neighbor) {
            elements.push(p5.SVGElement.create('feOffset', {
                'in': inGraphics,
                result: resultGraphics + '-' + neighbor[0],
                dx: neighbor[1],
                dy: neighbor[2]
            }))
        });
        [
            [null, inGraphics],
            [resultGraphics + '-left', resultGraphics + '-tmp-0'],
            [resultGraphics + '-right', resultGraphics + '-tmp-1'],
            [resultGraphics + '-up', resultGraphics + '-tmp-2'],
            [resultGraphics + '-down', resultGraphics + '-tmp-3']
        ].forEach(function (layer, i, layers) {
            if (i === 0) {
                return
            }
            elements.push(p5.SVGElement.create('feBlend', {
                'in': layers[i - 1][1],
                in2: layer[0],
                result: layer[1],
                mode: mode
            }))
        })
        return elements
    }

    p5.SVGFilters = {
        // @private
        // We have to build a filter for each element
        // the `filter: f1 f2` and svg param is not supported by many browsers
        // so we can just modify the filter def to do so
        apply: function (svgElement: SVGElement, func: string, arg: any, defs: Element) {
            // get filters
            const filters: [string, any][] = JSON.parse(svgElement.attribute('data-p5-svg-filters') || '[]')
            if (func) {
                filters.push([func, arg])
            }
            svgElement.attribute('data-p5-svg-filters', JSON.stringify(filters))

            if (filters.length === 0) {
                svgElement.attribute('filter', null)
                return
            }

            // generate filters chain
            const filtersElements: SVGElement[][] = filters.map(function (filter, index) {
                const inGraphics = index === 0 ? 'SourceGraphic' : ('result-' + (index - 1))
                const resultGraphics = 'result-' + index
                const elements = (p5.SVGFilters as any)[filter[0]].call(null, inGraphics, resultGraphics, filter[1])
                if (!Array.isArray(elements)) {
                    return [elements]
                } else {
                    return elements
                }
            })

            // get filter id for this element or create one
            let filterid = svgElement.attribute('data-p5-svg-filter-id')
            if (!filterid) {
                filterid = 'p5-svg-' + generateID()
                svgElement.attribute('data-p5-svg-filter-id', filterid)
            }
            // Note that when filters is [], we will remove filter attr
            // So, here, we write this attr every time
            svgElement.attribute('filter', 'url(#' + filterid + ')')

            // create <filter>
            const filter = p5.SVGElement.create('filter', { id: filterid })
            filtersElements.forEach(function (elt) {
                elt.forEach(function (elt) {
                    filter.append(elt)
                })
            })

            // get defs
            const oldfilter = defs.querySelectorAll('#' + filterid)[0]
            if (!oldfilter) {
                defs.appendChild(filter.elt)
            } else {
                oldfilter.parentNode.replaceChild(filter.elt, oldfilter)
            }
        },
        blur: function (inGraphics, resultGraphics, val: number) {
            return p5.SVGElement.create('feGaussianBlur', {
                stdDeviation: val + '',
                in: inGraphics,
                result: resultGraphics,
                'color-interpolation-filters': 'sRGB'
            })
        },
        // See also: http://www.w3.org/TR/SVG11/filters.html#feColorMatrixElement
        // See also: http://stackoverflow.com/questions/21977929/match-colors-in-fecolormatrix-filter
        colorMatrix: function (inGraphics, resultGraphics, matrix: number[]) {
            return p5.SVGElement.create('feColorMatrix', {
                type: 'matrix',
                values: matrix.join(' '),
                'color-interpolation-filters': 'sRGB',
                in: inGraphics,
                result: resultGraphics
            })
        },
        // Here we use CIE luminance for RGB
        gray: function (inGraphics, resultGraphics) {
            const matrix = [
                0.2126, 0.7152, 0.0722, 0, 0, // R'
                0.2126, 0.7152, 0.0722, 0, 0, // G'
                0.2126, 0.7152, 0.0722, 0, 0, // B'
                0, 0, 0, 1, 0 // A'
            ]
            return p5.SVGFilters.colorMatrix(inGraphics, resultGraphics, matrix)
        },
        threshold: function (inGraphics, resultGraphics, val) {
            const elements = []
            elements.push(p5.SVGFilters.gray(inGraphics, resultGraphics + '-tmp'))
            const componentTransfer = p5.SVGElement.create('feComponentTransfer', {
                'in': resultGraphics + '-tmp',
                result: resultGraphics
            })
            const thresh = Math.floor(val * 255);
            ['R', 'G', 'B'].forEach(function (channel) {
                // Note that original value is from 0 to 1
                const func = p5.SVGElement.create('feFunc' + channel, {
                    type: 'linear',
                    slope: 255, // all non-zero * 255
                    intercept: (thresh - 1) * -1
                })
                componentTransfer.append(func)
            })
            elements.push(componentTransfer)
            return elements
        },
        invert: function (inGraphics, resultGraphics) {
            const matrix = [
                -1, 0, 0, 0, 1,
                0, -1, 0, 0, 1,
                0, 0, -1, 0, 1,
                0, 0, 0, 1, 0
            ]
            return p5.SVGFilters.colorMatrix(inGraphics, resultGraphics, matrix)
        },
        opaque: function (inGraphics, resultGraphics) {
            const matrix = [
                1, 0, 0, 0, 0, // original R
                0, 1, 0, 0, 0, // original G
                0, 0, 1, 0, 0, // original B
                0, 0, 0, 0, 1 // set A to 1
            ]
            return p5.SVGFilters.colorMatrix(inGraphics, resultGraphics, matrix)
        },
        /**
         * Limits each channel of the image to the number of colors specified as
         * the parameter. The parameter can be set to values between 2 and 255, but
         * results are most noticeable in the lower ranges.
         *
         * Adapted from p5's Filters.posterize
         */
        posterize: function (inGraphics, resultGraphics, level) {
            level = parseInt(level + '', 10)
            if ((level < 2) || (level > 255)) {
                throw new Error(
                    'Level must be greater than 2 and less than 255 for posterize'
                )
            }

            const tableValues = _discreteTableValues(function (val) {
                return (((val * level) >> 8) * 255) / (level - 1)
            })

            const componentTransfer = p5.SVGElement.create('feComponentTransfer', {
                'in': inGraphics,
                result: resultGraphics,
                'color-interpolation-filters': 'sRGB'
            });
            ['R', 'G', 'B'].forEach(function (channel) {
                const func = p5.SVGElement.create('feFunc' + channel, {
                    type: 'discrete',
                    tableValues: tableValues.join(' ')
                })
                componentTransfer.append(func)
            })

            return componentTransfer
        },


        /**
         * Increases the bright areas in an image
         *
         * Will create 4 offset layer and blend them using darken mode
         */
        erode: function (inGraphics, resultGraphics) {
            return _blendOffset(inGraphics, resultGraphics, 'darken')
        },


        dilate: function (inGraphics, resultGraphics) {
            return _blendOffset(inGraphics, resultGraphics, 'lighten')
        }
    }
}