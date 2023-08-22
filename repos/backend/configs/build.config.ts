import { GBERoot } from '../resolveRoot'

import path from 'node:path'
import * as esbuild from 'esbuild'
import { promises as fs } from 'node:fs'
import aliasPlugin from 'esbuild-plugin-path-alias'
import { aliases } from '@GConfigs/aliases.config'

const outdir = path.join(GBERoot, `dist`)
const entryFile = path.join(GBERoot, `index.ts`)
const gentryFile = path.join(aliases.GobletRoot, `configs/goblet.default.config.js`)

const esmBuild = async () => {
  // Build the files with esbuild
  await esbuild.build({
    outdir,
    bundle: true,
    minify: false,
    sourcemap: true,
    platform: `node`,
    treeShaking: true,
    target: [`node20`],
    entryNames: `[name]`,
    mainFields: [`module`, `main`],
    conditions: [
      `import`, `module`
    ],
    entryPoints: [
      entryFile,
      gentryFile
    ],
    plugins: [aliasPlugin(aliases)],
    external: [
      `esbuild`,
      `fsevents`,
      `@kubernetes/client-node`,
    ],
    tsconfig: path.join(GBERoot, `tsconfig.json`)
  })
  .catch((cause:any) => {
    console.error(cause)
    process.exit(1)
  })
}


;(async () => {
  // Remove the existing output dir
  await fs.rm(outdir, { recursive: true, force: true })
  await esmBuild()
})()


