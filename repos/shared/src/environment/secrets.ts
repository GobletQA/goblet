import './ensureGobletEnv'

import { loadFiles } from './mapValues'
import { EFileType } from '@gobletqa/latent'

const { GOBLET_ENV } = process.env

export const secrets = loadFiles([
  `secrets.env`,
  GOBLET_ENV && `secrets.${GOBLET_ENV}.env`,
  GOBLET_ENV && `${GOBLET_ENV}.secrets.env`
].filter(Boolean), EFileType.secrets)
