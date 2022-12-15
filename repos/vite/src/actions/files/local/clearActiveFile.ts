import { getStore } from '@store'
import { filesDispatch } from '@store'

// TODO: allow for multiple active files somehow?

/**
 * Clears a currently set active fileModel
 */
export const clearActiveFile = (fileId?:string) => {
  // if(!fileId) return

  const { files } = getStore().getState()

  if(!files.activeFile || !files.activeFile.uuid) return

  filesDispatch.clearActiveFile()
}
