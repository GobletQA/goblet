/// <reference lib="webworker" />
declare const self: DedicatedWorkerGlobalScope;

import type {
  TAudit,
  TGBWorldCfg,
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

let __PK:Parkin|undefined

export const init = async (world?:TGBWorldCfg, steps?:TRegisterOrAddStep) => {
  const PK = initPK()
  PK.init(world, steps, false)
}

const initPK = () => {
  __PK = __PK || new Parkin()
  return __PK
}

export const reset = () => {
  if(!__PK) return
  __PK.steps.clear()
  // @ts-ignore
  __PK.world = undefined
  // @ts-ignore
  __PK.steps = undefined
  // @ts-ignore
  __PK.hooks = undefined
  // @ts-ignore
  __PK.matcher = undefined
  // @ts-ignore
  __PK.runner = undefined
  __PK = undefined
}

export const getWorld = async () => {
  const PK = initPK()
  return PK.world
}
export const setWorld = async (world:TGBWorldCfg, replace?:boolean) => {
  const PK = initPK()
  PK.world = replace ? world : deepMerge<TGBWorldCfg>(PK.world, world)

  return PK.world
}


export const registerSteps = async (steps:TRegisterOrAddStep) => {
  const PK = initPK()
  PK.registerSteps(steps)
}

export const clearSteps = async () => {
  const PK = initPK()
  PK.steps?.clear?.()
}

export const parseFeature = async (
  text:string,
  world?:TGBWorldCfg,
) => {
  const PK = initPK()
  PK.parse.feature(text, world || {$alias: {}} as TGBWorldCfg, { worldReplace: false })
}

export const reIndex = async (options:TReIndexFeature) => {
  const { feature } = options

  const PK = initPK()
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
  const PK = initPK()
  const audit = featureAudit({
    parkin: PK,
    feature: options.feature
  })

  return audit as TAudit
}

/**
 * Is used in the factories methods except for the buildSimpleScenario
 */
export const findIndex = async (props:TFindIndex) => {
  const PK = initPK()
  return PK.assemble.findIndex({
    ...props,
    parent: props.parent as TParentAst,
    feature: props.feature as TFeatureAst,
  })
}