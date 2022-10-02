import { filesDispatch } from '@store'

/**
 * Clears all pendingFiles
 */
export const clearPendingFiles = () => {
  filesDispatch.clearPending()
}
