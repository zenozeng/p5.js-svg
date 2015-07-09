// 1. make hook in redraw and make every thing in a async queue?
// 2. make every thing a generator or es7 async function?
p5.prototype._await = function(fn) {
    // pause loop
    var p = this;
    var _loop = p._loop;
    p._loop = false;

    // pause following functions

    var collect = {};

    var queue = [];

    // note: functions outside p5 will not wait!
    for (p in p5.prototype) {
        if (typeof p === "function") {
            collect[p] = p5.prototype[p];
            p5.prototype[p] = function() {
                queue.push({fn: p, args: arguments});
            };
        }
    }

    fn().then(function() {
        p._loop = _loop;
        // resume following functions
    });
};
