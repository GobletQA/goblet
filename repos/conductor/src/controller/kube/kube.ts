import type { Request } from 'express'
import type { Conductor } from '../../conductor'
import type {
  TPod,
  TImgRef,
  TRunOpts,
  TRouteMeta,
  TImgConfig,
  TImgsConfig,
  TDockerEvent,
  TContainerRef,
  TKubeController,
  TContainerData,
  TContainerInfo,
  TContainerRoute,
  TContainerInspect,
  TEventWatchObj,
} from '@gobletqa/conductor/types'
import { Kubectl } from './kubectl'
import { PodLabels } from './constants'
import { Controller } from '../controller'

import { hydrateRoutes } from '../../utils/hydrateRoutes'
import { mapPodToContainer } from '../../utils/mapPodToContainer'

import { Logger } from '@gobletqa/shared/libs/logger'

import { isObj, omitKeys, isEmptyColl } from '@keg-hub/jsutils'


/**
 * Docker controller class with interfacing with the Docker-Api via Dockerode
 * Matches the Controller class interface
 */
export class Kube extends Controller {

  kubectl: Kubectl
  config: TKubeController
  devRouterActive: boolean
  pods: Record<string, TPod>

  constructor(conductor:Conductor, config:TKubeController){
    super(conductor, config)
    this.config = config
    this.devRouterActive = !isEmptyColl(this.config.devRouter)
  }

  // TODO:  may need to override, but not sure yet
  // getContainer = async (containerRef:TContainerRef):TContainerData => {
  //   return {}
  // }

  hydrate = async ():Promise<Record<string, TContainerInspect>> => {
    return 
  }

  hydrateSingle = async (pod:TPod, watchObj:TEventWatchObj) => {
    const podName = pod.metadata.labels[PodLabels.component] 

    Logger.info(`Hydrating pod ${podName} from start event`)
    const id = pod.metadata.name
    const mapped = mapPodToContainer(pod, watchObj)
    this.containers[id] = mapped

    Logger.info(`Waiting 5 seconds to hydrate container...`)

    setTimeout(() => {
      Logger.info(`Finished waiting, hydrating container...`)
      hydrateRoutes(this, { [id]: mapped })
    }, 5000)
  }

  pull = async (imageRef:TImgRef) => {
    return undefined
  }

  run = async (imageRef:TImgRef, runOpts:TRunOpts, userHash:string):Promise<TRouteMeta> => {
    return undefined
  }

  /**
   * Removes a container from the runtime cache based on Id
   * @member Docker
   */
  removeFromCache = (apiObj:TPod, watchObj:TEventWatchObj) => {
    console.log(`------- remove form cache -------`)
    
    if(this.devRouterActive) return
  }

  remove = async (containerRef:TContainerRef) => {
    return undefined
  }

  removeAll = async () => {
    return undefined
  }

  cleanup = async () => {
    return undefined
  }

  validate = async (amount?:number, waitTime?:number) => {
    this.kubectl = new Kubectl(this.config)
    this.kubectl.listen({
      start: this.hydrateSingle.bind(this),
      destroy: this.removeFromCache.bind(this),
    })

    this.hydrate()

    return undefined
  }

  getRoute = (req:Request):TContainerRoute => {
    return undefined
  }


}

