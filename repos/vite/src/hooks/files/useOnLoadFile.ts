import type { TFileTree } from '@types'

import { useCallback } from 'react'
import { loadFile } from '@actions/files/api/loadFile'
import { addRootToLoc } from '@utils/repo/addRootToLoc'

export const useOnLoadFile = (files:TFileTree, rootPrefix:string) => {

  return useCallback(async (path:string) => {
    const full = addRootToLoc(path, rootPrefix)
    const existing = files?.[full]?.content
    if(existing) return existing

    // The loadFile action will also update files
    // So we don't need to worry about it here
    const loaded = await loadFile(full)

    return loaded ? loaded?.content : null
  }, [
    rootPrefix,
    files
  ])
}