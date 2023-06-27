import './ensureGobletEnv'
import { values } from './values'
import { mapValues } from './mapValues'
import { EFileType } from '@gobletqa/latent'
import { loadEnvFile } from './loadEnvFile'
import { deepFreeze } from '@keg-hub/jsutils'
import { getReplaceOnlyEmpty } from './getReplaceOnlyEmpty'

const { GOBLET_ENV } = process.env

const loadSecrets = (existing:Record<string, any>, file:string) => {
  return mapValues({
    existing,
    values: loadEnvFile({ file, type: EFileType.secrets }),
  })
}

let secrets =  loadSecrets({}, `secrets.env`)

if(GOBLET_ENV)
  secrets = loadSecrets(
    loadSecrets(secrets, `secrets.${GOBLET_ENV}.env`),
    `${GOBLET_ENV}.secrets.env`
  )

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