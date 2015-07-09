// 1. make hook in redraw and make every thing in a async queue?
// 2. make every thing a generator or es7 async function?
p5.prototype._await = function(fn) {
    // pause loop
    var p = this;
    var _loop = p._loop;
    p._loop = false;

    // pause following functions

    fn().then(function() {
        p._loop = _loop;
        // resume following functions
    });
};
