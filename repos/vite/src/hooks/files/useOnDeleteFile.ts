import type { TFileTree } from '@types'

import { useCallback } from 'react'
import { addRootToLoc } from '@utils/repo/addRootToLoc'
import { removeFile } from '@actions/files/api/removeFile'

export const useOnDeleteFile = (files:TFileTree, rootPrefix:string) => {
  return useCallback(async (loc:string) => {
    if(!loc) console.warn(`Can not delete file, missing file location`)

    const fullLoc = addRootToLoc(loc, rootPrefix)
    const fileModel = files[fullLoc]
    await removeFile(fileModel || { name: loc, location: fullLoc })

  }, [files, rootPrefix])
}