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
        ext = ext || p5.prototype._checkFileExtension(filename, ext)[1];
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
            throw new Error('Fail to call saveSVG, invalid extension, please use png|jpeg|jpg|svg.');
        }
        var canvas = this._curElement && this._curElement.elt;
        var svg = canvas.toDataURL('image/svg+xml');

        var p = this;
        svg2img(svg, mine[ext], function(err, dataURL) {
            var downloadMime = 'image/octet-stream';
            dataURL = dataURL.replace(mine[ext], downloadMime);
            p.downloadFile(dataURL, filename, ext);
        });
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

    var _saveFrames = p5.prototype.saveFrames;
    p5.prototype.saveFrames = function() {
        var args = arguments;

        if (!this.svg) {
            _saveFrames.apply(this, args);
            return;
        }

        // TODO
    };
});
