

export type TBrowserConf = {
  type:string
  slowMo?: number
  context?:string
  channel?:string
  restart?:boolean
  headless?:boolean,
  url?:string
  args?:string[]
  config:Record<any, any>
}