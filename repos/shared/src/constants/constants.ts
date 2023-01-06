import type { TWorldConfig } from '@GSH/types'
import { deepFreeze } from '@keg-hub/jsutils/src/node'

export const DefinitionOverrideFolder = `override`

export const ARTIFACT_TYPES = deepFreeze([
  `traces`,
  `videos`,
  `snapshots`,
  `downloads`
])

export const ARTIFACT_SAVE_OPTS = deepFreeze({
  true: true,
  false: false,
  always: `always`,
  failed: `failed`,
  never: `never`,
})

export const DefWorld:TWorldConfig = deepFreeze({
  app: {},
  data: {},
  merge: [],
  $alias: {},
  context: {},
})

export const GobletConfigFileLocations = deepFreeze([
  ``,
  `./config`,
  `./configs`,
  `./goblet`,
  `./test`,
  `./tests`
])

export const GobletConfigFileNames = deepFreeze([
  `.gobletrc`,
  `.gobletrc.json`,
  `goblet.json`,
  `goblet.config.json`,
  `goblet.js`,
  `goblet.config.js`,
  `goblet.ts`,
  `goblet.config.ts`,
])