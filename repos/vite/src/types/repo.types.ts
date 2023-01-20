
export type TGitData = {
  name: string
  local: string
  branch: string
  remote: string
  username:string
  newBranch?:boolean
  createBranch?:boolean
}

export type TBuiltRepo = {
  id: string
  key: string
  label: string
  value: number,
  branches: string[]
}

export type TBuiltRepos = TBuiltRepo[]