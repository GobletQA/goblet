import { ENVS } from '@gobletqa/environment'
import { deepFreeze } from '@keg-hub/jsutils/deepFreeze'

export const Rest = deepFreeze({
  Github: {
    Url: ENVS.GITHUB_API_URL,
    AuthHeader: { Ref: `token`, Key: `Authorization` },
    Headers: {
      Accept: `application/vnd.github+json`
    }
  },
  Gitlab: {
    Url: ENVS.GITLAB_API_URL,
    AuthHeader: { Ref: `Bearer`, Key: `Authorization` },
    Headers: {}
  }
})
