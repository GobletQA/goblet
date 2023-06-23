import type { Latent } from '@GLT/latent'
import {
  TLoadOpts,
  EFileType,
  ELatentEnv,
  ELoadFormat,
  TLatentFile,
  TFileContentOpts,
} from '@GLT/types'
import {generateFileNames} from '@GLT/utils/generateFileNames'

import {emptyObj} from '@keg-hub/jsutils'
import { env } from '@keg-hub/parse-config'

import { loadTemplate } from '@keg-hub/parse-config/src/utils/utils'
import path from 'path'


export class LatentFile {

  latent:Latent
  environment:ELatentEnv
  data:Record<any, any>=emptyObj

  constructor(opts:TLatentFile, latent:Latent){
    Object.assign(this, opts)
    this.latent = latent
  }

  #getOpts = (location:string, opts:TLoadOpts) => {
    return {
      ...opts,
      location,
      data: {...this.data, ...opts.data},
      environment: opts.environment || this.environment,
    } as TFileContentOpts
  }

  #fileContent = (options:TFileContentOpts) => {
    const { type, environment, ...rest} = options

    const content = env.loadEnvSync({
      ...rest,
      fill: false,
      error: true,
      format: ELoadFormat.string
    })

    return type === EFileType.secrets
      ? this.latent.crypto.decrypt(content, this.latent.encoded, true)
      : content
  }

  load = (
    directory:string,
    opts:TLoadOpts
  ) => {

    const options = this.#getOpts(directory, opts)
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

        const content = this.#fileContent({
          ...options,
          location: path.join(location, file)
        })

        return {
          ...acc,
          ...loadTemplate(templateOpts, content, `ENV`)
        }
      }, {} as Record<any, any> )
  }

}