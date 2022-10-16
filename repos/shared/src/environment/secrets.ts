// TODO: update this to load repo specific secrets
// Should be considered secure - Still figuring out what that looks like
import path from 'path'
import { camelCase, exists, noOpObj } from '@keg-hub/jsutils'
import { loadEnvSync } from '@keg-hub/parse-config'
import { getPathFromConfig } from '../utils/getPathFromConfig'

const { NODE_ENV } = process.env
if(!process.env.GOBLET_ENV && NODE_ENV !== `test`) process.env.GOBLET_ENV = NODE_ENV
const { GOBLET_ENV } = process.env

const environmentsDir = getPathFromConfig(`environmentsDir`)
const secretsEnvs = {
  ...loadEnvSync({
    error: false,
    location: path.join(environmentsDir, `secrets.env`)
  }),
  ...(
    GOBLET_ENV
      ? loadEnvSync({
          error: false,
          location: path.join(environmentsDir, `secrets.${GOBLET_ENV}.env`)
        })
      : noOpObj
  )
}

export const secrets = Object.entries(secretsEnvs)
  .reduce((acc, [key, value]) => {
    const val = (!exists(value) || value === ``) && process.env[key]
      ? process.env[key]
      : value

    acc[key] = val
    acc[camelCase(key)] = val

    return acc
  }, { ...secretsEnvs } as Record<string, any>)