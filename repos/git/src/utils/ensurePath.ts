import { limbo } from '@keg-hub/jsutils/limbo'
import { mkdir } from 'node:fs/promises'

/**
 * Ensures a path exists on the host machine
 * @throws
 * @function
 * @param {string} location - Path to ensure exists
 *
 * @returns {boolean} - True if the path exists
 */
export const ensurePath = async (location:string) => {
  const [mkErr, success] = await limbo(mkdir(location, { recursive: false }))
  if (mkErr) throw mkErr

  return true
}

