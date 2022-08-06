import { Request } from 'express'
import type { Conductor } from '../conductor'
import { buildImgUri } from '../utils/buildImgUri'
import { capitalize, deepMerge } from '@keg-hub/jsutils'
import { checkImgConfig } from '../utils/checkImgConfig'
import {
  TUrlMap,
  TImgRef,
  TRunOpts,
  TPullOpts,
  TImgConfig,
  TImgsConfig,
  TRunResponse,
  TContainerRef,
  TContainerData,
  TContainerInspect,
  TControllerConfig,
} from '../types'


const throwOverrideErr = (message?:string) => {
  throw new Error(message || `Controller method must be overriden by an extending Class`)
}

export class Controller {

  images: TImgsConfig
  conductor: Conductor
  config: TControllerConfig
  containers:Record<string, TContainerData> = {}
  routes: Record<string, Record<string, TUrlMap>> = {}

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

  getContainer(containerRef:TContainerRef):TContainerData {
    const isStr = typeof containerRef === 'string'

    // There's an odd bug where dockerode is adding / before a named container
    // So we have to compare the name include a / on the ref
    // first remove it if it exists, then added back to it works with or without it
    const strRef = isStr && `/${containerRef.replace(`/`, ``)}`

    if(strRef && this.containers[strRef])
      return this.containers[strRef]

    return Object.values(this.containers)
      .find((cont) => {
        const container = cont as TContainerInspect
        return isStr
          ? container?.Id.startsWith(containerRef)
            || container?.Name.startsWith(strRef)
          : container?.Id.startsWith(containerRef?.Id)
            || container?.Name.startsWith(`/${containerRef?.Name.replace(`/`, ``)}`)
      })
  }

  hydrate = async (hydrateCache?:any):Promise<Record<string, TContainerInspect>> => {
    throwOverrideErr()
    return undefined
  }

  pull = async (imageRef:TImgRef, pullOpts?:TPullOpts) => {
    throwOverrideErr()
    return undefined
  }

  run = async (imageRef:TImgRef, runOpts:TRunOpts, subdomain:string):Promise<TRunResponse> => {
    throwOverrideErr()
    return undefined
  }

  remove = async (containerRef:TContainerRef) => {
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

  getRoute = (req:Request) => {
    const [port, subdomain] = (req.subdomains || []).reverse()
    const routeData = this.routes?.[subdomain]?.[port]
    if(routeData) return routeData

    // Websocket connection don't seem to get the subdomains added the the request
    // So we have to manually parse it from the host header
    // There's probably a better way to do this, and may need to be investigated
    const [ hPort, hSubdomain ] = req?.headers?.host.split(`.`)

    return this.routes?.[hSubdomain]?.[hPort]
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