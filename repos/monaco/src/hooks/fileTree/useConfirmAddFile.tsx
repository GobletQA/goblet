import { useCallback } from 'react'
import { addSourceFile } from '../../utils/addSourceFile'
import { deleteSourceFile } from '../../utils/deleteSourceFile'

export type THConfirmAddFile = {
  filetree: Record<any, any>,
  updateFiletree: (...args:any[]) => any,
  onAddFile: (...args:any[]) => any,
}

export const useConfirmAddFile = (props:THConfirmAddFile) => {
  const {
    filetree,
    onAddFile,
    updateFiletree,
  } = props
  
  return useCallback(
    (file: any) => {
      let tree: any = {}
      if (file.name) {
        tree = deleteSourceFile(filetree, file.path)
        tree = addSourceFile(tree, file.path + file.name)
        onAddFile(file.path + file.name)
      }
      else {
        tree = deleteSourceFile(filetree, file.path)
      }
      updateFiletree(tree)
    },
    [filetree, onAddFile]
  )
}