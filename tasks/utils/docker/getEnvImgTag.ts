import type { TTaskParams, TEnvObject } from '../../types'

import { loadEnvs } from '../envs/loadEnvs'
import { noOpObj } from '@keg-hub/jsutils'
import { error } from '@keg-hub/cli-utils'
import { getContextValue } from '../helpers/contexts'

/**
 * Gets tag of an image set in the value file for the env
 */
export const getEnvImgTag = async (
  params:TTaskParams = noOpObj as TTaskParams,
  docFileCtx:string = ``,
  envs:TEnvObject
) => {
  envs = envs || loadEnvs({ env: params.env })
  const imgTag = getContextValue(docFileCtx, envs, `IMAGE_TAG`, envs.IMAGE_TAG)

  return imgTag || error.throwError(`Could not find image tag for context "${docFileCtx}"`)
}

