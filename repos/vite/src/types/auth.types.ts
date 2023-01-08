export type TAuthUserRaw = {
  uid: string
  email: string
  photoUrl?:string
  displayName: string
}

export type TAuthProfile = {
  repos_url: string
  avatar_url?:string
}

export type TAuthAdditionalUserInfo = {
  profile: TAuthProfile
  screenName: string
  photoUrl?:string
}

export type TAuthCredential = {
  accessToken: string
  providerId: string
}

export type TAuthData = {
  user: TAuthUserRaw
  credential: TAuthCredential
  additionalUserInfo: TAuthAdditionalUserInfo
}

export type TFormattedUser = {
  id: string
  email: string
  token: string
  photoUrl?:string
  username: string
  provider: string
  reposUrl: string
  displayName:string
}