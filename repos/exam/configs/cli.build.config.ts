import '../../../configs/aliases'

import path from 'node:path'
import * as esbuild from 'esbuild'
import { fileURLToPath } from 'node:url'
import { promises as fs } from 'node:fs'
import aliasPlugin from 'esbuild-plugin-path-alias'
import { aliases } from '../../../configs/aliases.config'

const dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.join(dirname, `..`)
const binDir = path.join(rootDir, `src/bin`)
const outdir = path.join(rootDir, `.bin`)

const minify = false
const binEntry = path.join(binDir, `exam.ts`)
const workerEntry = path.join(binDir, `worker.ts`)
const workerPipeline = path.join(binDir, `workerPipeline.ts`)

const cjsBuild = async () => {
  // Build the files with esbuild
  await esbuild.build({
    outdir,
    bundle: true,
    minify: minify,
    sourcemap: true,
    platform: `node`,
    target: [`node16`],
    external: [`esbuild`],
    tsconfig: path.join(rootDir, `tsconfig.build.json`),
    plugins: [aliasPlugin(aliases)],
    entryPoints: [
      binEntry,
      workerEntry,
      workerPipeline
    ],
  })
  .catch(() => process.exit(1))
}


;(async () => {
  // Remove the existing output dir
  await fs.rm(outdir, { recursive: true, force: true })
  await cjsBuild()
})()


