var route = function() {
    var section = window.location.hash;
    section = section.replace(/#/g, "");
    if (section.length < 1) {
        window.location.hash = "basic";
        return;
    }

    // highlight current section
    document.querySelector('.current') &&
        (document.querySelector('.current').className = '');
    var current = document.querySelector('[href="#'+section+'"]');
    if (current) {
        current.className = 'current';
    }

    // remove all canvas
    document.getElementById('defaultCanvas') &&
        document.getElementById('defaultCanvas').remove();

    var req = new XMLHttpRequest();
    req.onload = function() {
        var code = req.response;
        var elt = document.getElementById("code");
        Rainbow.color(code, 'javascript', function(code) {
            elt.innerHTML = code;
        });
        var functions = ['setup', 'draw', 'mouseClicked', 'mousePressed', 'preload'];
        functions.forEach((fn) => window[fn] = null); // reset
        var patch = functions.map((fn) => `window.${fn} = typeof ${fn} === 'undefined' ? null : ${fn};`).join('\n');
        console.log(patch);
        eval(code + patch);
        new p5(null, document.getElementById("canvas")); // global init p5
    };
    req.open("GET", "examples/" + section + ".js");
    req.send();
};

route();

window.onhashchange = function() {
    window.location.reload();
};