// TODO: update this to load repo specific secrets
// Should be considered secure - Still figuring out what that looks like
// Need to add git encryption to secrets files

import './ensureGobletEnv'
import { values } from './values'
import { mapValues } from './mapValues'
import { loadEnvFile } from './loadEnvFile'
import { deepFreeze } from '@keg-hub/jsutils'
import { getReplaceOnlyEmpty } from './getReplaceOnlyEmpty'

const { GOBLET_ENV } = process.env

let secrets =  mapValues({
  existing: {},
  values: loadEnvFile({ file: `secrets.env` }),
})

if(GOBLET_ENV)
  secrets = mapValues({
    existing: secrets,
    values: loadEnvFile({ file: `secrets.${GOBLET_ENV}.env` }),
  })

/**
 * Add secrets from the current process
 * Only add ENVs where the keys already exist in the secrets object ( i.e. addNew )
 */
secrets = mapValues({
  existing: secrets,
  values: process.env,
  opts: {
    addNew: false,
    replaceOnlyEmpty: getReplaceOnlyEmpty(values.GOBLET_REPLACE_ONLY_EMPTY),
  },
})

const frozen = deepFreeze(secrets)

export { frozen as secrets }