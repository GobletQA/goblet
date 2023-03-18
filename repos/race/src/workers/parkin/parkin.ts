// @ts-nocheck

/// <reference lib="webworker" />
declare const self: DedicatedWorkerGlobalScope;

import type { TPatchFeatureOpts, TRaceFeature } from '@GBR/types'
import type {
  TWorldConfig,
  TRegisterOrAddStep,
} from '@ltipton/parkin'

import { Parkin } from '@ltipton/parkin'
import { deepMerge } from '@keg-hub/jsutils'
import { patchIndexes } from '@gobletqa/race/utils/indexes/patchIndexes'

const PK  = new Parkin()

export const init = async (
  world?:TWorldConfig,
  steps?:TRegisterOrAddStep
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

export const patchFeature = async (options:TPatchFeatureOpts) => {
  return patchIndexes(options, PK)
}
