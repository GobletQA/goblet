import type {
  TRepoState,
  TFilesState,
} from '@types'

import { useCallback } from 'react'
import { addRootToLoc } from '@utils/repo/addRootToLoc'
import { createFile } from '@actions/files/api/createFile'

export const useOnAddFile = (repoFiles:TFilesState, rootPrefix:string, repo:TRepoState) => {
  return useCallback(async (loc:string, isFolder?:boolean) => {
    if(!loc) console.warn(`Can not add file, missing file location`)
    
    const ext = loc.split(`.`).pop()

    const fileType = isFolder
      ? `folder`
      : Object.values(repo.fileTypes).find(typeObj => typeObj.ext === ext) || `file`

    const fullLoc = addRootToLoc(loc, rootPrefix)

    await createFile(fileType, fullLoc, isFolder)
  }, [repoFiles, rootPrefix, repo.fileTypes])
}
