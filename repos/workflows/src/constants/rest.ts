
const { deepFreeze } = require('@keg-hub/jsutils')

const {
  GITLAB_API_URL=`gitlab.com`,
  GITHUB_API_URL=`api.github.com`
} = process.env

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