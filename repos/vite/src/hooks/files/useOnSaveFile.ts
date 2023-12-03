import type { TFileTree, TFileModel } from '@types'

import { useCallback } from 'react'
import { emptyObj } from '@keg-hub/jsutils'
import {getWorldLoc} from '@utils/repo/getWorldLoc'
import { saveFile } from '@actions/files/api/saveFile'
import { addRootToLoc } from '@utils/repo/addRootToLoc'
import {formatWorldFile} from '@utils/repo/formatWorldFile'
import { useWorldSettings } from '@hooks/settings/useWorldSettings'


export const useOnSaveFile = (
  files:TFileTree,
  rootPrefix:string
) => {

  const {
    autoFormat,
    indentation
  } = useWorldSettings()

  return useCallback(async (
    loc:string,
    content:string|null,
    ext:Partial<TFileModel>= emptyObj as Partial<TFileModel>,
    checkWorld:boolean=true
  ) => {
    if(content === null)
      return console.warn(`[File Save Error]: Can not save file with null content`)

    if(!loc)
      return console.warn(`[File Save Error]: Can not save file, missing file location`)

    const fullLoc = addRootToLoc(loc, rootPrefix)
    const fileModel = files[fullLoc]

    if(fileModel?.gobletFile)
      return console.warn(`[File Save Error]: Can not save a goblet definition file at ${fullLoc}`)

    const hasInlineModel = Boolean(ext.location && ext.content && ext.fileType)

    if(!fileModel && !hasInlineModel)
      return console.warn(`[File Save Error]: Can not save file. Missing file model at ${fullLoc}`)

    if(checkWorld){
      const worldLoc = getWorldLoc()

      if(fullLoc === worldLoc && fileModel?.ext === `json`){
        const resp = formatWorldFile({
          world: JSON.parse(content),
          autoFormat,
          indentation
        })

        // TODO: add some kind of alert about invalid JSON formatting
        if(resp.error)
          return console.warn(resp.error.message)
        else content = resp.content
      }
    }

    await saveFile({
      ...(fileModel as TFileModel),
      ...ext,
      content
    })

  }, [
    files,
    rootPrefix,
    autoFormat,
    indentation
  ])
}
