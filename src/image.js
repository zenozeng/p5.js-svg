export default function(p5) {
    p5.prototype.loadPixels = function(...args) {
        p5._validateParameters('loadPixels', args);
        return this._renderer.loadPixels();
    };
}

