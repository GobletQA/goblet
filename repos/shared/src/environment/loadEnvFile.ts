

import path from 'path'
import { execSync } from 'child_process'
import { Latent } from '@gobletqa/latent'
import { getGobletConfig } from '../goblet/getGobletConfig'
import { getPathFromConfig } from '../utils/getPathFromConfig'

const { GB_GIT_REMOTE_REF=`goblet-ref` } = process.env

const latent = new Latent()

type TLoadEnvFile = {
  file?:string
  error?:boolean
  location?:string
}

const getGitRemote = (repoRoot:string) => {
  return execSync(`git config --get remote.${GB_GIT_REMOTE_REF}.url`, { cwd: repoRoot })
    .toString()
    .trim()
}

export const loadEnvFile = ({
  file,
  location,
  error=false,
}: TLoadEnvFile):Record<string, any> => {

  const config = getGobletConfig()
  const { repoRoot } = config.paths

  const environmentsDir = getPathFromConfig(`environmentsDir`, config)
  const loc = location || path.join(environmentsDir, file)

  const token = latent.getToken(getGitRemote(repoRoot))

  const loaded = latent.secrets.load({
    token,
    location: loc,
  })

  return loaded
}
