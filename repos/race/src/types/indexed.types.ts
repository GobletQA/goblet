import {
  TRaceAst,
  TRaceStep,
  TRaceRule,
  TRaceTags,
  TRaceBlock,
  TRaceFeature,
  TRaceScenario,
  TRaceStepParent,
  TRaceBackground,
  TRaceBlockParent,
  TRaceScenarioParent,
  TRaceBackgroundParent,
} from './features.types'

export type TRaceIndexParent = TRaceRule
  | TRaceScenario
  | TRaceFeature
  | TRaceBackground

export type TRaceIndexAst<T, P> = {
  ast: T
  parent:P
}

export type TRaceIndexRule = TRaceIndexAst<TRaceRule, TRaceFeature>
export type TRaceIndexTags = TRaceIndexAst<TRaceTags, TRaceBlockParent>
export type TRaceIndexStep = TRaceIndexAst<TRaceStep, TRaceStepParent>
export type TRaceIndexFeature = TRaceIndexAst<TRaceFeature, TRaceFeature>
export type TRaceIndexBlock = TRaceIndexAst<TRaceBlock, TRaceBlockParent>
export type TRaceIndexScenario = TRaceIndexAst<TRaceScenario, TRaceScenarioParent>
export type TRaceIndexBackground = TRaceIndexAst<TRaceBackground, TRaceBackgroundParent>

export type TRaceIndexItem = TRaceIndexTags
  | TRaceIndexRule
  | TRaceIndexStep
  | TRaceIndexFeature
  | TRaceIndexBlock
  | TRaceIndexScenario
  | TRaceIndexBackground

export type TRaceIndex = TRaceIndexItem[]


export type TPatchFeatureOpts = {
  child:TRaceAst
  childKey:string
  indexes?:TRaceIndex
  feature:TRaceFeature
  parent:TRaceIndexParent
}