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
const outFile = path.join(distDir, `goblet.default.config.js`)
const entryFile = path.join(aliases.GobletRoot, `configs/goblet.default.config.js`)
const nodeEnv = process.env.NODE_ENV || `local`

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
  sourcemap: 'inline',
  envs: {
    ...envs,
    GOBLET_ROOT_DIR: aliases.GobletRoot
  }
})

