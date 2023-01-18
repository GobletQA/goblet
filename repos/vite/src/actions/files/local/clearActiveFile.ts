import { getStore } from '@store'
import { filesDispatch } from '@store'

/**
 * Clears a currently set active fileModel
 */
export const clearActiveFile = () => {
  filesDispatch.clearActiveFile()
}
