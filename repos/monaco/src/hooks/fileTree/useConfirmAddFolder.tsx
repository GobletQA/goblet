import { useCallback } from 'react'
import { addSourceFolder } from '../../utils/addSourceFolder'
import { deleteSourceFolder } from '../../utils/deleteSourceFolder'

export type THConfirmAddFolder = {
  filetree: Record<any, any>,
  updateFiletree: (...args:any[]) => any,
  onAddFolder: (...args:any[]) => any,
}

export const useConfirmAddFolder = (props:THConfirmAddFolder) => {
  const {
    filetree,
    onAddFolder,
    updateFiletree,
  } = props
  
  return useCallback(
    (file: any) => {
      let tree: any = {}
      if (file.name) {
        tree = deleteSourceFolder(filetree, file.path)
        tree = addSourceFolder(tree, file.path + file.name)
        onAddFolder(file.path + file.name)
      }
      else {
        tree = deleteSourceFolder(filetree, file.path)
      }
      updateFiletree(tree)
    },
    [filetree, onAddFolder]
  )
}

