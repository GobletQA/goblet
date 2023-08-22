import { GBERoot } from '../resolveRoot'

import path from 'node:path'
import * as esbuild from 'esbuild'
import { promises as fs } from 'node:fs'
import aliasPlugin from 'esbuild-plugin-path-alias'
import { aliases } from '@GConfigs/aliases.config'

const outdir = path.join(GBERoot, `dist`)
const entryFile = path.join(GBERoot, `index.ts`)
const gentryFile = path.join(aliases.GobletRoot, `configs/goblet.default.config.js`)

const shared = {
  outdir,
  bundle: true,
  minify: false,
  sourcemap: false,
  treeShaking: true,
  target: [`node20`],
  entryNames: `[name]`,
  platform: `node` as const,
  mainFields: [`module`, `main`],
  conditions: [`import`, `module`],
  plugins: [aliasPlugin(aliases)],
  tsconfig: path.join(GBERoot, `tsconfig.json`),
}

const backendBuild = async () => {
  // Build the files with esbuild
  await esbuild.build({
    ...shared,
    entryPoints: [entryFile],
    external: [
      `esbuild`,
      `fsevents`,
      `@kubernetes/client-node`,
    ],
  })
  .catch((cause:any) => {
    console.error(cause)
    process.exit(1)
  })
}


const gobletBuild = async () => {
  // Build the files with esbuild
  await esbuild.build({
    ...shared,
    entryPoints: [gentryFile],
    external: [
      `esbuild`,
      `fsevents`,
      `@kubernetes/client-node`,
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
  await backendBuild()
  await gobletBuild()
})()

