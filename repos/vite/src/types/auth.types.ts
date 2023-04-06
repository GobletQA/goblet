import type { User as TGitlabUserRaw } from "oidc-react"
import type {
  User as TGithubAuthUser,
  OAuthCredential as TGithubAuthCredential,
  } from 'firebase/auth'

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
  photoUrl?:string
  username: string
  provider: string
  reposUrl: string
  displayName:string
}

export type TRawAuthUser = TGithubUserRaw | TGitlabUserRaw

export enum EAuthType {
  github=`github`,
  gitlab=`gitlab`
}

export {
  TGitlabUserRaw,
  TGithubAuthUser,
  TGithubAuthCredential
}