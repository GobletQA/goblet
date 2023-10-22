import type { TGBWorldCfg, TRepoOpts, TFileModel } from '@types'

import { useCallback } from 'react'
import {getWorldLoc} from '@utils/repo/getWorldLoc'
import { useWorldSettings } from '@hooks/settings/useWorldSettings'
import {formatWorldFile} from '@utils/repo/formatWorldFile'

export type THOnWorldChange = {
  repo:TRepoOpts
  rootPrefix:string
  onSaveFile: (loc: string, content: string | null, ext?: Partial<TFileModel>) => Promise<void>
}

export const useOnWorldChange = (props:THOnWorldChange) => {
  const {
    repo,
    rootPrefix,
    onSaveFile
  } = props

  const {
    autoFormat,
    indentation
  } = useWorldSettings()

  return useCallback((props:TGBWorldCfg) => {
    const { world } = props
    const worldLoc = getWorldLoc(repo)
    const { error, content } = formatWorldFile({
      world,
      autoFormat,
      indentation
    })

    if(error){
      // TODO: add some kind of alert about invalid JSON formatting
      throw new Error(error.message)
    }

    onSaveFile(worldLoc, content, {
      content,
      ast:{world},
      ext: `json`,
      uuid: worldLoc,
      fileType: `json`,
      location: worldLoc,
      mime: `application/json`,
      name: worldLoc.split(`/`).pop(),
    }, false)

  }, [
    repo,
    onSaveFile,
    rootPrefix,
    autoFormat,
    indentation,
  ])
}