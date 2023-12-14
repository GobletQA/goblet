import { GBERoot } from '../resolveRoot'

import path from 'path'
import { esbuild } from '@ltipton/esdev'
import { aliases } from '@gobletqa/configs/aliases.config'
import { loadConfigs } from '@keg-hub/parse-config'

const nodeEnv = process.env.NODE_ENV || `local`
const entryFile = path.join(GBERoot, `index.ts`)
const outFile = path.join(GBERoot, `dist/index.js`)

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
  aliases,
  outFile,
  dev: true,
  entryFile,
  cwd: GBERoot,
  mergeEnvs:true,
  sourcemap: 'inline',
  envs: {
    ...envs,
    GOBLET_ROOT_DIR: aliases.GobletRoot
  }
})
