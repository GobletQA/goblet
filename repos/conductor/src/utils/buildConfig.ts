import type { TConductorOpts, TConductorConfig } from '@gobletqa/shared/types'

import { exists } from '@keg-hub/jsutils/exists'
import { deepMerge } from '@keg-hub/jsutils/deepMerge'
import { isEmptyColl } from '@keg-hub/jsutils/isEmptyColl'
import { conductorConfig } from '@GCD/configs/conductor.config'


type TPartialConf = Record<any, any>

const loopEnsure = (mergedConfig:TPartialConf, config:TPartialConf) => {
  let tracker = config
  return Array.isArray(mergedConfig)
    ? mergedConfig
    : Object.entries(mergedConfig)
      .reduce((acc, [key, value]) => {
        acc[key] = exists(value) ? value : tracker?.[key]

        if(key === 'options' && isEmptyColl(acc[key]))
          acc[key] = {socketPath: '/var/run/docker.sock'}

        else if(key !== 'images' && typeof acc[key] === 'object'){
          tracker = tracker?.[key]
          acc[key] = loopEnsure(acc[key], tracker)
        }

        return acc
      }, {}) as TPartialConf
}

export const buildConfig = (inConfig:TConductorOpts):TConductorConfig => {
  const mergedConfig = deepMerge(conductorConfig, inConfig) as TConductorConfig
  return loopEnsure(mergedConfig, conductorConfig)  as TConductorConfig
}