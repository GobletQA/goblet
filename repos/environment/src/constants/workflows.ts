import path from 'path'

// TODO: move these to envs
const { GOBLET_MOUNT_ROOT=`/goblet/repos` } = process.env
const { GB_SH_LOCAL_MOUNT=`goblet-local` } = process.env
const { GB_SECRETS_TAG_REF=`goblet-do-not-delete` } = process.env
const { GB_GIT_GLOBAL_IGNORE=`/goblet/.gitignore` } = process.env

/**
 * Constants for running the workflows with consistent values
 * @readonly
 */
export const REPO_TAG_REF = GB_SECRETS_TAG_REF 
export const MOUNT_ROOT = path.resolve(GOBLET_MOUNT_ROOT)
export const LOCAL_MOUNT = path.join(MOUNT_ROOT, GB_SH_LOCAL_MOUNT)
export const GIT_GLOBAL_IGNORE = path.resolve(GB_GIT_GLOBAL_IGNORE)

export const GIT_RESET_BRANCH = `goblet-sync-revert-branch`

// TODO: move these to envs
const {
  GITLAB_API_URL=`gitlab.com`,
  GITHUB_API_URL=`api.github.com`,
  GITLAB_GRAPH_URL=`https://gitlab.com/api/graphql`,
  GITHUB_GRAPH_URL=`https://api.github.com/graphql`
} = process.env


export {
  GITLAB_API_URL,
  GITHUB_API_URL,
  GITHUB_GRAPH_URL,
  GITLAB_GRAPH_URL
}