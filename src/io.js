module.exports = function(p5) {
    /**
     * Convert SVG Element to jpeg / png data url
     *
     * @private
     * @param {SVGElement} svg SVG Element
     * @param {String} mine Mine
     * @param {Function} callback
     */
    var svg2img = function(svg, mine, callback) {
        svg = (new XMLSerializer()).serializeToString(svg);
        svg = 'data:image/svg+xml;charset=utf-8,' + encodeURI(svg);
        if (mine == 'image/svg+xml') {
            callback(null, svg);
            return;
        }
        var img = new Image();
        var canvas = document.createElement('canvas');
        var ctx = canvas.getContext('2d');
        img.onload = function() {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);
            var dataURL = canvas.toDataURL(mine);
            callback(null, dataURL);
        };
        img.src = svg;
    };

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
    p5.prototype._makeSVGFrame = function(options) {
        var filename = options.filename || 'untitled';
        var ext = options.extension;
        ext = ext || this._checkFileExtension(filename, ext)[1];
        var regexp = new RegExp('\\.' + ext + '$');
        filename = filename.replace(regexp, '');
        if (ext === '') {
            ext = 'svg';
        }
        var mine = {
            png: 'image/png',
            jpeg: 'image/jpeg',
            jpg: 'image/jpeg',
            svg: 'image/svg+xml'
        }[ext];
        if (!mine) {
            throw new Error('Fail to getFrame, invalid extension: ' + ext + ', please use png | jpeg | jpg | svg.');
        }

        var svg = options.svg || this._renderer.svg;
        svg2img(svg, mine, function(err, dataURL) {
            var downloadMime = 'image/octet-stream';
            dataURL = dataURL.replace(mine, downloadMime);
            options.callback(err, {
                imageData: dataURL,
                filename: filename,
                ext: ext
            });
        });
    };

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
    p5.prototype.saveSVG = function() {
        // don't use slice on arguments because it prevents optimizations
        var args = arguments;
        args = [args[0], args[1], args[2]];

        var svg;

        if (args[0] instanceof p5.Graphics) {
            svg = args[0]._renderer.svg;
            args.shift();
        }

        if (args[0] && args[0].elt) {
            svg = args[0].elt;
            args.shift();
        }

        if (typeof args[0] == 'object') {
            svg = args[0];
            args.shift();
        }

        var filename = args[0];
        var ext = args[1];

        var p = this;
        this._makeSVGFrame({
            svg: svg,
            filename: filename,
            extension: ext,
            callback: function(err, frame) {
                p.downloadFile(frame.imageData, frame.filename, frame.ext);
            }
        });
    };

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
    var _saveFrames = p5.prototype.saveFrames;
    p5.prototype.saveFrames = function(filename, extension, duration, fps, callback) {
        var args = arguments;

        if (!this._renderer.svg) {
            _saveFrames.apply(this, args);
            return;
        }

        duration = duration || 3;
        duration = p5.prototype.constrain(duration, 0, 15);
        duration = duration * 1000;
        fps = fps || 15;
        fps = p5.prototype.constrain(fps, 0, 22);
        var count = 0;

        var frames = [];
        var pending = 0;

        var p = this;
        var frameFactory = setInterval(function () {
            (function(count) {
                pending++;
                p._makeSVGFrame({
                    filename: filename + count,
                    extension: extension,
                    callback: function(err, frame) {
                        frames[count] = frame;
                        pending--;
                    }
                });
            })(count);
            count++;
        }, 1000 / fps);

        var done = function() {
            if (pending > 0) {
                setTimeout(function() {
                    done();
                }, 10);
                return;
            }
            if (callback) {
                callback(frames);
            } else {
                frames.forEach(function(f) {
                    p.downloadFile(f.imageData, f.filename, f.ext);
                });
            }
        };

        setTimeout(function () {
            clearInterval(frameFactory);
            done();
        }, duration + 0.01);
    };

    /**
     * Extends p5's save method with SVG support
     *
     * @function save
     * @memberof p5.prototype
     * @param {Graphics|Element|SVGElement} [source] Source to save
     * @param {String} [filename] filename
     */
    var _save = p5.prototype.save;
    p5.prototype.save = function() {
        var args = arguments;
        args = [args[0], args[1]];

        var svg;

        if (args[0] instanceof p5.Graphics) {
            var svgcanvas = args[0].elt;
            svg = svgcanvas.svg;
            args.shift();
        }

        if (args[0] && args[0].elt) {
            svg = args[0].elt;
            args.shift();
        }

        if (typeof args[0] == 'object') {
            svg = args[0];
            args.shift();
        }

        svg = svg || (this._renderer && this._renderer.svg);

        var filename = args[0];
        var supportedExtensions = ['jpeg', 'png', 'jpg', 'svg', ''];
        var ext = this._checkFileExtension(filename, '')[1];

        var useSVG = svg && svg.nodeName && svg.nodeName.toLowerCase() === 'svg' && supportedExtensions.indexOf(ext) > -1;

        if (useSVG) {
            this.saveSVG(svg, filename);
        } else {
            return _save.apply(this, arguments);
        }
    };

    /**
     * Custom get in p5.svg (handles http and dataurl)
     * @private
     */
    p5.prototype._svg_get = function(path, successCallback, failureCallback) {
        if (path.indexOf('data:') === 0) {
            if (path.indexOf(',') === -1) {
                failureCallback(new Error('Fail to parse dataurl: ' + path));
                return;
            }
            var svg = path.split(',').pop();
            // force request to dataurl to be async
            // so that it won't make preload mess
            setTimeout(function() {
                if (path.indexOf(';base64,') > -1) {
                    svg = atob(svg);
                } else {
                    svg = decodeURIComponent(svg);
                }
                successCallback(svg);
            }, 1);
            return svg;
        } else {
            this.httpGet(path, successCallback);
            return null;
        }
    };

    /**
     * loadSVG (like loadImage, but will return SVGElement)
     *
     * @function loadSVG
     * @memberof p5.prototype
     * @returns {p5.SVGElement}
     */
    p5.prototype.loadSVG = function(path, successCallback, failureCallback) {
        var div = document.createElement('div');
        var element = new p5.SVGElement(div);
        this._svg_get(path, function(svg) {
            div.innerHTML = svg;
            svg = div.querySelector('svg');
            if (!svg) {
                if (failureCallback) {
                    failureCallback(new Error('Fail to create <svg>.'));
                }
                return;
            }
            element.elt = svg;
            if (successCallback) {
                successCallback(element);
            }
        }, failureCallback);
        return element;
    };
    // cause preload to wait
    p5.prototype._preloadMethods.loadSVG = p5.prototype;

    p5.prototype.getDataURL = function() {
        return this._renderer.elt.toDataURL('image/svg+xml');
    };
};
