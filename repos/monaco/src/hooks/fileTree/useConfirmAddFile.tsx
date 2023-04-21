import { useCallback } from 'react'
import { addSourceFile } from '../../utils/addSourceFile'
import { deleteSourceFile } from '../../utils/deleteSourceFile'

export type THConfirmAddFile = {
  rootPrefix?: string
  filetree: Record<any, any>,
  updateFiletree: (...args:any[]) => any,
  onAddFile: (...args:any[]) => any,
}

export const useConfirmAddFile = (props:THConfirmAddFile) => {
  const {
    filetree,
    onAddFile,
    rootPrefix,
    updateFiletree,
  } = props
  
  return useCallback(
    (file: any) => {
      let tree: any = {}
      if (file.name) {
        tree = deleteSourceFile({
          filetree,
          rootPrefix,
          path: file.path,
        })
        tree = addSourceFile({
          rootPrefix,
          filetree: tree,
          path: file.path + file.name,
        })
        onAddFile({ location: file.path + file.name })
      }
      else {
        tree = deleteSourceFile({
          filetree,
          rootPrefix,
          path: file.path
        })
      }
      updateFiletree(tree)
    },
    [filetree, onAddFile]
  )
}