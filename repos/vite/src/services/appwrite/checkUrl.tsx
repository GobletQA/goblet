import { EAuthType } from '@types'

// import { account } from '@services/appwrite'
import { emptyObj, exists } from '@keg-hub/jsutils'
import { onSuccessAuth } from '@actions/admin/provider/onSuccessAuth'
import { 
  getQueryData,
  updateUrlQuery,
  removeFromQuery
} from '@utils/url'

import {
  GB_APPWRITE_AUTH_PARAM,
  GB_APPWRITE_AUTH_SUCCESS,
  GB_APPWRITE_AUTH_PENDING,
} from '@constants/appwrite'

/**
 * Attempts to get the user and session from the appwrite account
 */
const getUserData = async ():Promise<Record<string, any>> => {
  return emptyObj

  // try {
  //   const user = await account.get()
  //   if(!user) return emptyObj

  //   const session = await account.getSession(`current`)
  //   if(!session) return emptyObj

  //   return { user, session }
  // }
  // catch(err){
  //   return emptyObj
  // }
}

/**
 * Checks the urls query params for the current auth state
 * Then uses that to authenticate the user
 */
export const checkUrl = async () => {
  const data = getQueryData()
  const authState = data[GB_APPWRITE_AUTH_PARAM]

  // If there's an auth state, it must be a success to continue
  if(exists(authState) && authState !== GB_APPWRITE_AUTH_SUCCESS) return

  try {

    // // Try to get the user and session
    // const { user, session } = await getUserData()

    // /**
    //  * If there's no user or session,
    //  * then set the state to pending and return
    //  * This happens when we are not authorized to check for a user
    //  * Because they have not tried to log in yet
    //  * But we also need to track that we have already done this check
    //  * So we update the use with a pending state, and return
    //  * That way future calls will never get here due to the auth state check above
    //  */
    // if(!user || !session){
    //   updateUrlQuery({ [GB_APPWRITE_AUTH_PARAM]: GB_APPWRITE_AUTH_PENDING }, true)
    //   return undefined
    // }

    // /**
    //  * If we have a user and session, then log them in
    //  */
    // const [error] = await onSuccessAuth({ user, session }, EAuthType.awGithub, true)
    // if(error) return console.error(error.message)
   
    // /**
    //  * Clean up the auth state param
    //  */
    // removeFromQuery([GB_APPWRITE_AUTH_PARAM])

  }
  catch(err){}
}
