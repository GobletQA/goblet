// import { EAuthType } from '@types'

import { GitUser } from '@services/gitUser'
// import { checkUrl } from '@services/appwrite/checkUrl'


/**
 * First tries to load the locally stored user
 * Then checks the url for the auth param, and tries to log the user in
 */
export const loadUser = async () => {
  return await GitUser.loadUser()

  // const user = await GitUser.loadUser()
  // if(user) return user

  // return await checkUrl()
}