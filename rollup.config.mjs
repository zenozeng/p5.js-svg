import commonjs from '@rollup/plugin-commonjs'
import resolve from '@rollup/plugin-node-resolve'
import typescript from '@rollup/plugin-typescript'

export default [
    // unpkg
    {
        input: 'src/index.ts',
        external: ['p5'],
        output: {
            file: 'dist/p5.svg.js',
            globals: {
                p5: 'p5'
            },
            format: 'iife',
            name: 'p5Svg',
            sourcemap: true
        },
        plugins: [typescript(), resolve(), commonjs()]
    },
    // cjs (webpack, vite)
    {
        input: 'src/index.ts',
        external: ['p5'],
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
            name: 'p5SvgTests',
            sourcemap: true
        },
        plugins: [resolve(), commonjs()]
    }
]
