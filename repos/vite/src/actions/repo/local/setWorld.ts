import type { TGBWorldCfg, TFileModel } from '@types'

import { repoDispatch, getStore } from '@store'
import { localStorage } from '@services/localStorage'

export const setWorld = async (worldFile:TFileModel) => {
  const world = worldFile?.ast?.world as TGBWorldCfg
  if(!world)
    return console.warn(`[ERROR] Can not setWorld, the world object is missing`, worldFile)

  const repo = getStore()?.getState().repo
  const update = {...repo, world}

  await localStorage.setRepo(update)
  repoDispatch.setRepo(update)
}