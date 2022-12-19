import type { TBrowserMetaDataContext, TBrowserMetaData, TBrowserConf } from '@GSC/types'

import os from 'os'
import path from 'path'
import { Logger } from '@GSC/utils/logger'
import { checkVncEnv } from '../../utils/vncActiveEnv'
import { getGobletConfig } from '@gobletqa/shared/utils/getGobletConfig'
import { existsSync, promises as fs } from 'fs'
import { limbo, isStr, isObj, exists, noOpObj, validate } from '@keg-hub/jsutils'

const {
  mkdir,
  readFile,
  writeFile,
  // @ts-ignore
  constants,
  rm:removeFile,
} = fs

const pathExists = async (checkPath:string) => {
  const [err] = await limbo(fs.access(checkPath, constants.R_OK | constants.W_OK))
  return !Boolean(err)
}

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
    exists(pwMetaDataDir) && existsSync(pwMetaDataDir)
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
  const [err, content] = await limbo(readFile(metadataPath, 'utf8'))

  return err ? null : content.toString()
}

/**
 * Creates the browser metadata file if it does not exist
 */
export const create = async (content:TBrowserMetaData = noOpObj as TBrowserMetaData) => {
  const { metadataPath, metadataDir } = getMetaDataPaths()

  const exists = await pathExists(metadataPath)
  !exists && (await mkdir(metadataDir, { recursive: true }))

  const [err, _] = await limbo(writeFile(
    metadataPath,
    JSON.stringify(content, null, 2)
  ))

  err && Logger.error(err)

  return content
}

/**
 * Reads browser metadata from file of a specific browser type
 */
export const read = async (type:string):Promise<TBrowserMetaDataContext> => {
  try {
    const data = await tryReadMeta()
    const parsed = data ? JSON.parse(data) : {}

    return (isObj(parsed) && parsed?.[type] ? parsed[type] : {}) as TBrowserMetaDataContext
  }
  catch (err) {
    Logger.error(`[PW-META ERROR]: ${err.stack}`)
    return {} as TBrowserMetaDataContext
  }
}

/**
 * Reads all browser metadata from file
 */
export const readAll = async () => {
  try {
    const data = await tryReadMeta()
    return data ? JSON.parse(data) : {}
  }
  catch (err) {
    Logger.error(`[PW-META ERROR]: ${err.stack}`)
    return {}
  }
}


/**
 * Saves browser metadata to file
 */
export const save = async (
  type:string,
  endpoint:string,
  // TODO: fix this name to be browserConf so it's consistent
  browserConf:TBrowserConf
) => {
  const { metadataPath } = getMetaDataPaths()
  const [valid] = validate({ type, endpoint }, { $default: isStr }, {})
  if (!valid) return

  const content = await readAll()

  const nextMetadata:TBrowserMetaData = {
    ...content,
    [type]: {
      type,
      endpoint,
      browserConf,
      launchTime: new Date().getTime(),
    },
  }

  const [err, _] = await limbo(writeFile(
    metadataPath,
    JSON.stringify(nextMetadata, null, 2)
  ))

  err && (err as any).code === 'ENOENT'
    ? await create(nextMetadata)
    : err && Logger.error(`[PW-META ERROR]: ${err.stack}`)

  return nextMetadata
}

/**
 * Removes the metadata to file
 */
export const remove = async () => {
  const { metadataPath } = getMetaDataPaths()
  return await limbo(removeFile(metadataPath, { force: true, recursive: true }))
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
  readAll,
  location,
}

export default metadata 