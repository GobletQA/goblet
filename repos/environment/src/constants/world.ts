import type { TGBWorldCfg } from '../types'
import { deepFreeze } from '@keg-hub/jsutils/deepFreeze'


export const DefWorld:TGBWorldCfg = deepFreeze({
  app: {},
  data: {},
  $merge: [],
  $alias: {},
  $context: {},
  $browser: {},
})

export const SavedDataWorldPath = `__meta.savedData`
export const AutoSavedDataWorldPath = `__meta.autoSavedData`

export const SavedTextWorldPath = `__meta.savedText`
export const SavedLocatorWorldPath = `__meta.savedElement`
export const AutoSavedLocatorWorldPath = `__meta.autoSavedElement`

export const AllowedWorldExtensions = deepFreeze([
  `.ts`,
  `.js`,
  `.cjs`,
  `.mjs`,
  `.cts`,
  `.mts`
])