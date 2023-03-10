// @ts-nocheck

/// <reference lib="webworker" />
declare const self: DedicatedWorkerGlobalScope;

import type { TRaceFeature } from '@GBR/types'
import type {
  TParse,
  IAssemble,
  EStepType,
  TParkinRun,
  TParamTypes,
  TFeatureAst,
  TWorldConfig,
  TAddStepDefs,
  TRegisterOrAddStep,
  TRegisterStepsList,
  TRegisterStepMethod,
  TAssembleFeatureOpts,
} from '@ltipton/parkin'

import { Parkin } from '@ltipton/parkin'
import { deepMerge } from '@keg-hub/jsutils'

const PK  = new Parkin()

export const instance = {
  // world: (...args:any[]) => {
  //   const world = PK.world
  //   console.log(`------- world -------`)
  //   console.log(world)
  // },
  // reIndex: (...args:any[]) => PK.reIndex(...args),
  // registerSteps: (...args:any[]) => PK.registerSteps(...args),
  // assemble: (...args:any[]) => PK.assemble(...args),
  // matcher: (...args:any[]) => PK.matcher(...args),
  // parse: (...args:any[]) => PK.parse(...args),
  // steps:Steps
  // hooks:Hooks
  // parse:TParse
  // runner:Runner
  // run:TParkinRun
  // matcher:Matcher
  // world:TWorldConfig
  // assemble:IAssemble
  // paramTypes:TParamTypes
  // Given:TRegisterStepMethod
  // When:TRegisterStepMethod
  // Then:TRegisterStepMethod
  // And:TRegisterStepMethod
  // But:TRegisterStepMethod
  
}

export const init = async (
  world?:TWorldConfig,
  steps?:TRegisterStepsList
) => PK.init(world, steps)

export const getWorld = async () => PK.world
export const setWorld = async (world:TWorldConfig, merge?:boolean) => {
  PK.world = merge ? deepMerge<TWorldConfig>(PK.world, world) : world
}

export const registerSteps = async (steps:TRegisterOrAddStep) => PK.registerSteps(steps)

export const clearSteps = async () => PK?.steps?.clear?.()

export const parseFeature = async (
  text:string,
  world?:TWorldConfig,
) => PK.parse.feature(text, world)


export const updateFeature = async (
  updates?:Partial<TRaceFeature>,
  existing?:TRaceFeature,
  replace?:boolean
) => {

  const merged = replace
    ? updates as TRaceFeature
    : deepMerge<TRaceFeature>(existing, updates)

  return {
    uuid: merged.uuid,
    path: merged.path,
    parent: merged.parent,
    ...instance.reIndex(merged, { empty: false, indexes: false }),
  } as TRaceFeature
}
