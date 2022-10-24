import { useCallback } from 'react'
import { addSourceFolder } from '../../utils/addSourceFolder'

export type THAddFolder = {
  rootPrefix?: string
  filetree: Record<any, any>,
  updateFiletree: (...args:any[]) => any,
  onAddFolder: (...args:any[]) => any,
}

export const useAddFolder = (props:THAddFolder) => {
  const {
    filetree,
    rootPrefix,
    onAddFolder,
    updateFiletree,
  } = props
  
  return useCallback(
    (path: string) => {
      updateFiletree(addSourceFolder({ filetree, path, rootPrefix }))
      onAddFolder(path)
    },
    [filetree]
  )
}