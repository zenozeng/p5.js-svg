import commonjs from '@rollup/plugin-commonjs'
import resolve from '@rollup/plugin-node-resolve'
import typescript from '@rollup/plugin-typescript'

export default [
    // unpkg
    {
        input: 'src/index.ts',
        output: {
            file: 'dist/p5.svg.js',
            format: 'iife',
            sourcemap: true
        },
        plugins: [typescript(), resolve(), commonjs()]
    },
    // cjs (webpack, vite)
    {
        input: 'src/index.ts',
        output: {
            file: 'dist/p5.svg.cjs.js',
            format: 'cjs',
            sourcemap: true
        },
        plugins: [typescript(), resolve(), commonjs()]
    },
    // test
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