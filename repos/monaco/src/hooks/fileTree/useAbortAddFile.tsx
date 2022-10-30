import type { TItem } from '../../types'

import { useCallback } from 'react'
import { deleteSourceFile } from '../../utils/deleteSourceFile'

export type THAbortAddFile = {
  rootPrefix?: string
  filetree: Record<any, any>,
  updateFiletree: (...args:any[]) => any,
}

export const useAbortAddFile = (props:THAbortAddFile) => {
  const {
    filetree,
    rootPrefix,
    updateFiletree,
  } = props
  
  return useCallback(
    (child: TItem) => {
      updateFiletree(deleteSourceFile({
        filetree,
        rootPrefix,
        path: child.path,
      }))
    },
    [filetree]
  )
}