import type {
  EBrowserName,
  TBrowserConf,
  TGobletConfig,
  TBrowserMetaData,
  TBrowserMetaDataContext,
} from '@GBB/types'

import os from 'os'
import path from 'path'
import { existsSync, promises as fs } from 'fs'
import { limbo } from '@keg-hub/jsutils/limbo'
import { isStr } from '@keg-hub/jsutils/isStr'
import { isObj } from '@keg-hub/jsutils/isObj'
import { exists } from '@keg-hub/jsutils/exists'
import { noOpObj } from '@keg-hub/jsutils/noOpObj'
import { vncActive } from '@GBB/utils/checkVncEnv'
import { validate } from '@keg-hub/jsutils/validate'


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

type TMetaLogger = {
  log: (...args:any[]) => void
  error: (...args:any[]) => void
  warn: (...args:any[]) => void
}

export type TBrowserMeta = {
  config?:TGobletConfig
  logger:TMetaLogger
}

export class BrowserMeta {
  config?:TGobletConfig
  logger:TMetaLogger

  constructor(opts?:TBrowserMeta){
    if(opts?.config) this.config = opts.config
    this.logger = (opts?.logger || console) as TMetaLogger
  }

  #getConfig = (config?:TGobletConfig) => {
    config = config || this.config
    if(!config?.paths)
      throw new Error(`Can not get metadata paths, BrowserMeta requires a goblet config!`)

    return config
  }

  /**
  * Finds the path to metadata folder and browser-meta.json file
  * If using host browser, then use the goblet root dir
  * Else if Vnc is running, then use the os temp directory
  *
  */
  getMetaDataPaths = (config?:TGobletConfig) => {
    config = this.#getConfig(config)

    const { gobletRoot, pwMetaDataDir } = config.internalPaths

    const metadataDir =
      exists(pwMetaDataDir) && existsSync(pwMetaDataDir)
        ? pwMetaDataDir
        : vncActive()
          ? path.resolve(os.tmpdir(), 'goblet')
          : gobletRoot

    const metadataPath = path.resolve(metadataDir, 'browser-meta.json')

    return { metadataPath, metadataDir }
  }

  /**
  * Loads the metadata json file from the metadataPath value
  * @return {string?} contents of the browser-meta.json file or null
  */
  tryReadMeta = async (config?:TGobletConfig) => {
    const { metadataPath } = this.getMetaDataPaths(config)
    const [err, content] = await limbo(readFile(metadataPath, 'utf8'))

    return err ? null : content.toString()
  }

  /**
  * Creates the browser metadata file if it does not exist
  */
  create = async (
    content:TBrowserMetaData = noOpObj as TBrowserMetaData,
    config?:TGobletConfig
  ) => {
    const { metadataPath, metadataDir } = this.getMetaDataPaths(config)

    const exists = await pathExists(metadataPath)
    !exists && (await mkdir(metadataDir, { recursive: true }))

    const [err, _] = await limbo(writeFile(
      metadataPath,
      JSON.stringify(content, null, 2)
    ))

    err && this.logger.error(err)

    return content
  }

  /**
  * Reads browser metadata from file of a specific browser type
  */
  read = async (
    type:EBrowserName,
    config?:TGobletConfig
  ):Promise<TBrowserMetaDataContext> => {
    try {
      const data = await this.tryReadMeta(config)
      const parsed = data ? JSON.parse(data) : {}

      return (isObj(parsed) && parsed?.[type] ? parsed[type] : {}) as TBrowserMetaDataContext
    }
    catch (err) {
      this.logger.error(`[PW-META ERROR]: ${err.stack}`)
      return {} as TBrowserMetaDataContext
    }
  }

  /**
  * Reads all browser metadata from file
  */
  readAll = async (config?:TGobletConfig) => {
    try {
      const data = await this.tryReadMeta(config)
      return data ? JSON.parse(data) : {}
    }
    catch (err) {
      this.logger.error(`[PW-META ERROR]: ${err.stack}`)
      return {}
    }
  }


  /**
  * Saves browser metadata to file
  */
  save = async (
    type:EBrowserName,
    endpoint:string,
    browserConf:TBrowserConf,
    config?:TGobletConfig
  ) => {
    const { metadataPath } = this.getMetaDataPaths(config)
    const [valid] = validate({ type, endpoint }, { $default: isStr }, {})
    if (!valid)
      throw new Error([
        `Can not save browser meta-data, missing type or endpoint.`,
        `  Type: ${type}`,
        `  Endpoint: ${endpoint}`
      ].join(`\n`))


    const content = await this.readAll(config)

    const nextMetadata:TBrowserMetaData = {
      ...content,
      [type]: {
        type,
        endpoint,
        launchTime: new Date().getTime(),
        browserConf: { ...browserConf, type },
      },
    }

    const nextMetaStr = JSON.stringify(nextMetadata, null, 2)
    this.logger.log(`Saving browser metadata`, nextMetadata)

    const [err, _] = await limbo(writeFile(
      metadataPath,
      nextMetaStr
    ))

    err && (err as any).code === 'ENOENT'
      ? await this.create(nextMetadata, config)
      : err && this.logger.error(`[PW-META ERROR]: ${err.stack}`)

    return nextMetadata
  }

  /**
  * Removes the metadata to file
  */
  remove = async (config?:TGobletConfig) => {
    const { metadataPath } = this.getMetaDataPaths(config)
    return await limbo(removeFile(metadataPath, { force: true, recursive: true }))
  }

  /**
  * Gets the location to where the browser metadata file is saved
  */
  location = (config?:TGobletConfig) => {
    const { metadataPath } = this.getMetaDataPaths(config)
    return metadataPath
  }
}


export const metadata = new BrowserMeta()

