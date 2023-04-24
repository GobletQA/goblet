import type { TFileModel } from '@types'
import type { TWorldConfig } from '@ltipton/parkin'

import { repoDispatch, getStore } from '@store'
import { localStorage } from '@services/localStorage'

export const setWorld = async (worldFile:TFileModel) => {
  const world = worldFile?.ast?.world as TWorldConfig
  if(!world)
    return console.warn(`[ERROR] Can not setWorld, the world object is missing`, worldFile)

  const repo = getStore()?.getState().repo
  const update = {...repo, world}

  await localStorage.setRepo(update)
  repoDispatch.setRepo(update)
}