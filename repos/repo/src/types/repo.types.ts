import type { Repo } from '../repo'
import type { TWorldConfig } from '@ltipton/parkin'
import type {
  EProvider,
  TRootPaths,
  TFileTypes,
  TRepoMountStatus,
  TDefinitionFileModelList,
} from './shared.types'

export type TRepoContent = {
  repo:Repo
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


export type {
  Repo
}