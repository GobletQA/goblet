


export type TBuildFile =  {
  part:string
  key:string
  value:string
}

export type TBuildFolder =  {
  part:string
  name?: string
  path?: string
  paths:string[]
  index: number
  children?: TFolderChildren
}

export type TFolder = {
  path: string,
  name: string,
  _isDirectory: boolean,
  children: TFolderChildren,
}

export type TRootDir = {
  path: string,
  isDirectory: boolean,
  children: TFolderChildren,
}

export type TFile = {
  path: string
  name: string
  value: string
  _isFile: boolean
}

export type TFolderChildren = Record<string, TMItem>

export type TMItem = TFolder | TFile
