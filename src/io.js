/**
 * @module Data
 * @submodule Output
 * @for p5
 * @requires core
 */
define(function (require) {

    'use strict';

    var p5 = require('core');

    // convert SVG data url to jpeg / png data url
    var svg2img = function(SVG, mine, callback) {
        if (mine == 'image/svg+xml') {
            callback(null, SVG);
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
        img.src = SVG;
    };

    // private method
    // get current SVG frame, and convert to target type
    p5.prototype._makeSVGFrame = function(filename, ext, callback) {
        filename = filename || 'untitled';
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
        };
        if (!mine[ext]) {
            throw new Error('Fail to getFrame, invalid extension, please use png | jpeg | jpg | svg.');
        }
        var canvas = this._curElement && this._curElement.elt;
        var svg = canvas.toDataURL('image/svg+xml');

        svg2img(svg, mine[ext], function(err, dataURL) {
            var downloadMime = 'image/octet-stream';
            dataURL = dataURL.replace(mine[ext], downloadMime);
            callback(err, {
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
     * @method saveSVG
     * @param {[String]} filename
     * @param {[String]} extension 'svg' or 'jpg' or 'png'
     */
    p5.prototype.saveSVG = function(filename, ext) {
        var p = this;
        this._makeSVGFrame(filename, ext, function(err, frame) {
            p.downloadFile(frame.imageData, frame.filename, frame.ext);
        });
    };

    /**
     * Capture a sequence of frames that can be used to create a movie.
     * Accepts a callback. For example, you may wish to send the frames
     * to a server where they can be stored or converted into a movie.
     * If no callback is provided, the browser will attempt to download
     * all of the images that have just been created.
     *
     * @method saveFrames
     * @param {String} filename filename
     * @param {String} extension extension
     * @param {Number} duration duration
     * @param {Number]} fps fps
     * @param {Function} callback callback
     */
    var _saveFrames = p5.prototype.saveFrames;
    p5.prototype.saveFrames = function(filename, extension, duration, fps, callback) {
        var args = arguments;

        if (!this.svg) {
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
                p._makeSVGFrame(filename + count, extension, function(err, frame) {
                    frames[count] = frame;
                    pending--;
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


    var _save = p5.prototype.save;
    p5.prototype.save = function() {
        var args = arguments;

        if (!this.svg) {
            _save.apply(this, args);
            return;
        }

        if (args.length === 0) {
        }

    };

});
