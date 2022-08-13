import axios from 'axios'
import { Request, Response } from 'express'
import { deepMerge, noOpObj, limbo } from '@keg-hub/jsutils'
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

  async validate(){
    const [err, resp] = await limbo(axios({
      url: this.uri,
      method: 'get',
      headers: this.config.headers
    }))

    checkAxiosError(err, resp)
  }

  get uri():string{
    const { host, port, protocol=`http` } = this.config
    const domain = port ? `${host}:${port}` : host

    return `${protocol}://${domain}`
  }

  async proxyRequest(req:Request, res:Response){
    const [err, aRes] = await expToAxios(req, {
      responseType: 'stream',
      headers: this.config.headers,
      url: this.uri + req.originalUrl,
    })

    checkAxiosError(err, aRes)
    axiosToExp(aRes, res, true)
  }

}

