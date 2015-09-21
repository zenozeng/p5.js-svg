var test = function() {
    mocha.setup('bdd');
    mocha.setup({timeout: 10000, slow: 2000});
    require('./filter/filter');
    require('./svg/element');
    require('./svg/manipulate');
    require('./rendering/rendering');
    require('./io/save-frames');
    require('./io/save');
    require('./io/save-svg');
    require('./shape/2d_primitives');
    require('./shape/attributes');
    require('./shape/curves');
    require('./shape/vertex');

    // Note that since recent version of karma, mocha.run will be called automatically
    // So, we only call mocah.run() if not running inside karma
    if (!window.__karma__) {
        mocha.run();
    }
};


test();
