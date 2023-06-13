import type { TEnvObject } from '../../types'

import { getContextValue } from '../helpers/contexts'


/**
 * Looks for a custom IMAGE_FROM value based on the context or custom context env
 * @param {string} docFileCtx - Context of the Dockerfile to use
 * @param {Object} allEnvs - All loaded envs for the app
 * @param {string} from - Value passed to the from option from the cmd line
 *
 * @returns {void}
 */
export const resolveImgFrom = (
  docFileCtx:string,
  allEnvs:TEnvObject,
  from?:string,
  imageName?:string
) => {
  // If from option is set, then set the IMAGE_FROM value
  // Which will override the default IMAGE_FROM in the Dockerfile
  // If it includes a : assume a image and tag, otherwise assume from is a tag
  return from
    ? from.includes(':')
        ? from
        : `${imageName}:${from}`
    : getContextValue(docFileCtx, allEnvs, `IMAGE_FROM`, allEnvs.GB_IMAGE_FROM)
}
