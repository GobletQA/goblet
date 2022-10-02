import { TUserState } from '@reducers'
import { userDispatch } from '@store'

import { noOpObj } from '@keg-hub/jsutils'

/**
 * Clears the user from the redux store
 *
 */
export const clearUser = () => {
  userDispatch.clear(noOpObj as TUserState)
}
