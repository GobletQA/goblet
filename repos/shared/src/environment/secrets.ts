import './ensureGobletEnv'

import { loadFiles } from './mapValues'
import { EFileType } from '@gobletqa/latent'
import { injectUnsafe } from '@GSH/utils/safeReplacer'

const { GOBLET_ENV } = process.env

export const secrets = loadFiles([
  `secrets.env`,
  GOBLET_ENV && `secrets.${GOBLET_ENV}.env`,
  GOBLET_ENV && `${GOBLET_ENV}.secrets.env`
].filter(Boolean), EFileType.secrets)

// Inject both the secrets keys and values into the safe replaces
// This is to ensure they are not leaked to the logs
injectUnsafe(Object.keys(secrets))
injectUnsafe(Object.values(secrets))
