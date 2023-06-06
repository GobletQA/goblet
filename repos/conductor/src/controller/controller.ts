import type { Request } from 'express'
import type { Conductor } from '../conductor'
import { buildImgUri } from './docker/image/buildImgUri'
import { checkImgConfig } from '../utils/checkImgConfig'
import { capitalize, deepMerge, omitKeys } from '@keg-hub/jsutils'
import { ForwardPortHeader, ForwardSubdomainHeader } from '@GCD/constants'
import {
  TImgRef,
  TPodRef,
  TRunOpts,
  TPullOpts,
  TImgConfig,
  TRouteMeta,
  TImgsConfig,
  TContainerRef,
  TContainerMap,
  TContainerRoute,
  TControllerRoutes,
  TControllerConfig,
} from '../types'




const throwOverrideErr = (message?:string) => {
  throw new Error(message || `Controller method must be overriden by an extending Class`)
}

export class Controller {

  images: TImgsConfig
  conductor: Conductor
  config: TControllerConfig
  routes: TControllerRoutes = {}
  containerMaps: Record<string, TContainerMap> = {}

  constructor(conductor:Conductor, config:TControllerConfig){
    this.config = config
    this.conductor = conductor
  }

  getImg(imageRef:TImgRef): TImgConfig {
    return typeof imageRef === 'string' ? this.images[imageRef] : imageRef
  }

  /**
   * Ensures the passed in config is valid
   */
  validateImg(imageRef:TImgRef) {
    const img = this.getImg(imageRef)
   checkImgConfig(img, imageRef)
  }

  buildImgs(images:TImgsConfig){
    this.images = Object.entries(images)
      .reduce((acc, [key, img]) => {
        checkImgConfig(img, key)
        acc[key] = deepMerge(img)
        acc[key].uri = acc[key].uri || buildImgUri(acc[key])

        return acc
      }, {})
  }

  getContainer(containerRef:TContainerRef|TPodRef):TContainerMap {
    const isRefStr = typeof containerRef === 'string'

    // There's an odd bug where dockerode is adding / before a named container
    // So we have to compare the name include a / on the ref
    // first remove it if it exists, then added back to it works with or without it
    const strRef = isRefStr ? containerRef?.replace?.(/^\//, ``) : ``

    if(strRef && this.containerMaps[strRef])
      return this.containerMaps[strRef]

    return Object.values(this.containerMaps)
      .find((cont) => {
        const container = cont as TContainerMap
        if(isRefStr)
          return container?.id?.startsWith?.(containerRef)
            || container?.name?.startsWith?.(strRef)
        
        // Convert to any to fix issue with checking type on TContainerMap and TContainerRef
        // We check for both uppercase and lowercase 
        const {
          id,
          Id,
          name,
          Name
        } = containerRef as any

        return container?.id?.startsWith?.(id || Id)
          || container?.name?.startsWith?.(`/${(name || Name)?.replace?.(`/`, ``)}`)

      })
  }

  hydrate = async (hydrateCache?:any):Promise<Record<string, TContainerMap>> => {
    throwOverrideErr()
    return undefined
  }

  hydrateSingle = async (...args:any[]) => {
    throwOverrideErr()
    return undefined
  }

  pull = async (imageRef:TImgRef, pullOpts?:TPullOpts) => {
    throwOverrideErr()
    return undefined
  }

  run = async (imageRef:TImgRef, runOpts:TRunOpts, userHash:string):Promise<TRouteMeta> => {
    throwOverrideErr()
    return undefined
  }

  remove = async (
    containerRef:TContainerRef|TPodRef,
    isContainerMap:boolean=false,
    throwOnEmpty:boolean=true
  ) => {
    throwOverrideErr()
    return undefined
  }

  removeAll = async () => {
    throwOverrideErr()
    return undefined
  }

  cleanup = async () => {
    throwOverrideErr()
    return undefined
  }

  get = async (ref:TContainerRef|TPodRef) => {
    throwOverrideErr()
    return undefined
  }

  validate = async (amount?:number, waitTime?:number) => {
    throwOverrideErr()
    return undefined
  }

  /**
   * Gets a route from the passed in headers of the request
   */
  getRoute = (req:Request) => {
    const proxyPort = (req.headers[ForwardPortHeader] || ``).toString().split(`,`).shift()
    const userHash = (req.headers[ForwardSubdomainHeader] || ``).toString().split(`,`).shift()
    const route = this.routes?.[userHash]?.routes?.[proxyPort]

    return omitKeys(route, [`headers`, `containerPort`]) as TContainerRoute
  }

  notFoundErr = (args:Record<string, string>) => {
    const {
      ref=``,
      message,
      type='container',
    } = args
    this.controllerErr({
      ...args,
      message: message || [
      `Failed removing ${type}.`,
      `${capitalize(type)} ${ref ? ref+' ' : ''} could not be found.\n`
    ].join(' ')
    })
  }

  // TODO: Add an error override to allow setting the correct error response codes
  // Currently returns 500 any time and error is thrown
  controllerErr = (args:Record<string, string>) => {
    const {
      ref=``,
      message,
      type='container',
    } = args
    throw new Error(`[Controller Error] - ${capitalize(type)}: ${message}`)
  }

}