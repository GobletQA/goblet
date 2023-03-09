import type { THEditorFiles } from '@types'

import { useCallback } from 'react'
import { loadFile } from '@actions/files/api/loadFile'
import { addRootToLoc } from '@utils/repo/addRootToLoc'

export type THOnLoadFile = THEditorFiles & {
  rootPrefix:string
  files: Record<string, string|null>
}

export const useOnLoadFile = ({
  rootPrefix,
  repoFiles,
}:THOnLoadFile) => {

  return useCallback(async (path:string) => {
    const full = addRootToLoc(path, rootPrefix)
    const existing = repoFiles?.files?.[full]?.content
    if(existing) return existing

    // The loadFile action will also update repoFiles.files
    // So we don't need to worry about it here
    const loaded = await loadFile(full)

    return loaded ? loaded?.content : null
  }, [
    rootPrefix,
    repoFiles
  ])
}