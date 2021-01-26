import { terser } from 'rollup-plugin-terser';
import babel from '@rollup/plugin-babel';
import replace from 'rollup-plugin-replace';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import pkg from './package.json';

const DEV = !!process.env.ROLLUP_WATCH;
const ENV = DEV ? 'development' : 'production';
const VERSION = `"${pkg.version}"`;

export default [
  {
    input: 'src/index.js',
    output: [{
      name: 'Numl Utils',
      dir: `./dist/`,
      format: 'es',
    }],
    plugins: [
      babel({
        plugins: [
          '@babel/plugin-proposal-object-rest-spread',
        ],
        exclude: /node_modules/,
        babelHelpers: 'bundled',
      }),
      replace({
        'process.env.NODE_ENV': JSON.stringify(ENV),
        'process.env.APP_VERSION': VERSION,
      }),
      resolve({
        extensions: ['.jsx', '.js'],
      }),
      commonjs(),
      json(),
      ENV === 'development' ? undefined : terser(),
    ]
  }
];
