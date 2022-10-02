import { userDispatch } from '@store'
import { addToast } from '@actions/toasts'


/**
 * Creates a user in the store
 *
 */
export const upsertUser = async (user:any) => {
  if (!user)
    return addToast({
      type: 'error',
      message: `Can not add user to store. User does not exist`,
    })

  userDispatch.upsert({
    id: user.id,
    email: user.email,
    username: user.username,
    provider: user.provider,
    displayName: user.displayName,
  })
}
