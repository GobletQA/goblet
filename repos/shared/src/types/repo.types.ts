import type  { EProvider } from './provider.types'
import type { TWorldConfig } from '@ltipton/parkin'
import type { TRootPaths, TFileTypes } from './files.types'
import type { TRepoMountStatus, TRepo } from './workflows.types'
import type { TDefinitionFileModelList } from './definitions.types'

export type TRepoContent = {
  repo:TRepo
  features:any
  fileTree:TRootPaths
  status:TRepoMountStatus
  definitions:TDefinitionFileModelList
  warning?:{ message:string, type?:string }
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
  tracesDir?:string
  videosDir?:string
  uploadsDir?:string
  downloadsDir?:string
}

export type TGitData = {
  name: string
  local:string
  remote:string
  branch:string
  username:string
  provider:EProvider
  repoId?:string
  repoName?:string
  newBranch?:string
  branchFrom?:boolean
}

export type TRepoOpts = {
  name:string
  $ref?:string
  git: TGitData
  paths?: TRepoPaths
  world: TWorldConfig
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
