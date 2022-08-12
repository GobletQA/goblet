
import { Request, Response } from 'express'
import { deepMerge, noOpObj, limbo } from '@keg-hub/jsutils'
import { TConductorServiceConfig, TReqHeaders } from '@gobletqa/backend/src/types'

let __FETCH__
const getFetch = async () => {
  __FETCH__ = __FETCH__
    || await import('node-fetch').then(({ default:fetch, ...resp}) => Object.assign(fetch, resp))

  return __FETCH__
}



const defConfig = { headers: noOpObj } as TConductorServiceConfig

const buildHeaders = (
  conductor:ConductorService,
  extra?:TReqHeaders
):Record<string, string> => {
  return deepMerge(conductor?.config?.headers, extra)
}

type TPostParams = {
  body: Record<any, any> 
  headers: TReqHeaders
}

export class ConductorService {
  
  config:TConductorServiceConfig
  fetch: any

  constructor(config:TConductorServiceConfig=defConfig){
    this.config = config
    this.config.headers = buildHeaders(this, {
      Host: process.env[`GB_CD_HOST`],
      'Content-Type': `application/json`,
      'GB-Validation-Key': this.config.key
    })
  }

  async validate(){
    const fetch = await getFetch()
    const [err, resp] = await limbo(fetch(this.uri, {
      headers: this.config.headers
    }))


    if(err) throw new Error(`Could validate with Conductor API. \n${err.stack}`)

    const data = await resp.json()
    if(!resp.ok) throw new Error(`Could validate with Conductor API. \n${JSON.stringify(data)}`)
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
    const { fetch } = await getFetch()
    
    const [err, resp] = await limbo(fetch(this.uri, {
      method: 'post',
      body: JSON.stringify(body),
      headers: buildHeaders(this, headers)
    }))

    return await resp.json()
  }
  
}


