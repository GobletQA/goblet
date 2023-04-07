
const { deepFreeze } = require('@keg-hub/jsutils')

const {
  GITLAB_API_URL=`gitlab.com`,
  GITHUB_API_URL=`api.github.com`
} = process.env

export const Rest = deepFreeze({
  Github: {
    Url: GITHUB_API_URL,
  },
  Gitlab: {
    Url: GITLAB_API_URL,
  }
})