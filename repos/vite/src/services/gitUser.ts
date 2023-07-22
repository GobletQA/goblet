import type { TUserState } from "@types"
import { localStorage } from '@services/localStorage'
import { clearUser } from '@actions/admin/user/clearUser'
import { upsertUser } from '@actions/admin/user/upsertUser'


/**
 *
 * TODO: Add code to create session cookie with the backend
 * So user data is stored on the backend via http cookie
 * Then load the user data on this end
 *
 */

/**
 * We only want / allow one user signed in at a time
 * So store the current user here as a singleton
 */
let __CURRENT_USER:GitUser | undefined

export class GitUser {
  
  /**
   * Helper to get the currently signed in git user
   */
  static getUser = () => {
    return __CURRENT_USER
  }

  /**
   * Helper to load the git user from local storage, and create a git user class instance
   */
  static loadUser = async () => {
    if (__CURRENT_USER) return __CURRENT_USER

    const parsedUser = await localStorage.getUser()
    __CURRENT_USER = parsedUser && new GitUser(parsedUser)

    return __CURRENT_USER
  }

  /**
   * Helper to sign out the globally signed in git user
   */
  static signOut = async () => {
    __CURRENT_USER = undefined
    clearUser()
    await localStorage.removeUser()
  }


  id?:string
  username?:string
  provider?: string

  constructor(data:TUserState) {
    if (__CURRENT_USER) return __CURRENT_USER

    // Ensure is a valid git user before storing the metadata
    if(!data.username || !data.id || !data.provider){
      console.error(`Invalid git user information. Please sign in again`)
      console.log(`GitUser - constructor`, data)
      GitUser.signOut()
      return this
    }

    Object.assign(this, data)
    __CURRENT_USER = this

    // Auto set the user in the redux store for easy access
    upsertUser(__CURRENT_USER)

    return __CURRENT_USER
  }
}
