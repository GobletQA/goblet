export type TGobletTestArtifactOption = `never` | `always` | `on-fail` | true | false | 1 | 0

export type TGobletTestStatus = `passed` | `failed`

export type TGobletTestTracingOpts = {
  sources?:boolean
  snapshots?:boolean
  screenshots?:boolean
}

export type TGobletTestOpts = {
  tracesDir?:string
  videosDir?:string
  uploadsDir?:string
  downloadsDir?:string
  reusePage?:boolean
  snapshotsDir?:string
  reuseContext?:boolean
  testType?:string|false
  tracing?:TGobletTestTracingOpts
  saveVideo?:TGobletTestArtifactOption
  saveTrace?:TGobletTestArtifactOption
  saveReport?:TGobletTestArtifactOption
  saveScreenshot?:TGobletTestArtifactOption
}