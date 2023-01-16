import type { TFileTree, TFileModel } from '@types'
import { filesDispatch } from '@store'


export const setFiles = (files:TFileModel[]) => {

  const fileTree = files.reduce((tree, file) => {
    tree[file.location] = file

    return tree
  }, {} as TFileTree)

  filesDispatch.setFiles(fileTree)
}
