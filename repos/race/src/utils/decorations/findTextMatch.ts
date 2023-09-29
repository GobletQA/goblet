import type { TRaceDeco, TRaceFeature } from "@GBR/types"
import type {
  TRuleAst,
  TAstType,
  TParentAst,
  TScenarioAst,
  TStepParentAst,
  TScenarioParentAst,
  TBackgroundParentAst,
} from '@ltipton/parkin'

import { EAstObject } from '@ltipton/parkin'
import { findInFeature } from './findInFeature'
import {
  findChild,
  findParentStep,
  findRuleScenario,
  findRuleBackground
} from './textMatchers'

export type TIDFrom = {
  parent?:TParentAst
  deco:TRaceDeco
  feature:TRaceFeature
  cache:Record<string, TAstType>
}

const parents = [
  EAstObject.rule,
  EAstObject.scenario,
  EAstObject.background,
]
const steps = [
  EAstObject.given,
  EAstObject.when,
  EAstObject.then,
  EAstObject.and,
  EAstObject.but,
]


const IDFinders = {

  /**
   * Methods called when the decoration event type is for the feature
   */
  [EAstObject.feature]: (props:TIDFrom, text:string) => {
    const { feature } = props

    return feature.feature?.trim() === text
      ? feature
      : undefined
  },

  /**
   * Methods called when the decoration event type is for a rule
   */
  [EAstObject.rule]: (props:TIDFrom, text:string) => {
    const { feature } = props

    return feature?.rules?.length
      ? findChild<TRuleAst>(feature?.rules, `rule`, text)
      : undefined
  },

  /**
   * Methods called when the decoration event type is for a background
   * Uses the parent to focus the search
   * If not found, then search all background parents for a background matching the text
   */
  [EAstObject.background]: (props:TIDFrom, text:string) => {
    const { feature, parent } = props

    if((parent as TBackgroundParentAst)?.background?.background?.trim() === text)
      return (parent as TBackgroundParentAst)?.background

    return feature.background?.background?.trim() === text
      ? feature.background
      : findRuleBackground(feature?.rules, text)
  },

  /**
   * Methods called when the decoration event type is for a scenario
   * Uses the parent to focus the search
   * If not found, then search all scenario parents for a scenario matching the text
   */
  [EAstObject.scenario]: (props:TIDFrom, text:string) => {
    const { feature, parent } = props

    const fromParent = (parent as TScenarioParentAst)?.scenarios?.length
      && findChild<TScenarioAst>((parent as TScenarioParentAst)?.scenarios, `scenario`, text)
    
    if(fromParent) return fromParent

    const fromFeature = feature?.scenarios?.length
      && findChild<TScenarioAst>(feature?.scenarios, `scenario`, text)

    return fromFeature || (feature?.rules?.length && findRuleScenario(feature?.rules, text))
  },

  /**
   * Methods called when the decoration event type is for a step
   * Uses the parent to focus the search
   * If not found, then search all step parents for a step matching the text
   */
  [EAstObject.step]: (props:TIDFrom, text:string) => {
    const { feature, parent } = props

    const found = (parent as TStepParentAst)?.steps?.length
      && findParentStep([parent] as Array<TStepParentAst>, text)
    
    if(found) return found

    /**
     * Gets all backgrounds and scenarios from the features and feature.rules
     * Then joins them together into an array of step parents
     * Which is then used to search for matching step.step text
     */
    const stepParents = [
      feature?.background,
      ...(feature?.scenarios || []),

      ...(feature?.rules || [])?.reduce((acc:TStepParentAst[], rule:TRuleAst) => {
        acc.push(...([rule?.background, ...rule?.scenarios] as TStepParentAst[]))
        return acc
      }, [] as Array<TStepParentAst>)
    ].filter(Boolean) as Array<TStepParentAst>

    return findParentStep(stepParents, text)
  },
}

export const findTextMatch = (props:TIDFrom) => {
  const { deco, feature } = props
  if(!deco) return

  if(deco?.type !== EAstObject.feature && deco?.metaId){
    const found = findInFeature({ id: deco?.id, feature })
    if(found) return found
  }

  const text = props?.deco?.search?.trim()
  if(!text) return undefined

  const type = props?.deco?.type as keyof typeof IDFinders
  return IDFinders[type]?.(props, text)
}