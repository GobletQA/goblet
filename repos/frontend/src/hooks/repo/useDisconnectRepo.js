import { useCallback } from 'react'
import { Values } from 'GBConstants'
import { addToast } from 'GBActions/toasts'
import { checkCall } from '@keg-hub/jsutils'
import { setActiveModal } from 'GBActions/modals'
import { useSelector } from 'GBHooks/useSelector'
import { removeRepo } from 'GBActions/repo/local/removeRepo'
import { disconnectRepo } from 'GBActions/repo/api/disconnect'

const { STORAGE, MODAL_TYPES } = Values

/**
 * Calls disconnectRepo action, then calls a callback if it exists
 * @param {function} callback - Called after the repo has been disconnected
 *
 * @returns {function} - function to call to disconnect a repo
 */
export const useDisconnectRepo = callback => {
  const {user} = useSelector(STORAGE.USER)

  return useCallback(
    async evt => {
      if (!user || !user.username) {
        addToast({
          type: 'error',
          message: `Can not disconnect repo. An active user does not exit`,
        })
        await removeRepo()
        setActiveModal(MODAL_TYPES.SIGN_IN)

        return await checkCall(callback, evt)
      }

      await disconnectRepo(user.username)
      await checkCall(callback, evt)
    },
    [user && user.username, callback]
  )
}
