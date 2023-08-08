import type { TGenEnv } from "../types"

import { asBool } from "../utils/asBool"

const repo = (general:TGenEnv) => {
  const {
    GB_REPO_NO_SECRETS,
    GOBLET_CONFIG_BASE,
    GB_GIT_REPO_REMOTE,
    GB_GIT_REMOTE_REF=`goblet-ref`
  } = process.env

  return {
    GB_GIT_REMOTE_REF,
    GOBLET_CONFIG_BASE,
    GB_GIT_REPO_REMOTE,
    GB_REPO_NO_SECRETS: asBool(GB_REPO_NO_SECRETS, { default: false })
  }
}

export default repo

