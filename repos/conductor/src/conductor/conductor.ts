import { createProxy } from '../proxy'
import { createServer } from '../server'
import { Request, Express } from 'express'
import { getDomain } from '../utils/getDomain'
import { buildConfig } from '../utils/buildConfig'
import { Controller } from '../controller/controller'
import { getApp } from '@gobletqa/shared/express/app'
import { getController } from '../controller/controllerTypes'
import {
  TImgRef,
  TSpawnOpts,
  TProxyRoute,
  TContainerRef,
  TConductorOpts,
  TConductorConfig,
} from '../types'

export class Conductor {

  domain: string
  controller: Controller
  config: TConductorConfig
  rateLimitMap:Record<any, any>
  containerTimeoutMap: Record<any, any>

  constructor(config:TConductorOpts) {
    this.rateLimitMap = {}
    this.containerTimeoutMap = {}
    this.config = buildConfig(config)
    this.domain = getDomain(this.config)
    this.controller = getController(this, this.config.controller)

    config.images
      && this.controller.buildImgs(this.config.images)
    
    const app = getApp() as Express
    app.locals.conductor = this as Conductor
    this.controller.hydrate()
  }

  /**
   * Ensures the passed in config is valid
   */
  static validateConfig(config:TConductorConfig) {
    if (!config) {
      throw new Error('Required parameter config not provided')
    }
    const requiredProperties = ['image', 'port', 'containerPort']

    for (const prop of requiredProperties) {
      if (!(prop in config)) throw new Error(`Required property ${prop} not found in config`)
    }
  }

  /**
   * Ensures a single IP doesn't make to many requests
   */
  async handleRateLimit(req:Request) {
    if (this.config.proxy.rateLimit <= 0) return

    const addr = req?.socket?.remoteAddress
    const now = new Date().getTime()
    let nextTime = now + this.config.proxy.rateLimit

    if (addr in this.rateLimitMap) {
      const lastTime = this.rateLimitMap[addr]
      const waitTime = lastTime - now
      if (waitTime > 0) {
        // TODO: handle rate limiting here somehow?
      }
    }

    this.rateLimitMap[addr] = nextTime
  }

 /**
   * Pulls an image by forwarding it to the controller.pull method
   */
  async pull(imageRef:TImgRef){
    await this.controller.pull(imageRef)
  } 

  /**
   * Spawns a new container based on the passed in request
   * Is called from the spawn endpoint
   */
  async spawn(imageRef:TImgRef, spawnOpts:TSpawnOpts, subdomain:string) {
    if(!imageRef && !spawnOpts.name)
      throw new Error(`Image ref or name is require to spawn a new container`)

    const { urls, meta } = await this.controller.run(imageRef, spawnOpts, subdomain)

    return { urls, meta }
  }

  /**
   * Removes a container be reference name
   */
  async remove(containerRef:TContainerRef){
    return await this.controller.remove(containerRef)
  } 

  /**
   * Removes all existing conductor containers
   */
  async removeAll() {
    return await this.controller.removeAll()
  }

  /**
   * Removes all existing conductor containers
   * Then calls cleanup method of existing controller
   */
  async cleanup() {
    await this.removeAll()
    return await this.controller.cleanup()
  }

  /**
   * Handles proxy requests to containers
   * Gets the routeData from the controller
   * Response matches the API from http-proxy-middleware#router as a method
   */
  async proxyRouter(req:Request):Promise<TProxyRoute|string> {
    // TODO: add rate limiting for requests
    // this.handleRateLimit(req)

    const routeData = this.controller.getRoute(req)

    return routeData?.route
      || routeData?.internal
      || undefined
  }

  /**
   * Starts conductor by creating the Express Server and Proxy
   */
  async start() {
    const { server } = createServer(this.config.server)
    const proxyHandler = createProxy({
      ...this.config.proxy,
      proxyRouter: this.proxyRouter.bind(this)
    })

    server.on('upgrade', proxyHandler.upgrade)

    return this
  }

}


