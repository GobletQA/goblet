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
  TContainerInfo,
  TContainerMap,
  TContainerRoute,
  TContainerInspect,
  TEventWatchObj,
} from '@gobletqa/conductor/types'


import { generateRoutes } from '../../utils/generators'
import { buildImgUri } from '../docker/image/buildImgUri'
import { buildPorts } from '../docker/container/buildPorts'
import { buildLabels } from '../docker/container/buildLabels'
import { ERestartPolicy, EImgPullPolicy } from '@gobletqa/conductor/types'

import { Kubectl } from './kubectl'
import { PodLabels } from './constants'
import { buildPodManifest } from './pod'
import { Controller } from '../controller'
import { Logger } from '@gobletqa/shared/libs/logger'
import { hydrateRoutes } from '../../utils/hydrateRoutes'
import { buildContainerMap } from './pod/buildContainerMap'
import { isObj, omitKeys, isEmptyColl } from '@keg-hub/jsutils'
import {
  DEV_USER_HASH,
  FORWARD_PORT_HEADER,
  FORWARD_SUBDOMAIN_HEADER,
  CONDUCTOR_USER_HASH_LABEL,
} from '@GCD/constants'


/**
 * Docker controller class with interfacing with the Docker-Api via Dockerode
 * Matches the Controller class interface
 */
export class Kube extends Controller {

  kubectl: Kubectl
  config: TKubeController
  devRouterActive: boolean
  pods: Record<string, TPod>
  containerMaps: Record<string, TContainerMap>

  constructor(conductor:Conductor, config:TKubeController){
    super(conductor, config)
    this.config = config
    this.devRouterActive = !isEmptyColl(this.config.devRouter)
  }

  // TODO:  may need to override, but not sure yet
  // getContainer = async (containerRef:TContainerRef):TContainerMap => {
  //   return {}
  // }

  hydrate = async ():Promise<Record<string, TContainerMap>> => {
    return 
  }

  hydrateSingle = async (pod:TPod, watchObj:TEventWatchObj) => {
    const userHash = pod.metadata.labels[CONDUCTOR_USER_HASH_LABEL]
    if(!userHash) return

    const podName = pod.metadata.labels[PodLabels.component] 
    Logger.info(`Hydrating pod ${podName} from start event`)
    const id = pod.metadata.name
    const mapped = buildContainerMap(pod)
    this.containerMaps[id] = mapped

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
    if(this.devRouterActive) return this.routes[DEV_USER_HASH]

    const image = this.getImg(imageRef)
    !image && this.notFoundErr({ type: `image`, ref: imageRef as string })

    const {
      tag,
      name,
      user,
      provider,
      deployment,
      container 
    } = image
    const {
      mem,
      idle,
      envs,
      ports,
      timeout,
      rateLimit,
      retryCount,
      runtimeEnvs,
      restartPolicy
    } = container

    const portData = await buildPorts(image)
    const nameRef = `${userHash}-${deployment}`
    const podManifest = buildPodManifest({
      meta: {
        name: nameRef,
        namespace: this.config.namespace,
        labels: {
          ...buildLabels(image, userHash),
          'app.kubernetes.io/name': `gobletqa-app`,
          'app.kubernetes.io/component': deployment,
          'app.kubernetes.io/managed-by': `goblet-conductor`,
        },
      },
      spec: {
        restart: ERestartPolicy[restartPolicy] || ERestartPolicy.OnFailure,
        containers: {
          [nameRef]: {
            envs,
            ports,
            tty: true,
            stdin: true,
            image: buildImgUri(image),
            pullPolicy: EImgPullPolicy.Always,
          }
        }
      }
    })

    const routeMeta = generateRoutes(
      portData.ports,
      this.conductor,
      userHash,
      { state: `Creating` }
    )
    this.routes[userHash] = routeMeta

    // TODO: test creating the POD, then accessing it
    // Update hydrate to work with pod,
    // Change object type to be common between docker on kubernetes
    // Use only require data, not entire docker-inspect object
    const resp = await this.kubectl.createPod(podManifest)
    
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

