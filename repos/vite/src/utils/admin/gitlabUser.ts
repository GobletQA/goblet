import {
  TGitlabUserRaw,
  TFormattedUser
} from '@types'


export const gitlabUser = (rawUser:TGitlabUserRaw) => {
  const {
    profile,
    id_token,
    access_token,
    refresh_token
  } = rawUser
  const {
    iss,
    name,
    email,
    picture,
    preferred_username,
  } = profile
  
  return {
    email,
    id: id_token,
    provider: iss,
    photoUrl: picture,
    token: access_token,
    reposUrl: `${iss}/projects`,
    refresh_token: refresh_token,
    username: preferred_username || name,
    displayName: name || preferred_username || email,
  } as TFormattedUser
  
}