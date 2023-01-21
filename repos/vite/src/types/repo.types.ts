
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


export type TConnectRepo = {
  repo:string
  branch:string
  newBranch:string
  branchFrom?:boolean
}