export type TGobletTestArtifactOption = `never` | `always` | `on-fail` | true | false | 1 | 0

export type TGobletTestStatus = `passed` | `failed`

export type TGobletTestTracingOpts = {
  snapshots?:boolean
  screenshots?:boolean
}

export type TGobletTestOpts = {
  retry?:number
  timeout?:number
  tracesDir?:string
  videosDir?:string
  downloads?:string
  snapshotsDir?:string
  testType?:string|false
  tracing?:TGobletTestTracingOpts
  saveVideo?:TGobletTestArtifactOption
  saveTrace?:TGobletTestArtifactOption
  saveReport?:TGobletTestArtifactOption
  reusePage?:boolean
  reuseContext?:boolean
}