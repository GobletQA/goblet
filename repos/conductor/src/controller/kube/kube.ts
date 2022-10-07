import type { Request } from 'express'
import type { Conductor } from '../../conductor'
import { Controller } from '../controller'
import {
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
  TContainerInspect
} from '@gobletqa/conductor/types'
import { isObj, omitKeys, isEmptyColl } from '@keg-hub/jsutils'

/**
 * Docker controller class with interfacing with the Docker-Api via Dockerode
 * Matches the Controller class interface
 */
export class Kube extends Controller {

  
  devRouterActive: boolean

  constructor(conductor:Conductor, config:TKubeController){
    super(conductor, config)
    this.config = config
    this.devRouterActive = !isEmptyColl(this.config.devRouter)

  }

  hydrate = async ():Promise<Record<string, TContainerInspect>> => {
    
    return 
  }

  hydrateSingle = async (data:any) => {
    return undefined
  }

  pull = async (imageRef:TImgRef) => {
    return undefined
  }

  run = async (imageRef:TImgRef, runOpts:TRunOpts, userHash:string):Promise<TRouteMeta> => {
    return undefined
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
    return undefined
  }

  getRoute = (req:Request):TContainerRoute => {
    return undefined
  }


}

