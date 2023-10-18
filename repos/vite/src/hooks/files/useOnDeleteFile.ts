import type { TFileTree } from '@types'

import { useCallback } from 'react'
import { localStorage } from '@services/localStorage'
import { addRootToLoc } from '@utils/repo/addRootToLoc'
import { removeFile } from '@actions/files/api/removeFile'

export const useOnDeleteFile = (files:TFileTree, rootPrefix:string) => {
  return useCallback(async (loc:string, isFolder?:boolean) => {
    if(!loc) return console.warn(`Can not delete file, missing file location`)

    const fullLoc = addRootToLoc(loc, rootPrefix)
    const fileModel = files[fullLoc]

    localStorage.removeLastOpened(fullLoc, isFolder)
    await removeFile(fileModel || { name: loc, location: fullLoc })

  }, [files, rootPrefix])
}
