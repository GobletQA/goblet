import { TTaskParams, TEnvObject } from '../../types'

import { error } from '@keg-hub/cli-utils'
import { exists, noOpObj, ensureArr } from '@keg-hub/jsutils'


/**
 * Converts passed in params to in string format, into key-value pair of Envs
 */
export const getParamEnvs = ({ envs }:TTaskParams, sep:string=`:`):TEnvObject => {
  return !envs
    ? noOpObj as TEnvObject
    : (ensureArr(envs) as string[]).reduce((acc:TEnvObject, item:string) => {
        if(!item.includes(sep))
          error.throwError(`Missing key/value separator "${sep}" for env: ${item}`)

        const [key, val] = item.split(sep)

        exists(key)
          && exists(val)
          && (acc[key.trim()] = val.trim())

        return acc
      }, {} as TEnvObject)
}