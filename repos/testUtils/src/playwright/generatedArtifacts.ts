import type { EBrowserName, ETestType } from '@GTU/Types'

import fs from 'fs'
import path from 'path'
import { get } from '@keg-hub/jsutils/get'
import { mkDir, removeFile } from '@GTU/Utils/fileSys'

export type TGetGenName = {
  location:string,
  timestamp?:string|number
  browserName?:EBrowserName
}

const nameCache = {}

/**
 * Formats the passed in location file name
 * Removes parent dirs, file extension and spaces in the file name
 * @param {string} location - File location that should have it's name formatted
 *
 */
const formatName = (location:string) => {
  return location.split(`/`)
    .pop()
    .split('.')
    .shift()
    .trim()
    .replace(/ /g, '-')
}

/**
 * Gets the name of the most recently run test *
 * @returns <Object> - Contains the short name and full generated path name
 */
export const getGeneratedName = (args:TGetGenName) => {

  const {
    location,
    browserName,
  } = args

  if(!location) throw new Error(`Could not resolve test path location`)

  const browser = browserName || get(global, `__goblet.browser.type`, 'browser')

  const name = formatName(location)

  // Use a cache name to ensure all generated artifacts use the same timestamp
  const cacheName = browser ? `${browser}-${name}` : name
  if(nameCache[cacheName]) return nameCache[cacheName]

  const timestamp = args.timestamp || new Date().getTime()
  const nameTimestamp = browser ? `${name}-${browser}-${timestamp}` : `${name}-${timestamp}`

  nameCache[cacheName] = {
    name,
    dir: name,
    nameTimestamp,
    testLoc: location,
    full: `${name}/${nameTimestamp}`,
  }

  return nameCache[cacheName]
}

/**
 * Moves an artifact from the temp save location to the location defined in the repo  config location
 * All artifacts are saved to a temp directory
 * Then copied to the repo directory based on configured settings - I.E. `only-on-fail`
 * @param {string} saveLoc - The location where the artifact should be saved to
 * @param {string} name - Name of the artifact file without extension
 * @param {string} currentLoc - Temp location where the artifact currently exists
 *
 */
export const copyArtifactToRepo = async (
  saveLoc:string,
  name:string,
  currentLoc:string
) => {
  const saveFull = name
    ? path.join(saveLoc, `${name}${path.extname(currentLoc)}`)
    : saveLoc

  // Ensure the folder path exists before the file copy
  await mkDir(path.dirname(saveFull))
  fs.copyFileSync(currentLoc, saveFull)

  const [rmErr] = await removeFile(currentLoc)
  if(rmErr) throw rmErr

  return saveFull
}

/**
 * Ensures a repo artifact sub-folder exists
 * @param {string} parentDir - Root artifact type folder location 
 * @param {string} [childDir] - Sub folder where an artifact relative to a test will be saved
 *
 * @returns <string> - Repo location folder where an artifact will be saved
 */
export const ensureRepoArtifactDir = async (
  parentDir:string,
  childDir?:string
) => {
  const saveDir = childDir ? path.join(parentDir, childDir) : parentDir
  const [mkErr] = await mkDir(saveDir)
  if(mkErr) throw mkErr

  return saveDir
}
