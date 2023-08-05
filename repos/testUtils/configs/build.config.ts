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
const esmOutdir = path.join(outdir, `esm`)
const cjsOutdir = path.join(outdir, `cjs`)

const exts = `js,ts`
const external = [`esbuild`, `playwright`, `@ltipton/parkin`]



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
  treeShaking: true,
  allowOverwrite: true,

  // Node execution environment
  target: [`node20`],
  assetNames: `[name]`,
  platform: `node` as const,


  // Dependency handling
  external,
  plugins: [
    aliasPlugin(aliases),
    // excludeDeps,
  ],
}


const esmBuild = async () => {
  const entryPoints = globSync(
    path.join(rootdir, `**/*.{${exts}}`),
    {
      ignore: [
        /** Ignore Typescript type defs */
        `**/*.d.ts`,
        /** Ignore transformers used for Jest */
        `**/**/transformer.ts`,
        /** Ignore old Jest configs */
        `**/jest/**/*.{${exts}}`,
        `**/__tests__/**/*.{${exts}}`,
        `**/__mocks__/**/*.{${exts}}`,
        /** Ignore past build folder */
        `**/dist/**/*.{${exts}}`,
        /** Don't include configs */
        `**/configs/**/*.{${exts}}`,
        /** For now ignore waypoint, this may be added down the road */
        `**/waypoint/**/*.{${exts}}`,
        /** Don't include dependencies */
        `**/node_modules/**/*.{${exts}}`,
      ]
    }
  )
  
  const hasExam = entryPoints.filter(loc => loc.includes(`/exam`))

  // Build the files with esbuild
  await build({
    ...options,
    entryPoints,
    splitting: true,
    outdir: esmOutdir,
    format: `esm` as const,
  })
  .catch(() => process.exit(1))
}

const cjsBuild = async () => {
  // Build the files with esbuild
  await build({
    ...options,
    format: `cjs` as const,
    outfile: path.join(cjsOutdir, `index.js`),
    entryPoints: [path.join(esmOutdir, `index.js`)]
  })
  .catch(() => process.exit(1))
}



;(async () => {
  // Remove the existing output dir
  await fs.rm(outdir, { recursive: true, force: true })
  await esmBuild()
  await cjsBuild()
})()
