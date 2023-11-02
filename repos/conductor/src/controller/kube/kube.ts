import type { Conductor } from '../../conductor'
import type {
  TPod,
  TPodRef,
  TImgRef,
  TRunOpts,
  TRouteMeta,
  TRemoveOpts,
  TPodContainer,
  TContainerMap,
  TContainerMaps,
  TEventWatchObj,
  TContainerMeta,
  TKubeController,
} from '@gobletqa/conductor/types'

import { Kubectl } from './kubectl'
import { Controller } from '../controller'
import { Logger } from '../../utils/logger'
import { buildPorts } from './pod/buildPorts'
import { isObj } from '@keg-hub/jsutils/isObj'
import { isStr } from '@keg-hub/jsutils/isStr'
import { buildPortMap } from './pod/buildPortMap'
import { shouldRemove } from './pod/shouldRemove'
import { shouldHydrate } from './pod/shouldHydrate'
import { emptyObj } from '@keg-hub/jsutils/emptyObj'
import { buildPodManifest } from './pod/buildPodManifest'
import { hydrateRoutes } from '../../utils/hydrateRoutes'
import { buildImgUri } from '../docker/image/buildImgUri'
import { isEmptyColl } from '@keg-hub/jsutils/isEmptyColl'
import { buildContainerMap } from './pod/buildContainerMap'
import { getPodAnnotations } from './pod/getPodAnnotations'
import { EContainerState } from '@gobletqa/conductor/types'
import { buildLabels } from '../docker/container/buildLabels'
import { generateRoute, generateRoutes } from '../../utils/generators'
import { ERestartPolicy, EImgPullPolicy } from '@gobletqa/conductor/types'
import { DevUserHash, PodAnnotations, ConductorUserHashLabel } from '@GCD/constants'

/**
 * Docker controller class with interfacing with the Docker-Api via Dockerode
 * Matches the Controller class interface
 */
export class Kube extends Controller {
  kubectl: Kubectl
  // @ts-ignore
  config: TKubeController
  // @ts-ignore
  devRouterActive: boolean
  pods:Record<string, TPod>
  containerMaps: TContainerMaps={}

  constructor(conductor:Conductor, config:TKubeController){
    super(conductor, config)
    this.config = config
    this.devRouterActive = !isEmptyColl(this.config.devRouter)
  }

  /**
   * Single method to remove the container meta data from both the container map and controller routes
   * @member Kube
   */
  #cleanup = (mapped:TContainerMap, opts:{userHash?:string}=emptyObj) => {
    this.containerMaps = Object.entries(this.containerMaps)
      .reduce((acc, [ref, container]:[string, TContainerMap]) => {
        mapped?.id !== container.id && (acc[ref] = container)

        return acc
      }, {})

