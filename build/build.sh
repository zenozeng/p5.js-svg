#!/bin/bash

version=$(cat package.json | grep version | sed 's/[^0-9.]*//g')

header="/*!!
 *  p5.svg v$version
 *  SVG Runtime for p5.js.
 *
 *  Copyright (C) 2015-2016 Zeno Zeng
 *  Licensed under the LGPL license.
 */
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
        factory(root['p5']);
    }
})(this, function (p5) {
"

content=$(browserify build/entry.js)

footer="});"

cat > dist/p5.svg.js <<EOF
$header
$content
$footer
EOF
