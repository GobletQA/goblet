import { EProvider } from '@gobletqa/workflows/types'
import { GitlabApi } from '@gobletqa/workflows/providers/gitlabApi'
import { GithubApi } from '@gobletqa/workflows/providers/githubApi'

export type TGetGitApi = {
  provider:EProvider
}

export const getGitApi = ({ provider }:TGetGitApi) => {
  switch(provider){
    case EProvider.Gitlab:
      return GitlabApi
    case EProvider.Github:
      return GithubApi
    default:
      throw new Error(`Unknown provider type: ${provider}`)
  }
}