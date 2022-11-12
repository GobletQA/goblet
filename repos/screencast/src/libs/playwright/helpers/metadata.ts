import type { TBrowserMetaData, TBrowserConf } from '@GSC/types'

import os from 'os'
import path from 'path'
import { fileSys, Logger } from '@keg-hub/cli-utils'
import { checkVncEnv } from '../../utils/vncActiveEnv'
import { getGobletConfig } from '@gobletqa/shared/utils/getGobletConfig'
import { isStr, isObj, exists, noOpObj, validate } from '@keg-hub/jsutils'

const {
  mkDir,
  readFile,
  writeFile,
  pathExists,
  removeFile,
  pathExistsSync
} = fileSys

/**
 * Finds the path to metadata folder and browser-meta.json file
 * If using host browser, then use the goblet root dir
 * Else if Vnc is running, then use the os temp directory
 * @type {function}
 *
 * @return {Object} - Contains metadata directory and file path
 */
const getMetaDataPaths = () => {
  const config = getGobletConfig()
  const { gobletRoot, pwMetaDataDir } = config.internalPaths

  const metadataDir =
    exists(pwMetaDataDir) && pathExistsSync(pwMetaDataDir)
      ? pwMetaDataDir
      : checkVncEnv().vncActive
      ? path.resolve(os.tmpdir(), 'goblet')
      : gobletRoot

  const metadataPath = path.resolve(metadataDir, 'browser-meta.json')

  return { metadataPath, metadataDir }
}

/**
 * Loads the metadata json file from the metadataPath value
 * @return {string?} contents of the browser-meta.json file or null
 */
const tryReadMeta = async () => {
  const { metadataPath } = getMetaDataPaths()

  const [err, content] = await readFile(metadataPath, 'utf8')
  return err ? null : content
}

/**
 * Creates the browser metadata file if it does not exist
 */
export const create = async (content:TBrowserMetaData = noOpObj as TBrowserMetaData) => {
  const { metadataPath, metadataDir } = getMetaDataPaths()
  const [existsErr, exists] = await pathExists(metadataDir)

  !exists && (await mkDir(metadataDir))
  const [err, _] = await writeFile(
    metadataPath,
    JSON.stringify(content, null, 2)
  )
  err && Logger.error(err)
}

/**
 * Reads browser metadata from file
 * @param {string?} [type] - specific browser to return. If omitted, returns all metadata
 *
 * @return {Object} - json of the metadata
 */
export const read = async (type?:string) => {
  try {
    const data = await tryReadMeta()
    const parsed = data ? JSON.parse(data) : {}
    const value = isObj(parsed) && type ? parsed[type] : parsed
    return value || {}
  } catch (err) {
    Logger.error(err)
    return {}
  }
}

/**
 * Saves browser metadata to file
 */
export const save = async (
  type:string,
  endpoint:string,
  launchOptions:TBrowserConf
) => {
  const { metadataPath } = getMetaDataPaths()
  const [valid] = validate({ type, endpoint }, { $default: isStr }, {})
  if (!valid) return

  const content = await read()

  const nextMetadata:TBrowserMetaData = {
    ...content,
    [type]: {
      type,
      endpoint,
      launchOptions,
      launchTime: new Date().getTime(),
    },
  }

  const [err, _] = await writeFile(
    metadataPath,
    JSON.stringify(nextMetadata, null, 2)
  )

  err && err.code === 'ENOENT'
    ? await create(nextMetadata)
    : err && Logger.error(err)
}

/**
 * Removes the metadata to file
 */
export const remove = async () => {
  const { metadataPath } = getMetaDataPaths()
  return await removeFile(metadataPath)
}

/**
 * Gets the location to where the browser metadata file is saved
 */
export const location = () => {
  const { metadataPath } = getMetaDataPaths()

  return metadataPath
}

const metadata = {
  read,
  save,
  remove,
  create,
  location,
}

export default metadata 