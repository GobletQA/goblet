import { deepFreeze } from '../utils/helpers'

export const GobletConfigFileLocations = deepFreeze([
  ``,
  `./config`,
  `./configs`,
  `./goblet`,
  `./test`,
  `./tests`
])

export const GobletConfigFileNames = deepFreeze<string[]>([
  `.gobletrc`,
  `goblet.js`,
  `goblet.config.js`,
  `goblet.ts`,
  `goblet.config.ts`,
])

export const GobletConfigRef = `<<-goblet-config-$ref->>`