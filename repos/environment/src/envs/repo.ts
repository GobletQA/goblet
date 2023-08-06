import type { TGenEnv } from "@GENV/types"
import {toBool} from "@keg-hub/jsutils"

const {
  GOBLET_CONFIG_BASE,
  GB_GIT_MOUNTED_REMOTE,
  GB_GIT_REMOTE_REF=`goblet-ref`
} = process.env

const GB_REPO_NO_SECRETS = toBool(process.env.GB_REPO_NO_SECRETS || 0)

const repo = (general:TGenEnv) => {
  return {
    GB_GIT_REMOTE_REF,
    GOBLET_CONFIG_BASE,
    GB_REPO_NO_SECRETS,
    GB_GIT_MOUNTED_REMOTE,
  }
}

export default repo


