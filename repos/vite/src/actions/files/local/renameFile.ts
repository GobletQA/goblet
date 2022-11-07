import type { TFileModel } from '@types'

import { getStore, filesDispatch } from '@store'
import { getRootPrefix } from '@utils/repo/getRootPrefix'


const buildModel = (newLoc:string) => {
  const { repo } = getStore().getState()
  const prefix = getRootPrefix(repo)
  
  return {
    uuid: newLoc,
    location: newLoc,
    ext: newLoc.split(`.`).pop(),
    name: newLoc.split(`/`).pop(),
    relative: newLoc.split(prefix).pop(),
  }
}

export const renameFile = (
  oldLoc:string,
  newLoc:string,
  file?:TFileModel
) => {
  const model = file || buildModel(newLoc)
  filesDispatch.renameFile({ oldLoc, newLoc, file:model, merge: !Boolean(file) })
}