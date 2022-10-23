import { useCallback } from 'react'
import { addSourceFile } from '../../utils/addSourceFile'

export type THAddFile = {
  filetree: Record<any, any>,
  updateFiletree: (...args:any[]) => any,
  onAddFile: (...args:any[]) => any,
}

export const useAddFile = (props:THAddFile) => {
  const {
    filetree,
    onAddFile,
    updateFiletree,
  } = props
  
  return useCallback(
    (path: string) => {
      updateFiletree(addSourceFile(filetree, path))
      onAddFile(path)
    },
    [filetree]
  )
}