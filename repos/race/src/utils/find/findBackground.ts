import type { TRaceRule, TRaceFeature, TRaceBackground, TRaceBackgroundParent } from '@GBR/types'

import { ESectionType } from '@GBR/types'
import { emptyObj } from '@keg-hub/jsutils'
import { findFailed } from '@GBR/utils/logging/findFailed'

export type TFoundBackground = {
  rule?:TRaceRule
  ruleIdx?:number
  feature?:TRaceFeature
  background?:TRaceBackground
}

const fromParent = (
  feature:TRaceFeature,
  backgroundId:string,
  parent:TRaceBackgroundParent
) => {
  if(parent?.background?.uuid !== backgroundId)
    return findFailed<TFoundBackground>(emptyObj, `background`, `Feature or Rule`, parent)

  if(parent.type === ESectionType.feature)
    return { feature, background: {...feature.background}} as TFoundBackground

  const rule = feature?.rules?.find(rule => rule.uuid === parent.uuid)
  return rule
    ? {
        rule,
        ruleIdx: feature?.rules?.indexOf(rule),
        background: {...rule.background},
      } as TFoundBackground
    : findFailed<TFoundBackground>(
        emptyObj,
        `background`,
        `rule`,
        parent
      )
}

export const findBackground = (
  feature:TRaceFeature,
  backgroundId:string,
  parent?:TRaceBackgroundParent
) => {

  if(parent) return fromParent(feature, backgroundId, parent)

  if(feature?.background?.uuid === backgroundId)
    return { feature, background: {...feature.background} }

  return !feature?.rules?.length
    ? findFailed<TFoundBackground>(
        emptyObj,
        `background`,
        `Feature or Rule`,
        parent
      )
    : feature?.rules?.reduce((found, rule, index) => {
        return found.background || rule?.background?.uuid !== backgroundId
          ? found
          : {background: {...rule.background}, rule, ruleIdx: index }
      }, emptyObj as TFoundBackground)
}