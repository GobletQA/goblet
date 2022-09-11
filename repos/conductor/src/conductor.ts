import type { Request, Router, Express } from 'express'
import type {
  TImgRef,
  TUserHash,
  TSpawnOpts,
  TContainerRef,
  TConductorOpts,
  TConductorConfig,
} from '@gobletqa/conductor/types'

import { buildConfig } from './utils/buildConfig'
import { Controller } from './controller/controller'
import { getApp } from '@gobletqa/shared/express/app'
import { getController } from './controller/controllerTypes'
import { createApiProxy, createVNCProxy, createWSProxy } from './proxy'

export class Conductor {

  controller: Controller
  config: TConductorConfig
  rateLimitMap:Record<any, any>
  containerTimeoutMap: Record<any, any>

  constructor(config:TConductorOpts) {
    this.rateLimitMap = {}
    this.containerTimeoutMap = {}
    this.config = buildConfig(config)
    this.controller = getController(this, this.config.controller)

    config.images
      && this.controller.buildImgs(this.config.images)

    const app = getApp({ name: `Conductor`, ...this.config }) as Express
    app.locals.conductor = this as Conductor

  }

  static async initialImagePull(config:TConductorOpts) {
    buildConfig(config)
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
    if (this.config.controller.rateLimit <= 0) return

    const addr = req?.socket?.remoteAddress
    const now = new Date().getTime()
    let nextTime = now + this.config.controller.rateLimit

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
    return await this.controller.pull(imageRef)
  } 

  /**
   * Spawns a new container based on the passed in request
   * Is called from the spawn endpoint
   */
  async spawn(imageRef:TImgRef, spawnOpts:TSpawnOpts, userHash:TUserHash) {
    if(!imageRef && !spawnOpts.name)
      throw new Error(`Image ref or name is require to spawn a new container`)

    const { routes, meta } = await this.controller.run(imageRef, spawnOpts, userHash)

    return { routes, meta }
  }

  /**
   * Gets the status of a user based on the userHash
   * Route is derived from the user and a hash so it's always the same
   */
  async status(req:Partial<Request>, userHash?:string){
    const { ensure, ...spawnOpts } = Object.assign({}, req?.query, req?.body)
    const { imageRef } = (req?.params || {})
    const route = this.controller.routes?.[userHash]
    if(route) return route
    
    if(!ensure || !imageRef)
      throw new Error([
        `[Conductor] Status Error: Container session does not exist and can not be started.`,
        `Missing "imageRef": ${imageRef} or "ensure" ${ensure} arguments.`
      ].join(`\n`))

    return await this.spawn(
      imageRef as string,
      spawnOpts as TSpawnOpts,
      userHash
    )
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

  async updateSession() {
    // TODO: updates a session containers timeout status
    // After it's been running without interaction
    // Then the container is automatically killed
    // This method should update that timer on each request
  }

  /**
   * Handles proxy requests to containers
   * Gets the routeData from the controller
   * Response matches the API from http-proxy-middleware#router as a method
   */
  async proxyRouter(req:Request) {
    // TODO: add rate limiting for requests
    // this.handleRateLimit(req)
    const routeData = this.controller.getRoute(req)
    return routeData
  }

  createProxy(app?:Express, ProxyRouter?:Router) {
    const apiProxy = createApiProxy({
      ...this.config.proxy,
      ...app?.locals?.config?.proxy,
      proxyRouter: this.proxyRouter.bind(this),
      headers: {
        ...this.config?.proxy?.headers,
        ...app?.locals?.config?.proxy?.headers
      },
    }, ProxyRouter)

    const wsProxy = createWSProxy(app?.locals?.config?.wsProxy, app)
    const vncProxy = createVNCProxy(app?.locals?.config?.vncProxy, app)

    return { apiProxy, vncProxy, wsProxy }
  }

  /**
   * Starts conductor by creating the Express Server and Proxy
   */
  async validate() {
    // Ensure the controller is configuration properly 
    await this.controller.validate()
    return this
  }

}


