
import path from 'node:path'
import * as esbuild from 'esbuild'
import { fileURLToPath } from 'node:url'
import { promises as fs } from 'node:fs'

const dirname = path.dirname(fileURLToPath(import.meta.url))

const rootDir = path.join(dirname, `..`)
const srcDir = path.join(rootDir, `./src`)
const outdir = path.join(rootDir, `./dist`)
const cjsOutdir = path.join(rootDir, `./dist/cjs`)
const esmOutdir = path.join(rootDir, `./dist/esm`)

const mainEntry = path.join(srcDir, `index.ts`)
const envsEntry = path.join(srcDir, `envs/index.ts`)
const constantsEntry = path.join(srcDir, `constants/index.ts`)

const opts = {
  minify: false,
  bundle: true,
  sourcemap: true,
  treeShaking: true,
  allowOverwrite: true,
  entryPoints: [
    mainEntry,
    envsEntry,
    constantsEntry
  ],
}

const esmBuild = async () => {
  // Build the files with esbuild
  await esbuild.build({
    ...opts,
    platform: `node`,
    outdir: esmOutdir,
    format: `esm` as const,
  })
  .catch((cause:any) => {
    console.log(cause)
    process.exit(1)
  })
}

const cjsBuild = async () => {
  // Build the files with esbuild
  await esbuild.build({
    ...opts,
    platform: `node`,
    outdir: cjsOutdir,
    target: [`node18`],
  })
  .catch((cause:any) => {
    console.log(cause)
    process.exit(1)
  })
}


;(async () => {
  // Remove the existing output dir
  await fs.rm(outdir, { recursive: true, force: true })
  await Promise.all([esmBuild(), cjsBuild()])
})()

