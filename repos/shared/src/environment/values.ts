import './ensureGobletEnv'

import { loadFiles } from './mapValues'
import { EFileType } from '@gobletqa/latent'
import { ENVS } from '@gobletqa/environment'


export const values = loadFiles([
  `values.env`,
  ENVS.GOBLET_ENV && `values.${ENVS.GOBLET_ENV}.env`,
  ENVS.GOBLET_ENV && `${ENVS.GOBLET_ENV}.values.env`
].filter(Boolean), EFileType.values)
