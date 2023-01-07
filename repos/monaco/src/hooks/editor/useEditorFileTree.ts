import type { TFilelist, TFileCallback } from '@GBM/types'

import { useState, useCallback } from 'react'
import { useAddFile } from '@GBM/hooks/fileTree/useAddFile'
import { generateFileTree } from '@GBM/utils/generateFileTree'

export type THEditorFileTree = {
  rootPrefix:string
  addFile:TFileCallback
  defaultFiles:TFilelist
}

/**
 * TODO - This should call the useFileTree hook
 * And more the useAddFile hook call to that hook
 *
 * Right now useAddFile hooks is called separately from all other file methods
 * So if we call this hook from the useEditorFileTree
 * Then they could all be in the same place
 * But then we'll have to pass all these props down to the FileTree Component
 */
export const useEditorFileTree = (props:THEditorFileTree) => {
  const {
    addFile,
    rootPrefix,
    defaultFiles
  } = props
  
  const [filetree, setFiletree] = useState(() => generateFileTree(defaultFiles))
  const onAddFile = useAddFile({
    filetree,
    rootPrefix,
    onAddFile:addFile,
    updateFiletree: setFiletree,
  })

  const onAddEmptyFile = useCallback(() => onAddFile?.(`/`), [onAddFile])

  return {
    filetree,
    onAddFile,
    setFiletree,
    onAddEmptyFile
  }
}