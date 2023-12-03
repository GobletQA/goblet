import {deepFreeze} from '@keg-hub/jsutils/deepFreeze'

export const PWAutomateEvent = `PW-AUTOMATE-EVENT`

export const DefaultCookieFile = `browser-cookie-state`
export const DefaultStateFile = `browser-context-state`
export const DefaultStorageFile = `browser-storage-state`

export const BrowserArtifactTypes = deepFreeze([
  `traces`,
  `videos`,
  `uploads`,
  `downloads`,
  `snapshots`,
])

export const ArtifactSaveOpts = deepFreeze({
  true: true,
  false: false,
  always: `always`,
  failed: `failed`,
  never: `never`,
})

