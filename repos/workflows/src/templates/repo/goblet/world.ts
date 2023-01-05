import environment from './environments'
import { deepMerge } from '@keg-hub/jsutils'

export const world = deepMerge({
  app: {},
  data: {},
  context: {},
  $alias: {},
}, environment)

