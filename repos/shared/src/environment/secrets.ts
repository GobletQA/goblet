import './ensureGobletEnv'

import { loadFiles } from './mapValues'
import { EFileType } from '@gobletqa/latent'
import { ENVS } from '@gobletqa/environment'
import { injectUnsafe } from '@GSH/utils/safeReplacer'


export const secrets = loadFiles([
  `secrets.env`,
  ENVS.GOBLET_ENV && `secrets.${ENVS.GOBLET_ENV}.env`,
  ENVS.GOBLET_ENV && `${ENVS.GOBLET_ENV}.secrets.env`
].filter(Boolean), EFileType.secrets)

// Inject both the secrets keys and values into the safe replaces
// This is to ensure they are not leaked to the logs
injectUnsafe(Object.keys(secrets))
injectUnsafe(Object.values(secrets))
