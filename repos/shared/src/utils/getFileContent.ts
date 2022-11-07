import { fileSys } from '@keg-hub/cli-utils'

const { pathExists, readFile } = fileSys

/**
 * Gets the text content of a file from the passed in location
 * If the file does not exist, it returns undefined
 *
 * @param location - Path to the file to be loaded
 *
 * @returns - Loaded text content of the file found at the passed in location
 */
export const getFileContent = async (location:string) => {
  const [err, exists] = await pathExists(location)
  if (!exists || err) return undefined

  const [__, content] = await readFile(location)
  return content
}
