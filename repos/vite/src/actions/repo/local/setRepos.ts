import type { TAPIReposResp } from '@types'
import { reposDispatch } from '@reducers'

export const setRepos = ({ repos }:TAPIReposResp) => {
  repos
    && repos.length
    && reposDispatch.setRepos(repos)
}