    const hash = opts.userHash || mapped.labels[ConductorUserHashLabel]
    if(this.routes[hash]) delete this.routes[hash]
  }

  /**
   * Gets all running pods and rebuilds the runtime cache and routes
   * Allows starting / restarting conductor at anytime and it still works
   * @member Kube
   */
  hydrate = async ():Promise<Record<string, TContainerMap>> => {
    if(this.devRouterActive) return
    
    const pods = await this.getAll()
    const imgNames = Object.keys(this.conductor.config.images)

    this.containerMaps = pods.reduce((acc, pod) => {
      const userHash = pod.metadata.annotations[ConductorUserHashLabel]

      // Check if there's an existing container that's owned by goblet
      // But missing the correct user hash. If there is, then remove it
      if(!userHash){
        const fromGoblet = Object.keys(pod.metadata.annotations)
          .find((label:string) => imgNames.includes(label))

        fromGoblet && this.remove(pod)
        return acc
      }

      // If no accessible ports, then remove the pod
      // The user can't access it anyways
      const annotations = getPodAnnotations(pod)
      if(!annotations.ports){
        this.remove(pod, { userHash })
        return acc
      }

      const mapped = buildContainerMap(pod, annotations.ports)

      // Any container not running always just remove it
      // The user can't access it anyways
      if(mapped.state !== EContainerState.Running){
        this.remove(mapped, {userHash, isContainerMap: true})
        return acc
      }

      acc[mapped.id] = mapped

      return acc
    }, {} as TContainerMaps)

    const hydrateCount = Object.keys(this.containerMaps).length
    hydrateCount && Logger.info(`Hydrating ${hydrateCount} container(s) into runtime cache`)

    hydrateRoutes(this, this.containerMaps)

    return this.containerMaps
  }

  /**
   * hydrates the dev router and bypasses Kubernetes API entirely
   * Allows running the screen-cast pod manually when in local development
   * @member Kube
   */
  hydrateDevRouter = async () => {
    Logger.warn(`Running in dev mode, kind will not be active!`)
    const meta = this.config.devRouter.meta

    this.routes[DevUserHash] = Object.entries(this.config.devRouter.routes)
      .reduce((acc, [port, config]) => {
        acc.routes[port] = generateRoute({
          userHash: DevUserHash,
          conductor: this.conductor,
          containerPort: config.port,
          hostPort: config.containerPort,
          meta: this.config.devRouter.meta,
        })

        return acc
      }, { routes: {}, meta } as TRouteMeta)
  }

  /**
   * Hydrates a single pod, and generates the runtime cache and routes
   * Is called dynamically from using the watch functionally of the kubernetes API
   * @member Kube
   */
  hydrateSingle = async (pod:TPod, watchObj:TEventWatchObj) => {
    if(this.devRouterActive) return

    const annotations = getPodAnnotations(pod)
    if(!annotations.userHash)  return

    const image = this.getImg(annotations.name)
    if(!image) return

    const mapped = buildContainerMap(pod, annotations.ports)

    if(shouldRemove(pod, mapped, annotations))
        return this.remove(mapped, {
          isContainerMap: true,
          userHash: annotations.userHash
        })

    const doHydrate = shouldHydrate(
      mapped.state,
      watchObj.type,
      pod?.metadata?.deletionTimestamp
    )

    if(!doHydrate) return

    Logger.info(`Hydrating pod ${annotations.name} from watch event: '${watchObj.type}'`)
    const id = pod.metadata.name
    this.containerMaps[id] = mapped
    hydrateRoutes(this, { [id]: mapped })

  }

  /**
   * Pulls a docker image locally so it can be run
   * Kubernetes pulls the image automatically, so this method is a NoOp
   * @member Docker
   */
  pull = async (imageRef:TImgRef) => {}

  /**
   * Similar to the kubernetes apply command from the kubectl cli
   * Will first create a pod manifest from the passed in imageRef
   * Then starts it, calling passed in hooks as needed
   * Returns a set of urls for connecting to the running pod
   * Generates a url for each exposed port
   * @member Kube
   */
  run = async (imageRef:TImgRef, runOpts:TRunOpts, userHash:string):Promise<TRouteMeta> => {
    if(this.devRouterActive) return this.routes[DevUserHash]

    const image = this.getImg(imageRef)
    !image && this.notFoundErr({ type: `image`, ref: imageRef as string })

    const { deployment, container } = image
    const { envs, restartPolicy } = container

    const nameRef = `${userHash}-${deployment}`
    const builtPorts = buildPorts(container as unknown as TPodContainer)
    const mappedPorts = buildPortMap(builtPorts)
    
    const podManifest = buildPodManifest({
      meta: {
        name: nameRef,
        namespace: this.config.namespace,
        labels: {
          [`app.kubernetes.io/name`]: `gobletqa-app`,
          [`app.kubernetes.io/component`]: deployment,
          [`app.kubernetes.io/managed-by`]: `goblet-conductor`,
        },
        annotations: {
          ...buildLabels(image, userHash),
          [PodAnnotations.component]: deployment,
          [PodAnnotations.ports]: JSON.stringify(mappedPorts)
        }
      },
      spec: {
        restart: ERestartPolicy[restartPolicy] || ERestartPolicy.OnFailure,
        containers: {
          [nameRef]: {
            envs,
            tty: true,
            stdin: true,
            ports: builtPorts,
            image: buildImgUri(image),
            pullPolicy: EImgPullPolicy.Always,
          }
        }
      }
    })

    // Call the method to start the container, but don't wait for it to finish
    // This way we can respond to the FE more quickly
    // While the container starts in the background
    await this.kubectl.createPod(podManifest)

    const routeMeta = generateRoutes({
      userHash,
      ports: mappedPorts,
      conductor: this.conductor,
      meta: {
        state: EContainerState.Creating,
      } as TContainerMeta
    })

    this.routes[userHash] = routeMeta

    return this.routes[userHash]
  }

  /**
   * Gets all containers from the Docker-Api
   * @member Kube
   */
  getAll = async ():Promise<TPod[]> => {
    return await this.kubectl.getPods()
  }

  /**
   * Gets a single container map from the Docker-Api by reference
   * @member Kube
   */
  get = async (podRef:TPodRef):Promise<TContainerMap> => {
    const id = isStr(podRef)
      ? podRef
      : (podRef as TContainerMap)?.id || (podRef as TPod)?.metadata?.name

    const pod = await this.kubectl.getPod(id) as TPod

    return buildContainerMap(pod, {})
  }

  /**
   * Removes a container from the runtime cache based on Id
   * @member Kube
   */
  removeFromCache = (pod:TPod, watchObj:TEventWatchObj) => {
    if(this.devRouterActive || !isObj(pod)) return

    const mapped = buildContainerMap(pod, {})
    Logger.info(`Removing pod ${mapped.name} from cache`)

    const userHash = mapped?.labels[ConductorUserHashLabel]
      || pod?.metadata?.annotations[ConductorUserHashLabel]

    this.#cleanup(mapped, { userHash })

  }

  /**
   * Removes a pod from kubernetes, by calling the kubectl API
   * @member Kube
   */
  remove = async (
    podRef:TPodRef,
    opts:TRemoveOpts=emptyObj
  ) => {
    if(this.devRouterActive) return

    const {
      userHash,
      throwOnEmpty=true,
      isContainerMap=false,
    } = opts

    const mapped = isContainerMap
      ? podRef as TContainerMap
      : this.getContainer(podRef)

    if(!mapped){
      this?.config?.onRemove?.(mapped)
      throwOnEmpty
        && this.notFoundErr({ type: `container`, ref: podRef as string })

      return mapped
    }

    await this.kubectl.deletePod(mapped.id)
    Logger.info(`Removing container with ID ${mapped.id}`)

    this.#cleanup(mapped, { userHash })

    return mapped
  }

  /**
   * Removes all Pods with the conductor label
   * @member Kube
   */
  removeAll = async () => {
    if(this.devRouterActive) return

    const pods = await this.getAll()
    const removed = await Promise.all(
      pods.map(async (pod) => {
        pod.metadata.annotations[ConductorUserHashLabel]
          && await this.kubectl.deletePod(pod.metadata.name)

        return pod
      })
    )

    return removed.filter(Boolean)
  }

  /**
   * TODO: Add kubernetes clean up methods
   * @member Kube
   */
  cleanup = async () => {
    if(this.devRouterActive) return

    Logger.warn(`Cleanup method not implemented for Kubernetes controller`)
    return undefined
  }

  /**
   * Sets up kubernetes API and starts listening for changes to Pods
   * @member Kube
   */
  validate = async (amount?:number, waitTime?:number) => {
    if(this.devRouterActive) return this.hydrateDevRouter()
    
    this.kubectl = new Kubectl(this.config)
    const hydrateSingle = this.hydrateSingle.bind(this)

    const timeout = this.config.listenerTimeout || 600000

    this.kubectl.cycleListen(timeout, {
      start: hydrateSingle,
      modified: hydrateSingle,
      destroy: this.removeFromCache.bind(this),
    })

    this.hydrate()
  }

}

