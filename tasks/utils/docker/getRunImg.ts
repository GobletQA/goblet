import { error } from '@keg-hub/cli-utils'
import { getTagOptions } from '../docker/getTagOptions'
import { resolveImgName } from '../docker/resolveImgName'


/**
 * Finds the correct image to run based on passed in params
 * @param {Object} params - Parsed options passed to the run task
 * @param {string} docFileCtx - Current context of the docker image to run
 * @param {Object} envs - ENV values loaded from the container/value.yml files
 *
 * @returns {string} - Image to use when running the container
 */
export const getRunImg = async (params, docFileCtx, envs) => {
  let tag = params?.image?.includes(':')
    ? params?.image?.split(':').pop()
    : (await getTagOptions(params, docFileCtx, envs))?.[params?.tag] || params?.tag

  const image = resolveImgName(params, docFileCtx, envs)

  return image
    ? `${image}:${tag}`
    : error.throwError(`Count not resolve image to run`, params, docFileCtx, envs)
}
