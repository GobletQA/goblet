import fs from 'fs-extra'
import { limboify } from '@keg-hub/jsutils/limboify'

/**
 * Gets the metadata of a path from the local filesystem
 * @param filePath - full path to the folder or file i.e '/goblet/app/tests/bdd/features'
 *
 * @returns - Meta data containing {name, parent, type ( folder || file )} properties
 */
export const isFolder = async (filePath:string) => {
  const [_, stat] = await limboify(fs.stat, filePath)
  return stat.isDirectory()
}