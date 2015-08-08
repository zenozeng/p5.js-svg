(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define('p5.svg', ['p5'], function (p5) {
            factory(p5);
        });
    }
    else if (typeof exports === 'object') {
        module.exports = factory;
    }
    else {
        console.log(3);
        factory(root['p5']);
    }
})(this, function (p5) {
    require('./index')(p5);
});
