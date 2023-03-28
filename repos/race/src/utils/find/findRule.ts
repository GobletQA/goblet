import type { TRaceRule, TRaceFeature } from '@GBR/types'

import { emptyObj, emptyArr } from '@keg-hub/jsutils'

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

  return {
    rule: {...rule},
    rules:[...(feature?.rules || emptyArr)],
    ruleIdx: feature?.rules?.indexOf(rule) as number,
  }

}