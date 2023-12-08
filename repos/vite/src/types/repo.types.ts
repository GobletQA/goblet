import type {
  EProvider,
  TFileTypes,
  TGBWorldCfg,
} from './shared.types'

// TODO: fix this - duplicate of repo/repos/types - TRepoPaths
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

export type TBuiltRepo = {
  id: string
  key: string
  label: string
  value: number,
  branches: string[]
}

export type TBuiltRepos = TBuiltRepo[]

type TSharedRepo = {
  branch:string
  newBranch?:string
  branchFrom?:boolean
}

export type TCreateRepoOpts = TSharedRepo & {
  repo:never,
  newRepo:string
  description?:string
  createRepo?:boolean
  organization?:string
}

export type TConnectRepo = TSharedRepo & {
  repo:string
  newRepo:never
  description?:never
  createRepo?:boolean
}

export type TRepoInputError = {
  repo?:string
  owner?:string
  branch?:string
  newBranch?:string
  branchFrom?:string
  [key: string]: string | undefined
}

export type TRepoValueCB = (value:string) => void

export type TRepoApiObj = {
  path:string
  local:string
  remote:string
  branch:string
  name?:string
  username?:string
}

export type TGitData = {
  name: string
  local:string
  remote:string
  branch:string
  username:string
  repoId?:string
  repoName?:string
  newBranch?:string
  provider:EProvider
  branchFrom?:boolean
}

export type TRepoOpts = {
  name:string
  $ref?:string
  git:TGitData
  paths?:TRepoPaths
  world?:TGBWorldCfg
  environment?:string
  fileTypes?:TFileTypes
}