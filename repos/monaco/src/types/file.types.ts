
export interface TFilelist {
  [key: string]: string | null
}

export type TMFile = {
  ext: string
  uuid: string
  name: string
  content: string
  location: string
  relative: string
}
export type TMFiles = {
  [key:string]: TMFile
}

export type TBuildFile = {
  ext?:string
  part:string
  key:string
  value:string|null
}

export type TBuildFolder = {
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
  ext:string
  path: string
  name: string
  value: string|null
}

export type TFolderChildren = Record<string, TMItem>

export type TMItem = TFolder | TFile
