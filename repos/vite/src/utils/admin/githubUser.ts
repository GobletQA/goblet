import type {
  TFormattedUser,
  TGithubUserRaw,
  TGithubAuthUser,
  TGithubAuthCredential,
  TAuthAdditionalUserInfo,
} from '@types'

import { EProvider } from '@types'
import { pickKeys } from '@keg-hub/jsutils'

const fineUserAvatarUrl = (data:TGithubUserRaw) => {
  return data.user?.photoURL
    || data?.additionalUserInfo?.photoUrl
    || data?.additionalUserInfo?.profile?.avatar_url
}

/**
 * Formats the response from the git provider sign in
 * Builds a user object from the provided data
 */
export const githubUser = (data:TGithubUserRaw):TFormattedUser => {
  const { uid, email, displayName } = pickKeys<TGithubAuthUser>(data.user, [
    'uid',
    'email',
    'displayName',
  ])

  const { screenName:username, profile } = pickKeys<TAuthAdditionalUserInfo>(data.additionalUserInfo, [
    'profile',
    'screenName',
  ])


  const { providerId, accessToken } = pickKeys<TGithubAuthCredential>(data.credential, [
    'accessToken',
    'providerId',
  ])
  
  const photoUrl = fineUserAvatarUrl(data)

  return {
    email,
    id: uid,
    photoUrl,
    displayName,
    username: username,
    token: accessToken,
    provider: EProvider.Github,
    reposUrl: profile.repos_url,
  } as TFormattedUser
}
