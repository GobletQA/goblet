
export type TJestTracingOpts = {
  snapshots?:boolean
  screenshots?:boolean
}

export type TJestGobletOpts = {
  testType?:string|false
  saveTrace?:string|false
  saveVideo?:string|false
  saveReport?:string|false
  tracing?:TJestTracingOpts
}