import './ensureGobletEnv'

import { EnvLoader } from './EnvLoader'
import { EFileType } from '@gobletqa/latent'
import { ENVS } from '@gobletqa/environment'

export const secrets = EnvLoader.load([
  `secrets.env`,
  ENVS.GOBLET_ENV && `secrets.${ENVS.GOBLET_ENV}.env`,
  ENVS.GOBLET_ENV && `${ENVS.GOBLET_ENV}.secrets.env`
].filter(Boolean), EFileType.secrets)

