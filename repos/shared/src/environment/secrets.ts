import './ensureGobletEnv'
import { values } from './values'
import { mapValues } from './mapValues'
import { EFileType } from '@gobletqa/latent'
import { loadEnvFile } from './loadEnvFile'
import { deepFreeze, toBool } from '@keg-hub/jsutils'


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

const frozen = deepFreeze(secrets)

export { frozen as secrets }