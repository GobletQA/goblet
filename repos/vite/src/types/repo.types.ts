
export type TGitData = {
  name: string
  local: string
  remote: string
  username:string
  branch: string
  newBranch:string
  branchFrom?:boolean
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

export type TCreateRepo = TSharedRepo & {
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