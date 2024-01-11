import { userDispatch } from '@store'
import { addToast } from '@actions/toasts'
import { cleanColl } from '@keg-hub/jsutils/cleanColl'


/**
 * Creates a user in the store
 *
 */
export const upsertUser = async (user:any) => {
  if (!user)
    return addToast({
      type: `error`,
      message: `Can not add user to store. User does not exist`,
    })

  userDispatch.upsertUser(cleanColl({
    id: user.id,
    email: user.email,
    hasPAT: user.hasPAT,
    photoUrl: user.photoUrl,
    username: user.username,
    provider: user.provider,
    displayName: user.displayName,
  }))
}
