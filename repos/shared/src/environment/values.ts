// TODO: update this to load repo specific ENV values
// Will not be considered secure
// ADD encryption to and from here

import path from 'path'
import { camelCase, noOpObj } from '@keg-hub/jsutils'
import { loadEnvSync } from '@keg-hub/parse-config'
import { getPathFromConfig } from '../utils/getPathFromConfig'

const { NODE_ENV } = process.env
if(!process.env.GOBLET_ENV && NODE_ENV !== `test`) process.env.GOBLET_ENV = NODE_ENV
const { GOBLET_ENV } = process.env


const environmentsDir = getPathFromConfig(`environmentsDir`)
const valuesEnvs = {
  ...loadEnvSync({
    error: false,
    location: path.join(environmentsDir, `values.env`)
  }),
  ...(
    GOBLET_ENV
      ? loadEnvSync({
          error: false,
          location: path.join(environmentsDir, `values.${GOBLET_ENV}.env`)
        })
      : noOpObj
  )
}

export const values = Object.entries({...valuesEnvs, ...process.env})
  .reduce((acc, [key, value]) => {
    acc[key] = value
    acc[camelCase(key)] = value

    return acc
  }, {} as Record<string, any>)