import type { TRepoOpts, TFileModel } from '@types'
import type { TWorldConfig } from '@ltipton/parkin'

import { useMemo, useCallback } from 'react'
import { addRootToLoc } from '@utils/repo/addRootToLoc'

export type THOnWorldChange = {
  repo:TRepoOpts
  rootPrefix:string
  onSaveFile: (loc: string, content: string | null, ext?: Partial<TFileModel>) => Promise<void>
}

const useWorldLoc = (props:THOnWorldChange) => {
  const {
    repo
  } = props

  return useMemo(() => {
    const worldFile = repo?.paths?.world || `world.json`
    return addRootToLoc(`/${worldFile.replace(/^\//, ``)}`)
  }, [repo?.paths?.world])
}

export const useOnWorldChange = (props:THOnWorldChange) => {
  const {
    repo,
    rootPrefix,
    onSaveFile
  } = props
  
  const worldLoc = useWorldLoc(props)

  return useCallback((props:TWorldConfig) => {
    const { world } = props
    const worldStr = JSON.stringify(world)
    
    onSaveFile(worldLoc, worldStr, {
      ast:{world},
      ext: `json`,
      uuid: worldLoc,
      fileType: `json`,
      content: worldStr,
      location: worldLoc,
      mime: `application/json`,
      name: worldLoc.split(`/`).pop(),
    })

  }, [
    repo,
    worldLoc,
    onSaveFile,
    rootPrefix,
  ])
}