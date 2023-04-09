require('../resolveRoot')
const path = require('path')
const glob = require("glob")
const { build } = require('esbuild')
const { aliases } = require('@GConfigs/aliases.config')
const aliasPlugin = require('esbuild-plugin-path-alias')

const rootDir = path.join(__dirname, `../`)
const distDir = path.join(rootDir, `dist`)
const entryFiles = glob.sync(
  path.join(rootDir, '**/*.js'),
  {ignore: [`**/node_modules/**/*.js`, `**/dist/**/*.js`, `**/configs/**/*.js`]}
)

/**
 * Build the code
 * ESBuild config object
 * [See here for more info](https://esbuild.github.io/api/#build-api)
 */
build({
  outdir: distDir,
  // bundle: true,
  minify: false,
  sourcemap: true,
  target: 'es2020',
  platform: 'node',
  assetNames: '[name]',
  allowOverwrite: true,
  entryPoints: entryFiles,
  plugins: [
    aliasPlugin(aliases),
    /**
     * Custom plugin to filter out node_modules
     * See more info [here](https://github.com/evanw/esbuild/issues/619#issuecomment-751995294)
     */
    {
      name: 'external-node-modules',
      setup(build) {
        // Must not start with "/" or "./" or "../" which means it's a node_modules
        // eslint-disable-next-line no-useless-escape
        const filter = /^[^.\/]|^\.[^.\/]|^\.\.[^\/]/
        build.onResolve({ filter }, (args) => ({
          path: args.path,
          external: true,
        }))
      },
    },
  ],
})
