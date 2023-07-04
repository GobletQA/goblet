import type { TWorldConfig } from '@ltipton/parkin'
import { deepFreeze } from '@keg-hub/jsutils/src/node'

// Default Folder name of the folder where step-definition overrides are placed
// Used when a mounted repo overrides a default step-definition
// All overrides should be saved in this folder
export const DefinitionOverrideFolder = `overrides`

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
  $merge: [],
  $alias: {},
  $headers: {},
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
  `goblet.js`,
  `goblet.config.js`,
  `goblet.ts`,
  `goblet.config.ts`,
])