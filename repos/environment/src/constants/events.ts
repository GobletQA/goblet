/**
 *
 * **IMPORTANT**
 * The value do not match the keys because they are a reference to the websocket methods
 * Unfortunately a decision was made to use this format
 * Then convert it to camelCase, and use that as the event name for the socket.io event name
 * Which means they are tightly coupled and can not change
 * The socket.io implementation needs to be reworked to decouple the naming format
 * Until that's done, leave these as they are
 * **IMPORTANT**
 *
 */
export const TestsToSocketEvtMap = {
  specDone: `PLAY-SPEC-DONE`,
  specWarn: `PLAY-SPEC-WARN`,
  specStart: `PLAY-SPEC-START`,
  suiteDone: `PLAY-SUITE-DONE`,
  suiteStart: `PLAY-SUITE-START`,
  suiteDoneRoot: `PLAY-SUITE-DONE-ROOT`,
  suiteStartRoot: `PLAY-SUITE-START-ROOT`,
  ended: `PLAY-ENDED`,
  error: `PLAY-ERROR`,
  action: `PLAY-ACTION`,
  general: `PLAY-GENERAL`,
  results: `PLAY-RESULTS`,
  started: `PLAY-STARTED`,
  canceled: `PLAY-CANCELED`,
  stopped: `PLAY-STOPPED`,
  warning: `PLAY-WARNING`,
}


export const KillTestRunUIProcEvt = `kill-test-run-ui-proc-event`

export const KillPlayCodeRunnerEvt = `kill-play-code-runner-event`
