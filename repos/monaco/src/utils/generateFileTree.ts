import type { TFileItem, TRootDir, TFolder, TFolderChildren, TFilelist } from '../types'

import { buildFile } from './buildFile'
import { buildFolder } from './buildFolder'
import { buildRootDir } from './buildRootDir'

export type TLoopBuildTree = {
  keys?: string[]
  files: TFilelist
  rootPrefix?: string
  tree?: TRootDir | TFolder
}

export type TLoopPathArr = {
  key: string
  paths: string[]
  files: TFilelist
  rootPrefix?:string
  children: TFolderChildren
}

export type THandlePart = {
  key: string
  part: string,
  index: number
  paths: string[]
  files: TFilelist
  rootPrefix?:string
  temp: TFolderChildren
}

const handlePart = ({
  key,
  temp,
  index,
  part,
  files,
  paths,
  rootPrefix
}:THandlePart) => {

  if (index === paths.length - 1){
    // If it's a folder, and no more parts then it's empty, so just return temp
    if(key.endsWith(`/`)) return temp

    temp[part] = buildFile({
      key,
      part,
      rootPrefix,
      content: files[key]
    })

    return temp
  }

  if (temp[part]) return (temp[part] as TFolder).children

  temp[part] = buildFolder({
    part,
    index,
    paths
  })

  return (temp[part] as TFolder).children
}

export const loopPathArr = ({
  key,
  files,
  paths,
  children,
  rootPrefix,
}:TLoopPathArr) => {
  let temp: Record<string, TFileItem> = children
  paths.forEach((part, index) => {
    temp = handlePart({
      key,
      part,
      temp,
      index,
      files,
      paths,
      rootPrefix
    })
  })

  return children
}

export const loopBuildTree = ({
  tree,
  keys,
  files,
  rootPrefix
}:TLoopBuildTree) => {
  const RootTree = tree || buildRootDir()
  keys = keys || Object.keys(files)

  keys.forEach(key => {
    loopPathArr({
      key,
      files,
      rootPrefix,
      children: RootTree.children,
      paths: key.slice(1).split('/'),
    })
  })

  return RootTree
}

export const generateFileTree = (files: TFilelist, rootPrefix?: string) => {
  return loopBuildTree({ files, rootPrefix })
}
