import {deepFreeze} from "@keg-hub/jsutils"

export const SavedDataWorldPath = `__meta.savedData`
export const AutoSavedDataWorldPath = `__meta.autoSavedData`

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