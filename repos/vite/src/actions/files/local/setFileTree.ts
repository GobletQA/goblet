import type { TFileTree } from '@types'
import { filesDispatch } from '@store'

export const setFileTree = (fileTree:TFileTree) => {
  filesDispatch.upsertFiles(fileTree)
}
