
import { GGTRoot } from '../resolveRoot'

import path from 'path'
import { esbuild } from '@ltipton/esdev'
import { aliases } from '@GConfigs/aliases.config'
import { loadConfigs } from '@keg-hub/parse-config'

const dev = process.env.DEV_BUILD === `1`
const nodeEnv = process.env.NODE_ENV || `local`
const entryFile = path.join(GGTRoot, `index.js`)
const outFile = path.join(GGTRoot, `dist/index.js`)

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
  cwd: GGTRoot,
  mergeEnvs:true,
  sourcemap: 'inline',
  envs: {
    ...envs,
    GOBLET_ROOT_DIR: aliases.GobletRoot
  }
})
