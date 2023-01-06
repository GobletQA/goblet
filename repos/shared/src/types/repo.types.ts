import { TFileTypes } from './files.types'
export type { Repo as TRepo } from '../repo/repo'

export type TRepoPaths = {
  world:string
  workDir:string
  unitDir:string
  stepsDir:string
  repoRoot: string
  supportDir:string
  reportsDir:string
  waypointDir:string
  featuresDir:string
  artifactsDir:string
  environmentsDir:string
}

export type TWorld = {
  [key:string]: any
}

export type TGitData = {
  name: string
  local: string
  branch: string
  remote: string
  username:string
  newBranch?:string
  createBranch?:boolean
}

export type TRepoOpts = {
  name:string
  world: TWorld
  git: TGitData
  paths?: TRepoPaths
  environment?: string
  fileTypes: TFileTypes
}
