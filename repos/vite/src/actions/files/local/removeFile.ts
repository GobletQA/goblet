import type { TFileModel } from '@types'
import { filesDispatch } from '@store'
import { isObj } from '@keg-hub/jsutils'

export const removeFile = (node:string|TFileModel) => {
  const loc = isObj<TFileModel>(node) ? node.uuid : node
  filesDispatch.removeFile(loc)
}