import type { TMItem, TRootDir, TFolder, TFolderChildren } from '../types'

import { buildFile } from './buildFile'
import { buildFolder } from './buildFolder'
import { buildRootDir } from './buildRootDir'

export type TLoopBuildTree = {
  keys?: string[]
  tree?: TRootDir | TFolder
  files: Record<string, string>
}

export type TLoopPathArr = {
  key: string
  paths: string[]
  children: TFolderChildren
  files: Record<string, string>
}

export type THandlePart = {
  key: string
  part: string,
  index: number
  paths: string[]
  temp: TFolderChildren
  files: Record<string, string>
}

const handlePart = ({
  key,
  temp,
  index,
  part,
  files,
  paths,
}:THandlePart) => {
  if (index === paths.length - 1){
    temp[part] = buildFile({ key, part, value: files[key] })
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
  children
}:TLoopPathArr) => {
  let temp: Record<string, TMItem> = children
  paths.forEach((part, index) => {
    temp = handlePart({
      key,
      part,
      temp,
      index,
      files,
      paths,
    })
  })

  return children
}

export const loopBuildTree = ({
  tree,
  keys,
  files,
}:TLoopBuildTree) => {
  const RootTree = tree || buildRootDir()
  keys = keys || Object.keys(files)

  keys.forEach(key => {
    loopPathArr({
      key,
      files,
      children: RootTree.children,
      paths: key.slice(1).split('/'),
    })
  })

  return RootTree
}

export const generateFileTree = (files: Record<string, string>) => {
  return loopBuildTree({ files })
}
