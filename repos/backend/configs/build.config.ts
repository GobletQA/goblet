import { GBERoot } from '../resolveRoot'

import path from 'path'
import { fileURLToPath } from 'url'
import { esbuild } from '@gobletqa/esdev'
import { aliases } from '@GConfigs/aliases.config'
import { loadConfigs } from '@keg-hub/parse-config'

// @ts-ignore
const dirname = path.dirname(fileURLToPath(import.meta.url))
const dev = process.env.DEV_BUILD === `1`
const distDir = path.join(GBERoot, `dist`)
const outFile = path.join(distDir, `index.js`)
const entryFile = path.join(GBERoot, `index.ts`)
const nodeEnv = process.env.NODE_ENV || `local`

/**
 * Load the ENVs from <node-env>.env ( local.env || prod.env )
 */
const envs = loadConfigs({
  noYml: true,
  env: nodeEnv,
  name: 'goblet',
  locations: [aliases.GobletRoot],
})

esbuild({
  dev,
  aliases,
  outFile,
  entryFile,
  cwd: GBERoot,
  mergeEnvs:true,
  envs: {
    ...envs,
    GOBLET_ROOT_DIR: aliases.GobletRoot
  }
})
