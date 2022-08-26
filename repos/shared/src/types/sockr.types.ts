export type TSockrProcessConfig = {
  root: string
  debug: boolean
  script: string
}

export type TSockrEvent = {
  [key:string]: any
}

export type TSockrEvents = {
  [key:string]: TSockrEvent
}


export type TSockrConfig = {
  path: string
  port: string
  host: string
  events?: TSockrEvents
  process: TSockrProcessConfig
}
