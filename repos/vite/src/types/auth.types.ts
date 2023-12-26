import type { User as TGitlabUserRaw } from "oidc-react"
import type {
  User as TGithubAuthUser,
  OAuthCredential as TGithubAuthCredential,
  } from 'firebase/auth'

// import type {
//   Models
// } from 'appwrite'


// export type TAWUserRaw = {
//   user: Models.User<any>
//   session: Models.Session
// }

export type TAWUserRaw = {
  user: any
  session: any
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

export type TGithubUserRaw = {
  user: TGithubAuthUser
  credential: TGithubAuthCredential
  additionalUserInfo: TAuthAdditionalUserInfo
}

export type TFormattedUser = {
  id: string
  email: string
  token: string
  expire?:string
  photoUrl?:string
  username: string
  provider: string
  displayName:string
}

export type TRawAuthUser = TGithubUserRaw | TGitlabUserRaw | TAWUserRaw

export enum EAuthType {
  github=`github`,
  gitlab=`gitlab`,
  awGithub=`awGithub`
}

export {
  TGitlabUserRaw,
  TGithubAuthUser,
  TGithubAuthCredential
}