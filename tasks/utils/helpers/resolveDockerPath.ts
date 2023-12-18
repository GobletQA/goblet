import type { TEnvObject } from '../../types'

import path from 'path'
import { getContextValue } from '../helpers/contexts'

/**
 * Converts the local part of a volume string to an absolute path when needed
 * @param {string} vol - The volume string to check
 *
 * @returns {string} - Updated volume string
 */
export const resolveDockerPath = (location:string, docFileCtx:string, envs:TEnvObject) => {
  const rootLoc = getContextValue(docFileCtx, envs, `MOUNT_PATH`, envs.GB_APP_MOUNT_PATH)

  return location.startsWith(`~`)
    ? path.resolve(path.join(`$HOME`, location.replace(`~`, '')))
    : location === `.`
      ? rootLoc
      : location.startsWith(`./`)
        ? path.resolve(path.join(`${rootLoc}/`, location.replace(`./`, ``)))
        : location.startsWith(`/`)
          ? location
          : path.resolve(path.join(rootLoc, location))
}
