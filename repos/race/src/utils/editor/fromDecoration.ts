import type { TRaceDeco, TRaceFeature } from "@GBR/types"
import type {
  TStepAst,
  TRuleAst,
  TAstType,
  TScenarioAst,
  TStepParentAst,
  TBackgroundAst,
} from '@ltipton/parkin'

import { emptyArr } from "@keg-hub/jsutils"
import { EAstObject } from '@ltipton/parkin'


export type TIDFrom = {
  parent?:TStepParentAst
  deco:TRaceDeco
  feature:TRaceFeature
  cache:Record<string, TAstType>
}

type TFindChild = Record<`uuid`, string>

const findStep = (
  steps:TStepAst[],
  text:string
) => {
  return steps?.length
    ? steps?.find?.(step => ( text.endsWith(step?.step?.trim?.())))
    : undefined
}

const findParentStep = (
  parents:Array<TStepParentAst>,
  text:string
) => {
  return parents?.length
    ? parents?.reduce?.((found:TStepAst|undefined, parent) => {
        return !found && parent?.steps?.length
          ? findStep(parent?.steps, text)
          : found
      }, undefined)
    : undefined
}

const findChild = <T extends TFindChild>(
  children:T[],
  key:keyof T,
  text:string
) => (
  children?.length
    ? children?.find?.(child => (child[key] as string)?.trim?.() === text)
    : undefined
)

const findRuleBackground = (
  children:TRuleAst[]=emptyArr,
  text:string
) => (
  children?.length
    ? children?.find?.(child => (child?.background?.background?.trim?.() === text))?.background
    : undefined
)


const findRuleScenario = (
  children:TRuleAst[]=emptyArr,
  text:string
) => (
  children?.length
    ? children?.reduce?.((found:TScenarioAst|undefined, child) => {
        return !found && child?.scenarios?.length
          ? findChild<TScenarioAst>(child?.scenarios, `scenario`, text)
          : found
      }, undefined)
    : undefined
)

const IDFinders = {
  [EAstObject.feature]: (props:TIDFrom) => {
    const { deco, feature } = props
    const text = deco.search.trim()

    return feature.feature?.trim() === text
      ? feature
      : undefined
  },
  [EAstObject.rule]: (props:TIDFrom) => {
    const { deco, feature } = props
    const text = deco.search.trim()

    return feature?.rules?.length
      ? findChild<TRuleAst>(feature?.rules, `rule`, text)
      : undefined
  },
  [EAstObject.background]: (props:TIDFrom) => {
    const { deco, feature } = props
    const text = deco.search.trim()

    return feature.background?.background?.trim() === text
      ? feature.background
      : findRuleBackground(feature?.rules, text)
  },
  [EAstObject.scenario]: (props:TIDFrom) => {
    const { deco, feature, parent } = props
    const text = deco.search.trim()

    return feature?.scenarios?.length
      ? findChild<TScenarioAst>(feature?.scenarios, `scenario`, text)
      : findRuleScenario(feature?.rules, text)
  },
  [EAstObject.step]: (props:TIDFrom) => {
    const { deco, feature, parent } = props
    const text = deco.search.trim()

    const parents = parent?.steps?.length
      ? [parent]
      : [
          feature?.background,
          ...(feature?.scenarios || emptyArr),
          ...(feature?.rules || emptyArr)?.reduce((acc, rule) => {
            acc.push(...([rule?.background, ...rule?.scenarios]))
            return acc
          }, [])
        ].filter(Boolean) as Array<TStepParentAst>
    
    return findParentStep(parents, text)
  },
}


export const fromDecoration = (props:TIDFrom) => {
  const type = props.deco.type as keyof typeof IDFinders
  return IDFinders[type]?.(props)
}