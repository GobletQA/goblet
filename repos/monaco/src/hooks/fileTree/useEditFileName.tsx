import { useCallback } from 'react'
import { editSourceFileName } from '../../utils/editSourceFileName'

export type THEditFile = {
  Modal: any
  rootEl: any
  rootPrefix?: string
  filetree: Record<any, any>,
  updateFiletree: (...args:any[]) => any,
  onEditFileName: (...args:any[]) => any,
}

export const useEditFileName = (props:THEditFile) => {
  const {
    filetree,
    rootPrefix,
    onEditFileName,
    updateFiletree,
  } = props
  
  return useCallback(
    (path: string, name: string) => {
      updateFiletree(editSourceFileName({
        path,
        name,
        filetree,
        rootPrefix
      }))
      onEditFileName(path, name)
    },
    [filetree, onEditFileName]
  )

}