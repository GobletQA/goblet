import type { TRawAuthUser } from '@types'

import { authApi } from '@services/authApi'
import { toNum } from '@keg-hub/jsutils'
import { EAuthType, EContainerState } from '@types'
import { signOutAuthUser } from './signOutAuthUser'
import { formatUser } from '@utils/admin/formatUser'
import { Exception } from '@services/sharedService'
import { waitForRunning } from '@actions/container/api/waitForRunning'
import { setContainerRoutes } from '@actions/container/local/setContainerRoutes'

/**
 * Removes a custom claim from Oauth user
 */
export const removeAuthClaim = async (token:string) => {

  console.log(`------- TODO -------`)
}
