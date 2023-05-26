import type { TFilesState } from '@types'

import { getStore } from '@store'
import { addRootToLoc } from '@utils/repo/addRootToLoc'
import { addFeaturePrefixToLoc } from '@utils/features/addFeaturePrefixToLoc'

export const getFileModel = (loc:string, files?:TFilesState) => {
  files = files || getStore().getState().files

  return files?.files[loc]
    || files?.files[addRootToLoc(loc)]
    || files?.files[addFeaturePrefixToLoc(loc)]
}