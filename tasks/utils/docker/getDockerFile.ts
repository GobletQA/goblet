import path from 'path'
import { containerDir } from '../../paths'
import { getContext } from '../helpers/contexts'

/**
 * Gets the Dockerfile to use based on the passed in docFileCtx
 */
export const getDockerFile = (docFileCtx:string) => {
  // Edge case handling for app because Dockerfile has no postfix
  const postFix = getContext(docFileCtx)?.long === `app` ? `` : docFileCtx

  return [
    `-f`,
    path.join(containerDir, postFix ? `Dockerfile.${postFix}` : `Dockerfile`),
  ]
}
