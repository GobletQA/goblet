import os from 'os'

/**
 * TODO: Update jsutils/node to include this helper
 * Remove this once getOS helper is moved to jsutils
 */

/**
 * Gets and normalizes the current operating system
 */
export const getOS = () => {
  const system = (process.platform || os.platform()).toLowerCase()
  return system === 'darwin'
    ? 'mac'
    : system === 'win32' || system === 'win64'
      ? 'win'
      : system === 'linux'
        ? 'lin'
        : false
}
