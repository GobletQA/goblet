import type { TEnvObject } from '../../types'
import { isArr, noOpObj } from '@keg-hub/jsutils'

/**
 * Converts an array for key/values into an object
 */
export const formatParamEnvs = (envs:string[]) => {
  return isArr(envs) &&
    envs.reduce((acc, env) => {
      const [key, val] = env.split(`=`) as [string, string]
      key && val && (acc[key.trim()] = val.trim())

      return acc
    }, {} as TEnvObject) || noOpObj as TEnvObject
}
