import commonjs from "rollup-plugin-commonjs";
import json from "rollup-plugin-json";
import resolve from "rollup-plugin-node-resolve";
import sourceMaps from "rollup-plugin-sourcemaps";
import typescript from "rollup-plugin-typescript2";
import { uglify } from "rollup-plugin-uglify";

// tslint:disable-next-line:no-var-requires
const pkg = require("./package.json");
const tsESM = typescript({
  tsconfigOverride: { compilerOptions: { target: "es5" } },
  useTsconfigDeclarationDir: true
});
const tsUMD = typescript({
  useTsconfigDeclarationDir: true
});

const defaultConfig = {
  // Indicate here external modules you don't wanna include in your bundle (i.e.: 'lodash')
  external: [],
  input: `src/index.ts`,
  plugins: [
    // Allow json resolution
    json(),
    // Allow bundling cjs modules (unlike webpack, rollup doesn't understand cjs)
    commonjs(),
    // Allow node_modules resolution, so you can use 'external' to control
    // which external modules to include in the bundle
    // https://github.com/rollup/rollup-plugin-node-resolve#usage
    resolve(),
    // Resolve source maps to the original source
    sourceMaps()
  ],
  watch: {
    include: "src/**"
  }
};

export default [
  {
    ...defaultConfig,
    output: {
      file: pkg.main,
      format: "umd",
      name: "@libre/atom",
      sourcemap: true
    },
    plugins: [...defaultConfig.plugins, tsUMD, uglify()]
  },
  {
    ...defaultConfig,
    output: {
      file: pkg.module,
      format: "es",
      sourcemap: true
    },
    plugins: [...defaultConfig.plugins, tsESM]
  }
];
