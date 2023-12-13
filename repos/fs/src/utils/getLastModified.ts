import fs from 'fs'
import { limboify } from '@keg-hub/jsutils/limboify'


/**
 * **IMPORTANT** - exported only for tests, not for other methods to use
 * Gets the meta data for a file or folder based on the passed in filePath
 * @function
 * @param {string} fromPath - Path to get the content from
 *
 * @returns {Promise|Object} - Meta data of the passed in path
 */
export const getLastModified = async (filePath:string) => {
  const [__, metaData] = await limboify(
    fs.stat,
    filePath
  )

  // Return the mtimeMs (POSIX Epoch in milliseconds)
  // Either from the files stats, or current time
  return metaData ? metaData.mtimeMs : Date.now()
}
