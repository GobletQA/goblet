import fetch from 'node-fetch'
import { deepMerge } from '@keg-hub/jsutils'
import { Request, Response } from 'express'
import { TConductorServiceConfig, TReqHeaders } from '@gobletqa/backend/src/types'

const buildHeaders = (
  conductor:ConductorService,
  extra?:TReqHeaders
):Record<string, string> => {
  return deepMerge(conductor.config.headers, extra)
}

type TPostParams = {
  body: Record<any, any> 
  headers: TReqHeaders
}

export class ConductorService {
  
  config:TConductorServiceConfig

  constructor(config:TConductorServiceConfig){
    this.config = config
    this.config.headers = buildHeaders(this, {
      'Content-Type': 'application/json'
    })

  }

  get uri():string{
    const { host, port, protocol=`http` } = this.config
    const domain = port ? `${host}:${port}` : host

    return `${protocol}://${domain}`
  }

  async forwardRequest(req:Request, res:Response){
    
  }

  async spawn() {
    const resp = await this.post({
      body: {},
      headers: {}
    })
  }

  async post({ body, headers }:TPostParams) {
    const response = await fetch(this.uri, {
      method: 'post',
      body: JSON.stringify(body),
      headers: buildHeaders(this, headers)
    })

    return await response.json()
  }
  
}


