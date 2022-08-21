import { buildCaddyProxy } from './buildCaddyProxy'
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios'
import {
  TCaddyConfig,
  TCaddyApiOpts,
  TCaddyApiConfig,
  TCaddyApiServer,
  TCaddyApiServers,
  TControllerRoutes,
} from '../types'

import type { Conductor } from '../conductor'
import { Logger } from '@keg-hub/cli-utils'
import { deepMerge, noOpObj, limbo } from '@keg-hub/jsutils'

const getUrl = (base, url) => {
  return url.includes(`://`) ? url : `${base}/${url.split('/').filter(Boolean).join('/')}`
}

const filterServers = (config:TCaddyApiConfig):TCaddyApiServers => {
  return Object.entries(config?.apps?.http?.servers)
    .reduce((acc, [name, server]) => {
      !server?.listen?.find((listen:string) => listen.includes(`docker.sock`))
        && (acc[name] = server)

      return acc
    }, {})
}

export class Caddy {

  config: TCaddyConfig
  conductor: Conductor
  
  constructor(conductor:Conductor, config:TCaddyConfig){
    this.conductor = conductor
    this.config = config
  }

  private throwApiError(err:Error, type:string){
    Logger.error(`[Caddy Error] API call to ${type} failed`)
    Logger.log(err.stack)
  }

  private async request<T>(options?:AxiosRequestConfig, type?:string) {
    const [err, resp] = await limbo<AxiosResponse<TCaddyApiConfig>>(axios(options))
    err && this.throwApiError(err, type)

    return resp.data as T
  }

  async getConfig(path:string = '', opts?:TCaddyApiOpts) {
    const endpoint = opts?.id ? '/id/' : '/config/'
    return await this.request<TCaddyApiConfig>(
      getUrl(this.config.url, endpoint + path),
      `GET Config`
    )
  }

  async getServers(options?:AxiosRequestConfig){
    const config = await this.getConfig()
    return filterServers(config)
  }
  
  async addServer(server:TCaddyApiServer) {
    const config = await this.request<TCaddyApiConfig>({
      url: getUrl(this.config.url, '/load'),
      method: 'POST',
      data: JSON.stringify(server),
      headers: this.config.headers,
    }, `POST Server`)

    return filterServers(config)
  }

  async updateConfig(server:TCaddyApiServer) {
    const config = await this.request<TCaddyApiConfig>({
      method: 'POST',
      headers: this.config.headers,
      data: JSON.stringify(server),
      url: getUrl(this.config.url, '/load'),
    }, `PATCH Server`)

    return filterServers(config)
  }

  async removeServer(path:string = '', opts?:TCaddyApiOpts) {
    const endpoint = opts?.id ? '/id/' : '/config/'

    return await this.request<TCaddyApiConfig>({
      method: 'DELETE',
      headers: this.config.headers,
      url: getUrl(this.config.url, endpoint + path),
    }, `DELETE Server`)
  }

  async hydrate(routes:TControllerRoutes){
    const config = await this.getConfig()
    const servers = filterServers(config)
    
    Object.entries(routes)
    .reduce(async (toResolve, [userHash, meta]) => {
      const acc = await toResolve
      const proxy = buildCaddyProxy(this, userHash, meta, servers)

      return acc
    }, Promise.resolve())

    return routes
  }
  
}


