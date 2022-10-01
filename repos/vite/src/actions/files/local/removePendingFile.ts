import { TFileModel } from '@types'
import { filesDispatch } from '@reducers'

/**
 * Removes the key item from pendingFiles store
 */
export const removePendingFile = (activeFile:TFileModel) => {
  filesDispatch.removePending(activeFile.location)
}
