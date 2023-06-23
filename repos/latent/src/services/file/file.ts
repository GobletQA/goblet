import type { Latent } from '@GLT/latent'
import type {
  TEnvObj,
  TFileOpts,
  TLoadOpts,
  TSaveOpts,
  TLatentFile,
} from '@GLT/types'

import path from 'path'
import { writeFileSync } from 'fs'
import {emptyObj} from '@keg-hub/jsutils'
import { env } from '@keg-hub/parse-config'
import {dataToString} from '@GLT/utils/dataToString'
import {generateFileNames} from '@GLT/utils/generateFileNames'
import { EFileType, ELatentEnv, ELoadFormat } from '@GLT/types'
import { loadTemplate } from '@keg-hub/parse-config/src/utils/utils'

export class LatentFile {

  latent:Latent
  environment:ELatentEnv
  data:Record<any, any>=emptyObj

  constructor(opts:TLatentFile, latent:Latent){
    Object.assign(this, opts)
    this.latent = latent
  }

  #getOpts = (opts:TLoadOpts|TSaveOpts) => {
    return {
      ...opts,
      data: {...this.data, ...opts?.data},
      environment: opts.environment || this.environment,
    } as TFileOpts
  }

  #readFile = <T=string|TEnvObj>(options:TLoadOpts):T => {
    const { type, environment, format, ...rest} = options
    const content = env.loadEnvSync({
      ...rest,
      fill: false,
      error: true,
      format: format || ELoadFormat.string
    })

    return type === EFileType.secrets
      ? this.latent.crypto.decrypt(content, this.latent.encoded, true)
      : content
  }

  #writeFile = (location:string, content:string) => {
    return writeFileSync(location, content)
  }

  load = (opts:TLoadOpts) => {

    const options = this.#getOpts(opts)
    const {
      type,
      location,
      environment,
      ...rest
    } = options

    const templateOpts = {
      ...rest,
      fill: true,
      error: true,
      format:ELoadFormat.object
    }

    return generateFileNames(environment, type)
      .reduce((acc, file) => {

        const content = this.#readFile<string>({
          ...options,
          location: path.join(location, file)
        })

        return {
          ...acc,
          ...loadTemplate(templateOpts, content, `ENV`)
        }
      }, {} as Record<any, any> )
  }

  save = (opts:TSaveOpts) => {
    const { data, patch } = opts

    const options = this.#getOpts(opts)
    const { type, location } = options

    const current = this.#readFile<TEnvObj>({
      ...options,
      format:ELoadFormat.object
    })

    const {
      failed,
      content,
    } = dataToString({
      data,
      patch,
      current,
    })

    const safe = type === EFileType.secrets
      ? this.latent.crypto.encrypt(content, this.latent.encoded, true)
      : content

    this.#writeFile(location, safe)

    return failed?.length
      ? { failed, location }
      : { location }

  }
}