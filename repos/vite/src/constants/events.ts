import { ETestRunEvtRef } from '@types'

export const BrowserNavEvt = `browser-nav-event`
export const PlayerTestEvt = `player-test-event`
export const GlobalCopyEvt = `global-copy-event`
export const UpdateModalEvt = `update-modal-event`
export const VNCConnectedEvt = `vnc-connected-event`
export const WindowResizeEvt = `window-resize-event`
export const PlayerEndedEvent = `player-ended-event`
export const PlayerErrorEvent = `player-error-event`
export const BrowserStateEvt = `browser-state-event`
export const ToggleSideNavEvt = `toggle-side-nav-event`
export const PlayerStartedEvent = `player-started-event`
export const OpenEditorFileEvt = `open-editor-file-event`
export const SideNavToggledEvt = `side-nav-toggled-event`
export const WSAutomateEvent = `ws-automate-response-event`
export const EditorPathChangeEvt = `editor-path-change-event`
export const PlayerClearDecorationEvt = `player-clear-decoration-event`
export const WSCancelPlayerEvent = `ws-cancel-player-response-event`
export const WSCancelAutomateEvent = `ws-cancel-automate-response-event`
export const ShowBrowserLoadingEvent = `show-browser-loading-event`
export const SetBrowserIsLoadedEvent = `set-browser-is-loaded-event`
export const WSSocketResetEvt = `ws-socket-reset-event`

export const OnTestRunEvt = `on-test-run-event`
export const TestRunEndedEvt = `test-run-ended-event`
export const TestRunErrorEvt = `test-run-error-event`
export const TestRunGetUICfgEvt = `test-run-get-ui-cfg-event`
export const WSCancelTestRunEvt = `ws-cancel-test-run-event`

export const TestRunEndEvt = ETestRunEvtRef.TestRunEndEvt
export const TestRunFileRootEvtRef = ETestRunEvtRef.TestRunFileRootEvtRef
