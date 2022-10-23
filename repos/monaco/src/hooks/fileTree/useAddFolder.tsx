import { useCallback } from 'react'
import { addSourceFolder } from '../../utils/addSourceFolder'

export type THAddFolder = {
  filetree: Record<any, any>,
  updateFiletree: (...args:any[]) => any,
  onAddFolder: (...args:any[]) => any,
}

export const useAddFolder = (props:THAddFolder) => {
  const {
    filetree,
    onAddFolder,
    updateFiletree,
  } = props
  
  return useCallback(
    (path: string) => {
      updateFiletree(addSourceFolder(filetree, path))
      onAddFolder(path)
    },
    [filetree]
  )
}