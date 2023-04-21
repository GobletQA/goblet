import { useCallback } from 'react'
import { addSourceFile } from '../../utils/addSourceFile'

export type THAddFile = {
  rootPrefix?: string
  filetree: Record<any, any>,
  updateFiletree: (...args:any[]) => any,
  onAddFile: (...args:any[]) => any,
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
      onAddFile({ location: path })
    },
    [filetree]
  )
}