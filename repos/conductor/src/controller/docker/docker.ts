import type { Conductor } from '../../conductor'
import type { ContainerCreateOptions } from 'dockerode'
import {
  TImgRef,
  TRunOpts,
  TRouteMeta,
  TImgConfig,
  TImgsConfig,
  TDockerEvent,
  TContainerRef,
  TDockerConfig,
  TContainerData,
  TContainerInfo,
  TContainerInspect
} from '@gobletqa/conductor/types'

import Dockerode from 'dockerode'
import DockerEvents from 'docker-events'
import { isObj } from '@keg-hub/jsutils'
import { Controller } from '../controller'
import { docker } from '@keg-hub/cli-utils'
import { dockerEvents } from './dockerEvents'
import { buildImgUri } from './image/buildImgUri'
import { buildPorts } from './container/buildPorts'
import { Logger } from '@gobletqa/shared/libs/logger'
import { hydrateRoutes } from '../../utils/hydrateRoutes'
import { CONDUCTOR_USER_HASH_LABEL } from '../../constants'
import { waitRetry } from '@gobletqa/shared/utils/waitRetry'
import { containerConfig } from './container/containerConfig'
import { removeContainer } from './container/removeContainer'
import { generateRoutes, generateExternalUrls } from '../../utils/generators'
import { createContainer, startContainer } from './container/runContainerHelpers'

/**
 * Helper method to start a container, then update the docker instance metadata
 * Is called in the background, and should not stop process execution
 */
const containerStart = async (
  dockerInstance:Docker,
  image: TImgConfig,
  userHash:string,
  containerConf:ContainerCreateOptions
) => {
  // Create the container from the image
  const container = await createContainer(dockerInstance, image, containerConf)

  // Start the container that was just created
  const containerInspect = await startContainer(image, container)

  // If not running in Kubernetes need to loop over the routes
  // Then replace the host of each with the container IP address
  // resolveIp(containerInspect)

  dockerInstance.routes[userHash] = {
    ...dockerInstance.routes[userHash],
    meta: {
      state: `Running`,
      id: containerInspect.Id,
      name: containerInspect.Name,
    }
  }
}

/**
 * Docker controller class with interfacing with the Docker-Api via Dockerode
 * Matches the Controller class interface
 */
export class Docker extends Controller {

  docker: Dockerode
  images: TImgsConfig
  conductor: Conductor
  config: TDockerConfig
  events: DockerEvents

  constructor(conductor:Conductor, config:TDockerConfig){
    super(conductor, config)
    this.config = config
  }

  hydrateSingle = async (message:TDockerEvent) => {
    Logger.info(`Hydrating container ${message?.Actor?.Attributes?.name} from start event`)

    const id = message?.id as string
    const containerInspect = await this.docker.getContainer(id).inspect() as TContainerInspect
    this.containers[id] = containerInspect

    hydrateRoutes(this, { [id]: containerInspect })
  }

  /**
   * Gets all running containers and rebuilds the runtime cache and routes
   * Allows starting / restarting conductor at anytime and it still works
   * @member Docker
   */
  hydrate = async ():Promise<Record<string, TContainerInspect>> => {
    const containers = await this.getAll()
    
    const imgNames = Object.keys(this.conductor.config.images)

    this.containers = await containers.reduce(async (toResolve, container) => {
      const acc = await toResolve

      // Check if there's an existing container that's owned by goblet
      // But missing the correct user hash. If there is, then remove it
      if(!container.Labels[CONDUCTOR_USER_HASH_LABEL]){
        const fromGoblet = Object.keys(container.Labels).find((label:string) => imgNames.includes(label))
        fromGoblet && removeContainer(this.docker.getContainer(container.Id))
        return acc
      }

      // Any container not running always just remove it
      // The user can't access it anyways
      if(container.State !== 'running'){
        removeContainer(this.docker.getContainer(container.Id))
        return acc
      }

      acc[container.Id] = await this.docker.getContainer(container.Id).inspect()

      return acc
    }, Promise.resolve({}))

    const hydrateCount = Object.keys(this.containers).length
    hydrateCount && Logger.info(`Hydrating ${hydrateCount} container(s) into runtime cache`)

    hydrateRoutes(this, this.containers as Record<string, TContainerInspect>)

    return this.containers as Record<string, TContainerInspect>
  }

  /**
   * Pulls a docker image locally so it can be run
   * @member Docker
   */
  pull = async (imageRef:TImgRef) => {
    const intervalId = setInterval(() => Logger.info(`Still pulling...`), 3000)

    return new Promise(async (res, rej) => {
      const image = this.getImg(imageRef)
      !image && this.notFoundErr({ type: `image`, ref: imageRef as string })

      const imgUri = buildImgUri(image)
      Logger.info(`Pulling image ${imgUri}...`)

      const { error, data, exitCode } = await docker(
        [`pull`, imgUri],
        { envs: process.env, exec: true }
      )

      clearInterval(intervalId)

      error || exitCode
        ? rej(`Error pulling image ${imgUri}. Command failed with exit code ${exitCode}`)
        : res({ data })
    })
  }

