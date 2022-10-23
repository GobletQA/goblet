import { useCallback } from 'react'
import { editSourceFolderName } from '../../utils/editSourceFolderName'

export type THAddFolder = {
  filetree: Record<any, any>,
  updateFiletree: (...args:any[]) => any,
  onEditFolderName: (...args:any[]) => any,
}

export const useEditFolderName = (props:THAddFolder) => {
  const {
    filetree,
    updateFiletree,
    onEditFolderName,
  } = props
  
  return useCallback(
    (path: string, name: string) => {
      updateFiletree(editSourceFolderName(filetree, path, name))
      onEditFolderName(path, name)
    },
    [filetree, onEditFolderName]
  )
}