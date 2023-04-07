import type { Repo as TRepo } from '../repo/repo'
import type { TRootPaths, TFileTypes } from './files.types'
import type { TDefinitionFileModelList } from './definitions.types'

export type {
  TRepo
}

export type TRepoContent = {
  repo:TRepo
  features:any
  fileTree:TRootPaths
  status:TRepoMountStatus
  definitions:TDefinitionFileModelList
}

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
  username:string
  remote: string
  branch: string
  newBranch?:string
  repoName: string
  branchFrom?:boolean
  // For gitlab, not needed in github
  repoId?:string
}

export type TRepoOpts = {
  name:string
  world: TWorld
  git: TGitData
  paths?: TRepoPaths
  environment?: string
  fileTypes: TFileTypes
}

export type TRepoFromCreate = {
  name:string
  token:string
  branch:string
  username:string
  provider:string
  newBranch?:string
  branchFrom?:boolean
  description?:string
  organization?:string
}

export type TRepoFromWorkflow = {
  token:string
  branch:string
  repoId:string
  repoUrl:string
  username:string
  newBranch?:string
  branchFrom?:boolean
}

export type TRepoGraphRepos = {
  all?:boolean
  token: string
  query?:string
  first?: number
  after?: string
  offset?:number
  username?:string
  fullPath?:string
  provider?:string
  searchPattern?:string
  sortDirection?: string
  affiliations?: string[]
  ownerAffiliations?: string[]
  headers?: Record<string, string>
}

export type TRepoMountStatus = {
  mode?: string
  setup: boolean
  status?: string
  message?:string
  mounted?: boolean
}