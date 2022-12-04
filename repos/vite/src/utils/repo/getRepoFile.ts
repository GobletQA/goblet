import type { TFilesState } from '@types'

import { getStore } from '@store'

export const getRepoFile = (loc:string, files?:TFilesState) => {
  files = files || getStore().getState().files
  return files?.files?.[loc]
}
