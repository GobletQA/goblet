import '../resolveRoot'

import path from 'path'
import { build } from 'esbuild'
import { globSync } from "glob"
import { fileURLToPath } from 'node:url'
import { promises as fs } from 'node:fs'
import { aliases } from '@GConfigs/aliases.config'
import aliasPlugin from 'esbuild-plugin-path-alias'

const dirname = path.dirname(fileURLToPath(import.meta.url))
const rootdir = path.join(dirname, `../`)
const outdir = path.join(rootdir, `build`)

const exts = `js,ts`
const external = [`esbuild`, `playwright`]

const entryPoints = globSync(
  path.join(rootdir, `**/*.{${exts}}`),
  {
    ignore: [
      `**/*.d.ts`,
      `**/jest/**/*.{${exts}}`,
      `**/build/**/*.{${exts}}`,
      `**/configs/**/*.{${exts}}`,
      `**/waypoint/**/*.{${exts}}`,
      `**/node_modules/**/*.{${exts}}`,
    ]
  }
)

const excludeDeps = {
  name: `external-node-modules`,
  setup(build) {
    // Must not start with "/" or "./" or "../" which means it's a node_modules
    // eslint-disable-next-line no-useless-escape
    const filter = /^[^.\/]|^\.[^.\/]|^\.\.[^\/]/
    build.onResolve({ filter }, (args) => {
      return {
        path: args.path,
        external: true,
      }
    })
  },
}

/**
 * Build the code
 * ESBuild config object
 * [See here for more info](https://esbuild.github.io/api/#build-api)
 */
const options = {
  // Build settings
  minify: false,
  bundle: true,
  sourcemap: true,
  allowOverwrite: true,

  // Node execution environment
  target: [`node20`],
  assetNames: `[name]`,
  platform: `node` as const,

  // Inputs and Outputs
  entryPoints,
  outdir: outdir,

  // Dependency handling
  external,
  plugins: [
    aliasPlugin(aliases),
    // excludeDeps,
  ],
}


const cjsBuild = async () => {
  // Build the files with esbuild
  await build(options)
  .catch(() => process.exit(1))
}


;(async () => {
  // Remove the existing output dir
  await fs.rm(outdir, { recursive: true, force: true })
  await cjsBuild()
})()
