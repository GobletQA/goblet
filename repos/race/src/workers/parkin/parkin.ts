/// <reference lib="webworker" />
declare const self: DedicatedWorkerGlobalScope;

import type { TRaceFeature } from '@GBR/types'
import type { TWorldConfig, TRegisterOrAddStep, TFeatureAst } from '@ltipton/parkin'

import { Parkin } from '@ltipton/parkin'
import { deepMerge } from '@keg-hub/jsutils'

export type TReIndexFeature = {
  feature:TRaceFeature
}

const PK  = new Parkin()

export const init = async (world?:TWorldConfig, steps?:TRegisterOrAddStep) => PK.init(world, steps, false)

export const getWorld = async () => PK.world
export const setWorld = async (world:TWorldConfig, merge?:boolean) => {
  PK.world = merge ? deepMerge<TWorldConfig>(PK.world, world) : world
}

export const registerSteps = async (steps:TRegisterOrAddStep) => PK.registerSteps(steps)

export const clearSteps = async () => PK?.steps?.clear?.()

export const parseFeature = async (
  text:string,
  world?:TWorldConfig,
) => PK.parse.feature(text, world || {$alias: {}} as TWorldConfig)


export const reIndex = async (options:TReIndexFeature) => {
  const { feature } = options

  const assembled = PK.assemble.feature([feature as TFeatureAst])[0]
  feature.content = assembled
  // `${assembled.trim()} \n`

  return feature
}