import { deepFreeze } from '@keg-hub/jsutils'
import { GITLAB_API_URL, GITHUB_API_URL } from '@gobletqa/environment/constants'


export const Rest = deepFreeze({
  Github: {
    Url: GITHUB_API_URL,
    AuthHeader: { Ref: `token`, Key: `Authorization` },
    Headers: {
      Accept: `application/vnd.github+json`
    }
  },
  Gitlab: {
    Url: GITLAB_API_URL,
    AuthHeader: { Ref: `Bearer`, Key: `Authorization` },
    Headers: {}
  }
})