  /**
   * Gets all containers from the Docker-Api
   * @member Docker
   */
  getAll = async ():Promise<TContainerInfo[]> => {
    return new Promise((res, rej) => {
      this.docker.listContainers({ all: true }, (err, containers) => {
        err ? rej(err) : res(containers.map(container => ({ ...container, Name: container.Names[0] })))
      })
    })
  }

  /**
   * Removes a container from the runtime cache based on Id
   * @member Docker
   */
  removeFromCache = (message:TDockerEvent) => {
    Logger.info(`Removing container ${message?.Actor?.Attributes?.name} from cache`)

    this.containers = Object.entries(this.containers)
      .reduce((acc, [ref, container]:[string, TContainerData]) => {
        isObj(message)
          && message?.id !== container.Id
          && (acc[ref] = container)
        return acc
      }, {})

      const userHash = message?.Actor?.Attributes[CONDUCTOR_USER_HASH_LABEL]
      delete this.routes[userHash]
  }

  /**
   * Removes a container from docker, by calling the Docker API
   */
  remove = async (containerRef:TContainerRef) => {
    const containerData = this.getContainer(containerRef)
    !containerData && this.notFoundErr({ type: `container`, ref: containerRef as string })

    const cont = await this.docker.getContainer(containerData.Id)

    Logger.info(`Removing container with ID ${cont.id}`)
    removeContainer(cont)

    this.containers = Object.entries(this.containers)
      .reduce((acc, [ref, cont]:[string, TContainerData]) => {
        cont.Id !== containerData.Id && (acc[ref] = cont)

        return acc
      }, {})

    Logger.success(`Container removed successfully`)
    return cont
  }

  /**
   * Removes all containers with the conductor label
   * @member Docker
   */
  removeAll = async () => {
    const containers = await this.getAll()
    const removed = await Promise.all(
      containers.map(container => {
        if(container.Labels[CONDUCTOR_USER_HASH_LABEL]){
          const cont = this.docker.getContainer(container.Id)
          cont && removeContainer(cont)

          return container
        }
      })
    )

    return removed.filter(Boolean)
  }

  /**
   * Calls Docker Prune api on containers, images, and volumes
   * @member Docker
   */
  cleanup = async () => {
    return new Promise(async (res, rej) => {
      try {
        // TODO: figure out if these take a callback
        await this.docker.pruneContainers()
        await this.docker.pruneImages()
        await this.docker.pruneVolumes()
        res(true)
      }
      catch(err){
        rej(err)
      }
    })
  }

  /**
   * Similar to the docker run command from the docker cli
   * Will first create a container from the passed in imageRef
   * Then starts it, calling passed in hooks as needed 
   * Returns a set of urls for connecting to the running container
   * Generates a url for each exposed port
   * @member Docker
   */
  run = async (
    imageRef:TImgRef,
    runOpts:TRunOpts,
    userHash:string
  ):Promise<TRouteMeta> => {
    const image = this.getImg(imageRef)
    !image && this.notFoundErr({ type: `image`, ref: imageRef as string })

    // Build the container ports and container create config 
    const portData = await buildPorts(image)
    const urls = generateExternalUrls(portData.ports, userHash, this.conductor)
    
    const containerConf = await containerConfig(
      this,
      image,
      userHash,
      runOpts,
      portData,
      urls
    )

    // Generate the urls for accessing the container
    Logger.info(`Generating container urls...`)
    const routeMeta = generateRoutes(
      portData.ports,
      this.conductor,
      userHash,
      { state: `Creating` }
    )
    this.routes[userHash] = routeMeta

    // Call the method to start the container, but don't wait for it to finish
    // This way we can respond to the FE more quickly
    // While the container starts in the background
    containerStart(this, image, userHash, containerConf)

    return this.routes[userHash]
  }

  /**
   * Connection back off helper for connecting to docker's api
   * Sometimes the docker container is not complete by the time this kicks off
   */
  validate = async (attempts=3, waitTime=3000) => {
    await waitRetry((attempt) => {
      Logger.info(`Attempt ${attempt}: connecting to Docker Api`)

      this.docker = new Dockerode(this.config?.options)

    }, attempts, waitTime)

    // We should only get here if the waitRetry doesn't throw
    // This way we know it's connected to the docker api

    this.events = dockerEvents(this.docker, {
      die: this.removeFromCache,
      start: this.hydrateSingle
    })

    this.hydrate()
  }
 
}