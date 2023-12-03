import {deepFreeze} from '@keg-hub/jsutils/deepFreeze'

export const GobletConfigFileLocations = deepFreeze([
  ``,
  `./config`,
  `./configs`,
  `./goblet`,
  `./test`,
  `./tests`
])

export const GobletConfigFileNames = deepFreeze<string[]>([
  `goblet.config.ts`,
  `goblet.config.js`,
  `goblet.ts`,
  `goblet.js`,
  `.gobletrc`,
])

export const GobletConfigRef = `<<-goblet-config-$ref->>`