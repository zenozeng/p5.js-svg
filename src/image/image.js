/**
* @module Image
* @submodule Image
* @for p5
* @requires core
*/
define(function(require) {
    'use strict';

    var p5 = require('core');

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
        var canvas = this._curElement && this._curElement.elt;
        var dataURL = canvas.toDataURL(mine[ext]);

        if ( p5.prototype._isSafari() ) {
            var aText = 'Hello, Safari user!\n';
            aText += 'Now capturing a screenshot...\n';
            aText += 'To save this image,\n';
            aText += 'go to File --> Save As.\n';
            alert(aText);
            window.location.href = dataURL;
        } else {
            var downloadMime = 'image/octet-stream';
            dataURL = dataURL.replace(mine[ext], downloadMime);
            p5.prototype.downloadFile(dataURL, filename, ext);
        }
    };
});
