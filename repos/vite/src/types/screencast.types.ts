

export type TScreencastStatus = {
  lastCheck: boolean,
}

export type TBrowserOpts = {
  restart: boolean
  [key:string]: any
}

export type TRecordingBrowser = {
  isRecording: boolean
}

export type TActionRange = {
  endColumn: number
  startColumn: number
  endLineNumber: number
  startLineNumber: number
}

export type TRecordingActions = {
  lineNumber: number
  range: TActionRange
}
