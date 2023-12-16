import { GSCRoot } from '../resolveRoot'

import path from 'node:path'
import * as esbuild from 'esbuild'
import config from '../package.json'
import { promises as fs } from 'node:fs'
import aliasPlugin from 'esbuild-plugin-path-alias'
import { aliases } from '@gobletqa/configs/aliases.config'

const outdir = path.join(GSCRoot, `dist`)
const entryFile = path.join(GSCRoot, `index.ts`)

const shared = {
  outdir,
  bundle: true,
  minify: false,
  sourcemap: false,
  treeShaking: true,
  target: [`node20`],
  entryNames: `[name]`,
  platform: `node` as const,
  plugins: [aliasPlugin(aliases)],
  tsconfig: path.join(GSCRoot, `tsconfig.json`),
}

const screencastBuild = async () => {
  // Build the files with esbuild
  await esbuild.build({
    ...shared,
    entryPoints: [entryFile],
    external: [
      `fsevents`,
      ...Object.keys(config.dependencies),
      ...Object.keys(config.devDependencies),
    ],
  })
  .catch((cause:any) => {
    console.error(cause)
    process.exit(1)
  })
}

;(async () => {
  // Remove the existing output dir
  await fs.rm(outdir, { recursive: true, force: true })
  await screencastBuild()
})()

