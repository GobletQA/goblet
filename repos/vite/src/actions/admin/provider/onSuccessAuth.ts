import type { TRawAuthUser } from '@types'

import { authApi } from '@services/authApi'
import { toNum } from '@keg-hub/jsutils'
import { EAuthType, EContainerState } from '@types'
import { signOutAuthUser } from './signOutAuthUser'
import { formatUser } from '@utils/admin/formatUser'
import { Exception } from '@gobletqa/shared/exceptions/Exception'
import { waitForRunning } from '@actions/container/api/waitForRunning'
import { setContainerRoutes } from '@actions/container/local/setContainerRoutes'

/**
 * Called when a user is authorized to access Goblet-Admin
 * If they are a new user, it creates a new user and account
 * On each sign in, it also saves the users auth token, which can be used for accessing the git provider
 * Then loads the Dashboard root
 */
export const onSuccessAuth = async (
  authData:TRawAuthUser,
  type:EAuthType,
  appwriteCheck?:boolean
) => {
  let statusCodeNum

  try {
    const userData = await formatUser(authData, type)
    if(!userData)
      throw new Exception(`[Auth State Error] Could not authenticate user. Invalid user format`, 401)

    const status = await authApi.validate(userData)

    status?.meta?.state === EContainerState.Creating
      && waitForRunning()

    // Wrap container and repos so if they throw, the login auth is still valid
    try {
      await setContainerRoutes(status)
    }
    catch(err:any){
      if(appwriteCheck) return [err as Error]

      console.warn(`[Auth State Error] Error setting Container or Repos status.`)
      console.error(err.message)
    }
  }
  catch (err:any) {
    if(appwriteCheck) return [err as Error]

    toNum(err.status || err.statusCode) === 401
      && await signOutAuthUser()
  }

  return []
}
