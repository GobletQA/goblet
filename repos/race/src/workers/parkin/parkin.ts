/// <reference lib="webworker" />
declare const self: DedicatedWorkerGlobalScope;

import type {
  TAudit,
  TRaceFeature,
  TAuditFeature,
  TRaceParentAst,
} from '@GBR/types'

import type {
  EBlockLoc,
  EStepType,
  EAstObject,
  TParentAst,
  TFeatureAst,
  TWorldConfig,
  TRegisterOrAddStep,
} from '@ltipton/parkin'

import { Parkin } from '@ltipton/parkin'
import { deepMerge } from '@keg-hub/jsutils'
import { auditFeature as featureAudit } from './audit'

export type TFindIndex = {
  loc?:EBlockLoc|string
  type:EAstObject|EStepType
  parent:TParentAst|TRaceParentAst
  feature:TFeatureAst|TRaceFeature
}

export type TReIndexFeature = {
  feature:TRaceFeature
}

const PK  = new Parkin()

export const init = async (world?:TWorldConfig, steps?:TRegisterOrAddStep) => {
  PK.init(world, steps, false)
}

export const getWorld = async () => PK.world
export const setWorld = async (world:TWorldConfig, replace?:boolean) => {
  PK.world = replace ? world : deepMerge<TWorldConfig>(PK.world, world)
}

export const registerSteps = async (steps:TRegisterOrAddStep) => PK.registerSteps(steps)

export const clearSteps = async () => PK?.steps?.clear?.()

export const parseFeature = async (
  text:string,
  world?:TWorldConfig,
) => PK.parse.feature(text, world || {$alias: {}} as TWorldConfig)

export const reIndex = async (options:TReIndexFeature) => {
  const { feature } = options

  const [assembled] = PK.assemble.feature(feature as TFeatureAst, {
    removeEmpty: true,
    emptyAfterSteps: true,
    emptyAfterStory: true,
    backgroundAfterParent: true
  })

  feature.content = assembled

  return feature
}

export const auditFeature = async (options:TAuditFeature) => {
  const audit = featureAudit({
    parkin: PK,
    feature: options.feature
  })

  return audit as TAudit
}

/**
 * TODO: not currently be used, but should be
 * Eventually want to update all calls to parkin
 * So that they use the worker version only
 * Will need to replace race/src/utils/find/findIndex with this
 *
 * Is used in the factories, but they are all sync, and this method is async
 * Which means they all need to be updated, and all call sites as well
 */
export const findIndex = async (props:TFindIndex) => {
  return PK.assemble.findIndex({
    ...props,
    parent: props.parent as TParentAst,
    feature: props.feature as TFeatureAst,
  })
}