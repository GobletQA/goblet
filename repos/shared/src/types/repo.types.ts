
export type TRepoOpts = {
  name:string
  git:Record<string, any>
  paths?: Record<string, string>
  [key:string]: any
}