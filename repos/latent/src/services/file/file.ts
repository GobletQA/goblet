import type { Latent } from '@GLT/latent'
import type {
  TFileOpts,
  TLoadOpts,
  TSaveOpts,
  TReadOpts,
  TFileNames,
  TLatentFile,
  TFileSaveResp,
  TLoadSingleOpts,
} from '@GLT/types'

import path from 'path'
import { env } from '@keg-hub/parse-config'
import { writeFileSync, existsSync } from 'fs'
import {emptyObj} from '@keg-hub/jsutils/emptyObj'
import { EFileType, ELoadFormat } from '@GLT/types'
import {dataToString} from '@GLT/utils/dataToString'
import {generateFileNames} from '@GLT/utils/generateFileNames'
import { loadTemplate } from '@keg-hub/parse-config/src/utils/utils'

export class LatentFile {

  latent:Latent
  data:Record<any, any>=emptyObj

  constructor(opts:TLatentFile=emptyObj, latent:Latent){
    const { token, ...rest } = opts
    Object.assign(this, rest)
    this.latent = latent
  }


  /**
   * @description - Writes the passed in content to disk
   * @member {LatentFile}
   */
  #writeFile = (location:string, content:string) => writeFileSync(location, content)


  /**
   * @description - Normalizes the options by merging the instance data with the opts
   * @member {LatentFile}
   */
  #getOpts = (opts:TLoadOpts|TSaveOpts) => {
    return {
      ...opts,
      data: {...this.data, ...opts?.data},
      environment: opts.environment || this.latent.environment,
    } as TFileOpts
  }


  /**
   * @description - Reads the content of a file and decrypts it if type is "secrets"
   * @member {LatentFile}
   */
  #readFile = (options:TReadOpts):string => {
    const {
      type,
      token,
      environment,
      ...rest
    } = options

    const content = env.loadSync({
      ...rest,
      fill: false,
      error: false,
      format: ELoadFormat.string,
    })

    return !content?.trim?.()
      ? ``
      : type === EFileType.secrets
        ? this.latent.crypto.decrypt(content, token || this.latent.encoded, true)
        : content
  }


  /**
   * @description - Gets all file that exist based on the type and environment
   * @member {LatentFile}
   */
  locationFiles = (opts:TFileNames) => {
    const {
      type,
      location,
      environment
    } = opts
    
    return generateFileNames(environment, type)
      .reduce((acc, file) => {
        const full = path.join(location, file)
        existsSync(full) && acc.push(full)

        return acc
      }, [] as string[])
  }


  /**
   * @description - Loads all files of type values or secrets for a specific environment
   * @member {LatentFile}
   * @note - "opts.location" should be the be a directory
   * @note - "opts.data" is an object used to fill the ENV template
   */
  loadAll = (opts:TLoadOpts) => {
    const options = this.#getOpts(opts)
    const {
      type,
      location,
      environment,
    } = options

    return this.locationFiles({
      type,
      location,
      environment,
    })
      .reduce((acc, loc) => ({
        ...acc,
        ...this.loadSingle({...options, location: loc })
      }), {} as Record<any, any> )
  }


  /**
   * @description - Loads a single file of type values or secrets
   * @member {LatentFile}
   * @note - "opts.location" should be the full file path, NOT a directory
   * @note - "opts.data" is an object used to fill the ENV template
   */
  loadSingle = (opts:TLoadSingleOpts) => {
    const { format, token, ...rest } = opts
    const options = this.#getOpts(rest)

    const templateOpts = {
      ...options,
      fill: true,
      error: true,
      format: format || ELoadFormat.object
    }

    const content = this.#readFile({...options, token})

    return loadTemplate(templateOpts, content, env.parse)
  }


  /**
   * @description - Saves a file with the passed in data
   * @member {LatentFile}
   * @note - "opts.data" is the content to be saved
   * @note - Keys that already exist can not be updated unless "opts.patch" is "true"
   */
  save = (opts:TSaveOpts):TFileSaveResp => {
    const { data, token, ...rest } = opts
    const options = this.#getOpts(rest)
    const {
      type,
      patch,
      rekey,
      replace,
      location,
    } = options

    let current = opts.current
    if(!current){
      const content = this.#readFile({...options, token })
      current = env.parse(content)
    }

    const {
      failed,
      content,
    } = dataToString({
      data,
      rekey,
      patch,
      replace,
      current,
    })

    const isSecrets = type === EFileType.secrets

    const safe = isSecrets
      ? this.latent.crypto.encrypt(content, token || this.latent.encoded, true)
      : content

    this.#writeFile(location, safe)

    return failed?.length
      ? { failed, location }
      : { location }

  }
}
