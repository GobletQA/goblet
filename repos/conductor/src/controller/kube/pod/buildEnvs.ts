import type { V1EnvVar, V1EnvFromSource } from '@kubernetes/client-node'
import type { TPodContainer, TEnvRefConfig, TEnvFrom } from '../../../types'

import { addIfExists } from './helpers'
import { isStr, isObj, isNum, exists, noOpObj } from '@keg-hub/jsutils'

const buildEnvRefObj = (
  item:string|TEnvRefConfig,
  name?:string
) => {
  return isStr(item)
    ? { name: item || name, optional: true }
    : isObj(item)
      ? { name, optional: true, ...item }
      : { name, optional: true }
}

export const buildEnvsFrom = (
  container:TPodContainer,
  opts:any
):V1EnvFromSource[] => {
  return Object.entries(container.envFrom || noOpObj)
    .map(([name, fromObj]) => {
      const {
        secret,
        secretRef,
        configMap,
        prefix=``,
        configMapRef,
      } = (fromObj || {} as TEnvFrom)
      const hidden = secretRef || secret
      const config = configMapRef || configMap

      if(!prefix && !hidden && !config) return undefined

      const envFrom:V1EnvFromSource = {}

      addIfExists(envFrom, `prefix`, prefix)
      addIfExists(envFrom, `configMapRef`, config ? buildEnvRefObj(config, name) : undefined)
      addIfExists(envFrom, `secretRef`, hidden ? buildEnvRefObj(hidden, name) : undefined)

      return envFrom
    }).filter(Boolean)
}

export const buildEnvs = (
  container:TPodContainer,
  opts:any
):V1EnvVar[] => {
  return Object.entries(container.envs || noOpObj).map(([name, value]:[string, any]) => {
    return !exists(value)
      ? undefined
      : {
          name,
          value: isStr(value) || isNum(value) ? `${value}` : JSON.stringify(value),
          // --- TODO: investigate at some point, if it's ever needed
          // 'valueFrom'?: V1EnvVarSource;
        }
  }).filter(Boolean)
}