import type {
  TFileTree,
  TFileTypes,
  TRepoState,
} from '@types'

import { useCallback } from 'react'
import { emptyObj } from '@keg-hub/jsutils/emptyObj'
import { addRootToLoc } from '@utils/repo/addRootToLoc'
import { createFile } from '@actions/files/api/createFile'

export type TAddFileCBProps = {
  location:string
  content?:string
  isFolder?:boolean
}

export const useOnAddFile = (
  files:TFileTree,
  rootPrefix:string,
  repo:TRepoState
) => {

  return useCallback(async (props:TAddFileCBProps) => {

    const {
      content,
      isFolder,
      location:loc,
    } = props

    if(!loc) return console.warn(`Can not add file, missing file location`)
    
    const ext = loc.split(`.`).pop()

    const fileType = isFolder
      ? `folder`
      : Object.values((repo.fileTypes || emptyObj) as TFileTypes)
          .find((typeObj) => typeObj.ext === ext)
            || `file`

    const fullLoc = addRootToLoc(loc, rootPrefix)

    await createFile({
      content,
      isFolder,
      fileType,
      fileName: fullLoc,
    })
  }, [files, rootPrefix, repo.fileTypes])
}
