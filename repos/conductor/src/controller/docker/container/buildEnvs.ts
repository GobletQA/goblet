import type { TImgConfig } from '@gobletqa/shared/types'

import { get } from '@keg-hub/jsutils/get'
import { exists } from '@keg-hub/jsutils/exists'
import { flatUnion } from '@keg-hub/jsutils/flatUnion'

/**
 * Builds runtime envs, setting envs values from the passed in data
 */
export const buildRuntimeEnvs = (image:TImgConfig, data?:Record<any,any>):string[] => {

  return image?.container?.runtimeEnvs
    ? Object.entries(image?.container?.runtimeEnvs)
      .reduce((acc, [name, value]) => {
        const found = get(data, value)

        exists(found) && acc.push(`${name}=${found}`)

        return acc
      }, [])
    : []
}

/**
 * Loops over an env object and converts the key/value pairs into an array of joined strings
 */
const loopEnvObj = (envObj:Record<string,string|number|boolean>, existingEnvs:string[]=[]):string[] => {
  return envObj
    ? Object.entries(envObj)
      .reduce((acc, [name, value]) => {
        exists(value) && acc.push(`${name}=${value}`)

        return acc
      }, existingEnvs)
    : existingEnvs
}

/**
 * Builds envs for a container in the format needed for the docker-api
 */
export const buildContainerEnvs = (
  image:TImgConfig,
  data?:Record<any,any>,
  defEnvs?:Record<string,string>
):string[] => {

  const builtEnvs = loopEnvObj(defEnvs)
  const envs = loopEnvObj(image?.container?.envs, builtEnvs)
  const imgEnvs = buildRuntimeEnvs(image, data)

  return flatUnion(envs, imgEnvs)
}