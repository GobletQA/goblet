require('../resolveRoot')
const path = require('path')
const { aliases } = require('@GConfigs/aliases.config')

// eslint-disable-next-line import/no-extraneous-dependencies
const { build } = require('esbuild')
// eslint-disable-next-line import/no-extraneous-dependencies
const aliasPlugin = require('esbuild-plugin-path-alias')

const rootDir = path.join(__dirname, `../`)
const distDir = path.join(rootDir, `dist`)
const outFile = path.join(distDir, `goblet.default.config.js`)
const entryFile = path.join(aliases.GobletRoot, `configs/goblet.default.config.js`)

/**
 * Build the goblet defualt config into a single file
 * ESBuild config object
 * [See here for more info](https://esbuild.github.io/api/#build-api)
 */
build({
  outfile: outFile,
  bundle: true,
  minify: false,
  sourcemap: true,
  target: 'es2017',
  platform: 'node',
  assetNames: '[name]',
  allowOverwrite: true,
  entryPoints: [entryFile],
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
