import { deepFreeze } from '@keg-hub/jsutils/src/node'

export const PlayAction = `PLAY-ACTION`

export const PWPlay = {
  playSpecDone: `PLAY-SPEC-DONE`,
  playSpecStart: `PLAY-SPEC-START`,
  playSuiteDone: `PLAY-SUITE-DONE`,
  playSuiteStart: `PLAY-SUITE-START`,
  playEnded: `PLAY-ENDED`,
  playError: `PLAY-ERROR`,
  playAction: `PLAY-ACTION`,
  playGeneral: `PLAY-GENERAL`,
  playResults: `PLAY-RESULTS`,
  playStarted: `PLAY-STARTED`,
  playCanceled: `PLAY-CANCELED`,
}

export const PWAutomateEvent = `PW-AUTOMATE-EVENT`

export const DefaultCookieFile = `browser-cookie-state`
export const DefaultStateFile = `browser-context-state`
export const DefaultStorageFile = `browser-storage-state`

// Default Folder name of the folder where step-definition overrides are placed
// Used when a mounted repo overrides a default step-definition
// All overrides should be saved in this folder
export const DefinitionOverrideFolder = `overrides`

export const BrowserArtifactTypes = deepFreeze([
  `traces`,
  `videos`,
  `snapshots`,
  `downloads`
])

export const ArtifactSaveOpts = deepFreeze({
  true: true,
  false: false,
  always: `always`,
  failed: `failed`,
  never: `never`,
})

