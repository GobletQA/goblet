import { GBERoot } from '../resolveRoot'

import path from 'node:path'
import * as esbuild from 'esbuild'
import { fileURLToPath } from 'node:url'
import { promises as fs } from 'node:fs'
import aliasPlugin from 'esbuild-plugin-path-alias'
import { loadConfigs } from '@keg-hub/parse-config'
import { aliases } from '@GConfigs/aliases.config'

const nodeEnv = process.env.NODE_ENV || `local`
const entryFile = path.join(GBERoot, `index.ts`)
const outdir = path.join(GBERoot, `dist`)
const outfile = path.join(outdir, `index.js`)

/**
 * Load the ENVs from <node-env>.env ( local.env || prod.env )
 */
const envs = loadConfigs({
  noYml: true,
  env: nodeEnv,
  name: 'goblet',
  locations: [aliases.GobletRoot],
})


const esmBuild = async () => {
  // Build the files with esbuild
  await esbuild.build({
    outfile,
    bundle: true,
    minify: false,
    sourcemap: true,
    platform: `node`,
    target: [`node20`],
    entryPoints: [entryFile],
    plugins: [aliasPlugin(aliases)],
    external: [`esbuild`, `fsevents`],
    tsconfig: path.join(GBERoot, `tsconfig.json`),
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


