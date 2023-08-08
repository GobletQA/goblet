import './ensureGobletEnv'

import { EnvLoader } from './EnvLoader'
import { ENVS } from '@gobletqa/environment'
import { EFileType } from '@gobletqa/latent'

export const values = EnvLoader.load([
  `values.env`,
  ENVS.GOBLET_ENV && `values.${ENVS.GOBLET_ENV}.env`,
  ENVS.GOBLET_ENV && `${ENVS.GOBLET_ENV}.values.env`
].filter(Boolean), EFileType.values)
