import { useCallback } from 'react'
import { editSourceFileName } from '../../utils/editSourceFileName'

export type THEditFile = {
  Modal: any
  rootEl: any
  filetree: Record<any, any>,
  updateFiletree: (...args:any[]) => any,
  onEditFileName: (...args:any[]) => any,
}

export const useEditFileName = (props:THEditFile) => {
  const {
    filetree,
    onEditFileName,
    updateFiletree,
  } = props
  
  return useCallback(
    (path: string, name: string) => {
      updateFiletree(editSourceFileName(filetree, path, name))
      onEditFileName(path, name)
    },
    [filetree, onEditFileName]
  )

}