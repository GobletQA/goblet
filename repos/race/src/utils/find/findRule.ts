import type { TRaceRule, TRaceFeature } from '@GBR/types'

import { emptyObj } from '@keg-hub/jsutils'

export type TFoundRule = {
  rule?:TRaceRule
  ruleIdx:number
  rules:TRaceRule[]
}

export const findRule = (
  feature:TRaceFeature,
  ruleId:string
) => {

  const rule = feature?.rules?.find(rule => rule.uuid === ruleId)
  if(!rule){
    console.warn(`Rule Id ${ruleId} could not be found`, feature, feature?.rules)
    return emptyObj as TFoundRule
  }

  const ruleIdx = feature?.rules?.indexOf(rule) as number
  const rules = [...(feature?.rules || []) ]

  return {
    rule,
    rules,
    ruleIdx,
  }

}