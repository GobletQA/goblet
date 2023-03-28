import type { TRaceFeature, TRaceBackground } from '@GBR/types'

import { findRule } from '@GBR/utils/find'
import { logNotFound, factoryFailed } from '@GBR/utils/logging'
import { updateFeature } from '@GBR/actions/feature/updateFeature'
import { backgroundFactory } from '@GBR/factories/backgroundFactory'
import { getFeature } from '@gobletqa/race/utils/features/getFeature'

export type TAddBackground = {
  parentId:string,
  background?:TRaceBackground
}

const prefix = `[Add Background]`

const addToFeature = (
  feature:TRaceFeature,
  rBackground?:TRaceBackground
) => {

  const background = rBackground || backgroundFactory({feature, empty: true})
  if(!background) return factoryFailed(`background`, prefix)

  return updateFeature({...feature, background}, { expand: background.uuid })
}

const addToRule = (
  feature:TRaceFeature,
  ruleId:string,
  addBackground?:TRaceBackground
) => {

  const {
    rule,
    rules,
    ruleIdx,
  } = findRule(feature, ruleId)
  if(!rule) return logNotFound(`Rule ${ruleId}`, prefix)

  const background = addBackground
    || backgroundFactory({
        feature,
        empty: true,
        parent: rule,
        background: rule?.background
      })

  if(!background) return factoryFailed(`background`, prefix)

  rules[ruleIdx as number] = {
    ...rule,
    background: background
  }

  return updateFeature({...feature, rules}, { expand: background.uuid })
}


export const addBackground = async ({
  parentId,
  background
}:TAddBackground) => {
  const { feature } = await getFeature()
  if(!feature) return logNotFound(`feature`, prefix)

  return feature.uuid === parentId
    ? addToFeature(feature, background)
    : addToRule(feature, parentId, background)
}