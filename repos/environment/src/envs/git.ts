import type { TGenEnv } from "@GENV/types"

const {
  GITLAB_API_URL=`gitlab.com`,
  GITHUB_API_URL=`api.github.com`,
  GITLAB_GRAPH_URL=`https://gitlab.com/api/graphql`,
  GITHUB_GRAPH_URL=`https://api.github.com/graphql`,

  GOBLET_MOUNT_ROOT=`/goblet/repos`,
  GB_SH_LOCAL_MOUNT=`goblet-local`,
  GB_SECRETS_TAG_REF=`goblet-do-not-delete`,
  GB_GIT_GLOBAL_IGNORE=`/goblet/.gitignore`,
} = process.env


const git = (general:TGenEnv) => {

  return {
    GITLAB_API_URL,
    GITHUB_API_URL,
    GITHUB_GRAPH_URL,
    GITLAB_GRAPH_URL,

    GOBLET_MOUNT_ROOT,
    GB_SH_LOCAL_MOUNT,
    GB_SECRETS_TAG_REF,
    GB_GIT_GLOBAL_IGNORE,
  }
}

export default git
