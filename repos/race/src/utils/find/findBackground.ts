import type { TRaceRule, TRaceFeature, TRaceBackgroundParent, TRaceBackground } from '@GBR/types'
import { emptyObj } from '@keg-hub/jsutils'

export type TFoundBackground = {
  index?:number
  rule?:TRaceRule
  feature?:TRaceFeature
  background?:TRaceBackground
}

export const findBackground = (
  backgroundId:string,
  feature:TRaceFeature
) => {
  if(feature?.background && feature.background?.uuid === backgroundId)
    return {
      feature: feature,
      background: {...feature.background},
    } as TFoundBackground

  if(!feature?.rules?.length) return emptyObj as TFoundBackground
  
  return feature?.rules?.reduce((found, rule, index) => {
    return found.background || !rule?.background || rule?.background?.uuid !== backgroundId
      ? found
      : {background: {...rule.background}, rule, index}
  }, emptyObj as TFoundBackground)
}