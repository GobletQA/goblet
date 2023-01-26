import type { TEnvObject } from '../../types'

import {
  reduceObj,
  isArr,
  noPropArr,
  noOpObj,
} from '@keg-hub/jsutils'


export const asBuildArgArr = (
  key:string,
  value?:string,
  buildArgArr?:string[],
  filters?:string[]
) => {
  filters = isArr(filters) ? filters : noPropArr
  buildArgArr = buildArgArr || []

  !filters.includes(key) &&
    value &&
    buildArgArr.push(`--build-arg`, `${key}=${value}`)

  return buildArgArr
}

export const toBuildArgsArr = (
  envs:TEnvObject = noOpObj as TEnvObject,
  filters:string[] = noPropArr,
  buildArr:string[] = []
) => {
  const built = reduceObj(
    envs,
    (key, value, buildArr) => asBuildArgArr(key, value, buildArr, filters),
    buildArr
  )
  return built
}
