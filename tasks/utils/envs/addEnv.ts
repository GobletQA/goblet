import type { TEnvObject } from '../../types'
import { exists } from '@keg-hub/jsutils'

/**
 * Adds an env's value to the envs object when checkVal exists
 */
 export const addEnv = (
  envs:TEnvObject,
  key:string,
  checkVal:any,
  useVal:any=checkVal
) => {
  exists(checkVal) && (envs[key] = useVal)

  return envs
}
