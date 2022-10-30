import type { TItem } from '../../types'

import { useCallback } from 'react'
import { deleteSourceFolder } from '../../utils/deleteSourceFolder'

export type THAbortAddFolder = {
  rootPrefix?: string
  filetree: Record<any, any>,
  updateFiletree: (...args:any[]) => any,
}

export const useAbortAddFolder = (props:THAbortAddFolder) => {
  const {
    filetree,
    rootPrefix,
    updateFiletree,
  } = props
  
  return useCallback(
    (child: TItem) => {
      updateFiletree(deleteSourceFolder({ filetree, path:child.path, rootPrefix }))
    },
    [filetree]
  )
}