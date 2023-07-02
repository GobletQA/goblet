// TODO: update this to load repo specific ENV values
// Will not be considered secure
// ADD encryption to and from here
import './ensureGobletEnv'
import { mapValues } from './mapValues'
import { loadEnvFile } from './loadEnvFile'
import { EFileType } from '@gobletqa/latent'
import { deepFreeze } from '@keg-hub/jsutils'

const { GOBLET_ENV } = process.env

let values = mapValues({
  existing: {},
  values: loadEnvFile({ file: `values.env`, type: EFileType.values }),
})

if(GOBLET_ENV)
  values = mapValues({
    existing: values,
    values: loadEnvFile({ file: `values.${GOBLET_ENV}.env`, type: EFileType.values }),
  })

const frozen = deepFreeze(values)

export {
  frozen as values
}