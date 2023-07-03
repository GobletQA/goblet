import './ensureGobletEnv'

import { loadFiles } from './mapValues'
import { EFileType } from '@gobletqa/latent'

const { GOBLET_ENV } = process.env

export const values = loadFiles([
  `values.env`,
  GOBLET_ENV && `values.${GOBLET_ENV}.env`,
  GOBLET_ENV && `${GOBLET_ENV}.values.env`
].filter(Boolean), EFileType.values)
