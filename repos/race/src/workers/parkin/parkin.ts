// @ts-nocheck

/// <reference lib="webworker" />
declare const self: DedicatedWorkerGlobalScope;

import type { TRaceFeature } from '@GBR/types'
import type {
  TWorldConfig,
  TRegisterOrAddStep,
  TRegisterStepsList,
} from '@ltipton/parkin'

import { Parkin } from '@ltipton/parkin'
import { deepMerge } from '@keg-hub/jsutils'

const PK  = new Parkin()

export const init = async (
  world?:TWorldConfig,
  steps?:TRegisterStepsList
) => PK.init(world, steps, false)

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
    ...PK.reIndex(merged, { empty: false, indexes: false }),
  } as TRaceFeature
}
