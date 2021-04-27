import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve'

export default [
    {
        input: 'src/index.js',
        output: {
            file: 'dist/p5.svg.js',
            format: 'iife',
            sourcemap: true            
        },
        plugins: [resolve(), commonjs()]
    },
    {
        input: 'test/unit/index.js',
        output: {
            file: 'dist/test.js',
            format: 'iife',
            sourcemap: true
        },
        plugins: [resolve(), commonjs()]
    }
]