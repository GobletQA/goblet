// TODO: update this to load repo specific ENV values
// Will not be considered secure
// ADD encryption to and from here
import './ensureGobletEnv'
import { mapValues } from './mapValues'
import { loadEnvFile } from './loadEnvFile'
import { deepFreeze } from '@keg-hub/jsutils'
import { getReplaceOnlyEmpty } from './getReplaceOnlyEmpty'

const { GOBLET_ENV } = process.env

let values = mapValues({
  existing: {},
  values: loadEnvFile({ file: `values.env` }),
})

if(GOBLET_ENV)
  values = mapValues({
    existing: values,
    values: loadEnvFile({ file: `values.${GOBLET_ENV}.env` }),
  })

/**
 * Add values from the current process
 * Only add ENVs where the keys already exist in the values object ( i.e. addNew )
 */
values = mapValues({
  existing: values,
  values: process.env,
  opts: {
    addNew: false,
    replaceOnlyEmpty: getReplaceOnlyEmpty(values.GOBLET_REPLACE_ONLY_EMPTY),
  },
})

const frozen = deepFreeze(values)

export {
  frozen as values
}