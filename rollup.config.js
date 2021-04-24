import commonjs from '@rollup/plugin-commonjs';

export default [
    {
        input: 'src/index.js',
        output: {
            file: 'dist/p5.svg.js',
            format: 'iife',
        },
        plugins: [commonjs()]
    }
]