import axios, { AxiosResponse, AxiosRequestConfig } from 'axios'

import { Logger } from '@keg-hub/cli-utils'
import { Request, Response } from 'express'
import { deepMerge, noOpObj, limbo } from '@keg-hub/jsutils'
import { waitRetry } from '@gobletqa/shared/utils/waitRetry'
import { axiosToExp, expToAxios, checkAxiosError } from '@GBE/utils/axiosProxy'
import { TConductorServiceConfig, TReqHeaders } from '@gobletqa/backend/src/types'

const defConfig = { headers: noOpObj } as TConductorServiceConfig

const buildHeaders = (
  conductor:ConductorService,
  extra?:TReqHeaders
):Record<string, string> => {
  return deepMerge(conductor?.config?.headers, extra)
}

export class ConductorService {
  
  config:TConductorServiceConfig
  fetch: any

  constructor(config:TConductorServiceConfig=defConfig){
    this.config = config
    this.config.headers = buildHeaders(this, {
      Host: process.env[`GB_CD_HOST`],
      'Content-Type': `application/json`,
      [this.config.keyHeader]: this.config.key
    })
  }

  /**
   * Validates the the conductor API is accessible from the backend API
   */
  async validate(attempts=3){
    await waitRetry(async (attempt) => {
      Logger.info(`Attempt ${attempt}: connecting to Conductor pod...`)

      const [err, resp] = await limbo(axios({
        url: this.uri,
        method: 'get',
        headers: this.config.headers
      }))
      checkAxiosError(err, resp)
    }, attempts, 3000)
  }

  /**
   * Generates the URL for calling the conductor API based on the current config
   */
  get uri():string{
    const { host, port, protocol=`http` } = this.config
    const domain = port ? `${host}:${port}` : host

    return `${protocol}://${domain}`
  }

  /**
   * Helper method to proxy request to the conductor API via axios
   * It called automatically via middleware for almost all repo-requests
   */
  async proxyRequest(req:Request, res:Response){
    const [err, aRes] = await expToAxios(req, {
      responseType: 'stream',
      headers: this.config.headers,
      url: this.uri + req.originalUrl,
    })

    checkAxiosError(err, aRes)
    axiosToExp(aRes, res, true)
  }

  /**
   * Helper method to manually call the conductor api
   * Use in the status and validate endpoints
   *
   */
  async request(opts:AxiosRequestConfig) {
    const url = opts.url.includes(`://`)
      ? opts.url
      : `${this.uri}/${opts.url.split('/').filter(Boolean).join('/')}`

    const [err, resp] = await limbo(axios({
      method: 'get',
      ...opts,
      url,
      headers: buildHeaders(this, opts?.headers),
    }))

    if(err) throw err

    return resp.data 
  }

}

