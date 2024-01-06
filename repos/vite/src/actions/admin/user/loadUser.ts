// import { EAuthType } from '@types'
// import { checkUrl } from '@services/appwrite/checkUrl'

import { authApi } from '@services/authApi'
import { GitUser } from '@services/gitUser'

/**
 * First tries to load the locally stored user
 * Then checks the url for the auth param, and tries to log the user in
 */
export const loadUser = async () => {
  // Returns a new instance of the GitUser class
  // And auto-sets the user into the redux store
  const user = await GitUser.loadUser()
  if(!user){
    // ---- Keep this for Appwrite integration ----- //
    // return await checkUrl()
    return { user }
  }

  const status = await authApi.validate(user)
  return { user, status }

}