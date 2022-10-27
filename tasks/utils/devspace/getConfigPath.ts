import type { TTaskParams } from '../../types'

import path from 'path'
import { error } from '@keg-hub/cli-utils'
import { containerDir } from '../../paths'
import { loadEnvs } from '../envs/loadEnvs'
import { isStr, exists, isArr } from '@keg-hub/jsutils'
import { resolveLocalPath } from '../helpers/resolveLocalPath'
import { getContextValue, getLongContext } from '../helpers/contexts'

/**
 * Try to resolve the path to the devspace config from the passed in option param
 * If not found throws an error
 */
const resolveFromDSParam = (params:TTaskParams) => {
  const { env, devspace } = params
  const envs = loadEnvs({ env })

  !isStr(devspace)
    && error.throwError(`The devspace option ${devspace} is not a valid config path`)

  const lgCtx = getLongContext(devspace)

  // If no long context, then consider passed in devspace param a path
  if(!lgCtx) return resolveLocalPath(devspace)
  
  // Get the context value path from the long context
  const altConfig = getContextValue(lgCtx, envs, `DEVSPACE_CONFIG`)

  return !isStr(altConfig)
    ? error.throwError(`Could not find devspace config at path ${devspace}`)
    : resolveLocalPath(altConfig)
}

/**
 * Try to resolve the path to the devspace config from the passed in context
 * If not found, uses the default devspace config
 */
const resolveFromContext = (params:TTaskParams) => {
  const { env, context } = params
  if(!context) return path.join(containerDir, `devspace.yaml`)

  const envs = loadEnvs({ env })

  // For some tasks, context is an array, so we use the first context by default
  const devContext = isArr(context) ? context[0] : context
  const altConfig = getContextValue(devContext, envs, `DEVSPACE_CONFIG`)

  return exists(altConfig) && isStr(altConfig)
    ? resolveLocalPath(altConfig)
    : path.join(containerDir, `devspace.yaml`)
}

/**
 * Checks if a custom config location is passed in and returns it
 * Otherwise returns the default config location
 *
 * @returns {string} - Path to the resolved devspace config file
 */
export const getConfigPath = (params:TTaskParams) => {
  return params.devspace
    ? resolveFromDSParam(params)
    : resolveFromContext(params)
}
