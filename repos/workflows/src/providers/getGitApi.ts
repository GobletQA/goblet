import { EProvider } from '@GWF/types'
import { GitlabApi } from '@GWF/providers/gitlabApi'
import { GithubApi } from '@GWF/providers/githubApi'

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