import { filesDispatch } from '@reducers'

/**
 * Clears all pendingFiles
 */
export const clearPendingFiles = () => {
  filesDispatch.clearPending()
}
