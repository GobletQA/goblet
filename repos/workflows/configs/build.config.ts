import { GWFRoot } from '../resolveRoot'

import path from 'path'
import { esbuild } from '@ltipton/esdev'
import { aliases } from '@GConfigs/aliases.config'
import { loadConfigs } from '@keg-hub/parse-config'

const dev = process.env.DEV_BUILD === `1`
const nodeEnv = process.env.NODE_ENV || `local`
const entryFile = path.join(GWFRoot, `index.ts`)
const outFile = path.join(GWFRoot, `dist/index.js`)

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
  cwd: GWFRoot,
  mergeEnvs:true,
  sourcemap: 'inline',
  envs: {
    ...envs,
    GOBLET_ROOT_DIR: aliases.GobletRoot
  }
})