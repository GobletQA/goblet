import type { TEditorAddFile, TFolderItem } from '@GBM/types'

import { useCallback } from 'react'
import { addSourceFile } from '../../utils/addSourceFile'

export type THAddFile = {
  rootPrefix?: string
  filetree: TFolderItem,
  onAddFile: TEditorAddFile
  updateFiletree: (fileTree:TFolderItem) => any
}

export const useAddFile = (props:THAddFile) => {
  const {
    filetree,
    onAddFile,
    rootPrefix,
    updateFiletree,
  } = props
  
  return useCallback(
    (path: string) => {
      updateFiletree(addSourceFile({
        path,
        filetree,
        rootPrefix,
      }))
      onAddFile(path)
    },
    [filetree]
  )
}