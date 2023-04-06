import type {
  TRawAuthUser,
  TFormattedUser,
  TGithubUserRaw,
  TGitlabUserRaw,
} from '@types'

import { EAuthType } from '@types'
import { githubUser } from '@utils/admin/githubUser'
import { gitlabUser } from '@utils/admin/gitlabUser'
import { isAllowedUser } from '@utils/admin/isAllowedUser'

export const formatUser = async (
  authData:TRawAuthUser,
  type:EAuthType
):Promise<TFormattedUser|void> => {
  let user:TFormattedUser

  switch(type){
    case EAuthType.github: {
      user = githubUser(authData as TGithubUserRaw)
    }
    case EAuthType.gitlab: {
      user = gitlabUser(authData as TGitlabUserRaw)
    }
  }

  await isAllowedUser(user?.email, Boolean(!user?.email))

  return user
}