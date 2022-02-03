export default function(p5) {

    // https://github.com/zenozeng/p5.js-svg/issues/204
    p5.Color.prototype.indexOf = function(searchElement, fromIndex) {
        return this.toString().indexOf(searchElement, fromIndex);
    };
}