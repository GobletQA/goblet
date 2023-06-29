import os from 'os'
import path from 'path'
import { promises } from 'fs'
import {TBrowserContext} from '@gobletqa/shared/types'

const tempDir = os.tmpdir()
export const defaultCookieFile = 'browser-cookie-state'
export const defaultStorageFile = 'browser-storage-state'


/**
 * Gets the storage location from the temp-directory
 */
export const browserCookieLoc = (saveLocation?:string) => {
  const location = `${(saveLocation || defaultCookieFile).split(`.json`).shift()}.json`

  return path.join(tempDir, location)
}


/**
 * Gets the storage location from the temp-directory
 */
export const contextStorageLoc = (saveLocation?:string) => {
  const location = `${(saveLocation || defaultStorageFile).split(`.json`).shift()}.json`

  return path.join(tempDir, location)
}

/**
 * Save storage state into the file.
 */
export const saveContextCookie = async (context:TBrowserContext, location?:string) => {
  const cookies = await context.cookies()
  const saveLoc = browserCookieLoc(location)
  await promises.writeFile(saveLoc, JSON.stringify(cookies))

  return true
}

export const setContextCookie = async (context:TBrowserContext, location?:string) => {
  const loadLoc = browserCookieLoc(location)
  // TODO: Investigate if this should throw or not
  // If instead we want to return false because the cookie could not be set
  // Then uncomment this code
  // const [err] = await limbo(promises.access(loadLoc, constants.F_OK))
  // if(err) return false

  const cookie = await promises.readFile(loadLoc, 'utf8')
  await context.addCookies(JSON.parse(cookie))
  context.__goblet = context.__goblet || {}
  context.__goblet.cookie = loadLoc

  return true
}


export const saveContextStorageState = async (
  context:TBrowserContext,
  location?:string
) => {
  const saveLoc = contextStorageLoc(location)
  return await context.storageState({ path: saveLoc })
}

