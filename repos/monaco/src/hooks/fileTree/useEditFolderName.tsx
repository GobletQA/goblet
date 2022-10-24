import { useCallback } from 'react'
import { editSourceFolderName } from '../../utils/editSourceFolderName'

export type THAddFolder = {
  rootPrefix?: string
  filetree: Record<any, any>,
  updateFiletree: (...args:any[]) => any,
  onEditFolderName: (...args:any[]) => any,
}

export const useEditFolderName = (props:THAddFolder) => {
  const {
    filetree,
    rootPrefix,
    updateFiletree,
    onEditFolderName,
  } = props
  
  return useCallback(
    (path: string, name: string) => {
      updateFiletree(editSourceFolderName({
        name,
        path,
        filetree,
        rootPrefix
      }))
      onEditFolderName(path, name)
    },
    [filetree, onEditFolderName]
  )
}