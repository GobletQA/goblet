export type { Repo as TRepo } from '../repo/repo'

export type TRepoOpts = {
  name:string
  environment?: string
  git:Record<string, any>
  paths?: Record<string, string>
  [key:string]: any
}