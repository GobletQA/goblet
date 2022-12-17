import path from 'path'
import { homeDir, appRoot } from '../../paths'

/**
 * Converts the local part of a volume string to an absolute path when needed
 * @param {string} vol - The volume string to check
 *
 * @returns {string} - Updated volume string
 */
export const resolveLocalPath = (location:string) => {
  return location.startsWith(`~`)
    ? path.resolve(path.join(homeDir, location.replace(`~`, '')))
    : location === `.`
      ? appRoot
      : location.startsWith(`./`)
        ? path.resolve(path.join(`${appRoot}/`, location.replace(`./`, ``)))
        : path.resolve(path.join(appRoot, location))
}
