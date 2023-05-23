import type {
  TStepAst,
  TRuleAst,
  TScenarioAst,
  TStepParentAst,
} from '@ltipton/parkin'

import { emptyArr } from "@keg-hub/jsutils"

type TFindChild = Record<`uuid`, string>

export const findStep = (
  steps:TStepAst[],
  text:string
) => {
  return steps?.length
    ? steps?.find?.(step => ( text.endsWith(step?.step?.trim?.())))
    : undefined
}

export const findParentStep = (
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

export const findChild = <T extends TFindChild>(
  children:T[],
  key:keyof T,
  text:string
) => (
  children?.length
    ? children?.find?.(child => (child[key] as string)?.trim?.() === text)
    : undefined
)

export const findRuleBackground = (
  children:TRuleAst[]=emptyArr,
  text:string
) => (
  children?.length
    ? children?.find?.(child => (child?.background?.background?.trim?.() === text))?.background
    : undefined
)

export const findRuleScenario = (
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
