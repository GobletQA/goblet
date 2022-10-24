import { useCallback } from 'react'
import { addSourceFolder } from '../../utils/addSourceFolder'
import { deleteSourceFolder } from '../../utils/deleteSourceFolder'

export type THConfirmAddFolder = {
  rootPrefix?: string
  filetree: Record<any, any>,
  updateFiletree: (...args:any[]) => any,
  onAddFolder: (...args:any[]) => any,
}

export const useConfirmAddFolder = (props:THConfirmAddFolder) => {
  const {
    filetree,
    rootPrefix,
    onAddFolder,
    updateFiletree,
  } = props
  
  return useCallback(
    (file: any) => {
      let tree: any = {}
      if (file.name) {
        tree = deleteSourceFolder({ filetree, path: file.path, rootPrefix })
        tree = addSourceFolder({
          filetree: tree,
          path: file.path + file.name,
          rootPrefix
        })
        onAddFolder(file.path + file.name)
      }
      else {
        tree = deleteSourceFolder({ filetree, path: file.path, rootPrefix })
      }
      updateFiletree(tree)
    },
    [filetree, onAddFolder]
  )
}

