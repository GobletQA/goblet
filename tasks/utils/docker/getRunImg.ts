import type { TTaskParams, TEnvObject } from '../../types'

import { error } from '@keg-hub/cli-utils'
import { getTagOptions } from './getTagOptions'
import { resolveImgName } from './resolveImgName'


/**
 * Finds the correct image to run based on passed in params
 */
export const getRunImg = async (
  params:TTaskParams,
  docFileCtx:string,
  envs:TEnvObject
) => {
  let tag = params?.image?.includes(':')
    ? params?.image?.split(':').pop()
    : (await getTagOptions(params, docFileCtx, envs))?.[params?.tag] || params?.tag

  const image = resolveImgName(params, docFileCtx, envs)

  return image
    ? `${image}:${tag}`
    : error.throwError(`Count not resolve image to run`, params, docFileCtx, envs)
}
