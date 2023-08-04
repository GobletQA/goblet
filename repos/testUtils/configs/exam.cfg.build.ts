import path from 'node:path'
import { globSync } from "glob"
import * as esbuild from 'esbuild'
import { fileURLToPath } from 'node:url'
import { promises as fs } from 'node:fs'

const dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.join(dirname, `..`)
const cfgDir = path.join(rootDir, `src/exam`)
const outdir = path.join(rootDir, `build/exam`)

const exts = `js,ts`
const external = [`esbuild`, `playwright`]

const entryPoints = globSync(
  path.join(cfgDir, `**/*.{${exts}}`),
  {
    ignore: [
      /** Ignore Typescript type defs */
      `**/*.d.ts`,
      `**/*.types.ts`,
      `**/scripts/**/*.{${exts}}`,
      `**/__tests__/**/*.{${exts}}`,
      `**/__mocks__/**/*.{${exts}}`,
      /** Don't include dependencies */
      `**/node_modules/**/*.{${exts}}`,
    ]
  }
)

const minify = false

const cjsBuild = async () => {
  // Build the files with esbuild
  await esbuild.build({
    outdir,
    external,
    entryPoints,
    bundle: true,
    minify: minify,
    sourcemap: true,
    target: [`node20`],
    assetNames: `[name]`,
    platform: `node` as const,
  })
  .catch(() => process.exit(1))
}


;(async () => {
  // Remove the existing output dir
  await fs.rm(outdir, { recursive: true, force: true })
  await cjsBuild()
})()


