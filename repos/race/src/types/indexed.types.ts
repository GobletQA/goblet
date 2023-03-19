import {
  TRaceAst,
  TRaceRule,
  TRaceFeature,
  TRaceScenario,
  TRaceBackground,
} from './features.types'
import type {
  TAstType,
  TIndexAst,
  TFeatureAst,
  TIndexParentAst,
} from '@ltipton/parkin'

export type TRaceIndexParent = TRaceRule
  | TRaceScenario
  | TRaceFeature
  | TRaceBackground

export type TRaceIndex = TIndexAst

export type TPatchFeatureOpts = {
  key:string
  child:TRaceAst | TAstType
  indexes?:TRaceIndex | TIndexAst
  feature:TRaceFeature | TFeatureAst
  parent:TRaceIndexParent | TIndexParentAst
}
