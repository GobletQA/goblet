import type { TRaceFeature, TRaceBackground } from '@GBR/types'

import { findRule } from '@GBR/utils/find'
import { logNotFound, factoryFailed } from '@GBR/utils/logging'
import { updateFeature } from '@GBR/actions/feature/updateFeature'
import { backgroundFactory } from '@GBR/factories/backgroundFactory'
import { getFeature } from '@gobletqa/race/utils/features/getFeature'

export type TAddBackground = {
  parentId:string,
  feature?:TRaceFeature
  background?:TRaceBackground
}

const prefix = `[Add Background]`

const toRule = (
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

const toFeature = (
  feature:TRaceFeature,
  rBackground?:TRaceBackground
) => {

  const background = rBackground || backgroundFactory({feature, empty: true})
  if(!background) return factoryFailed(`background`, prefix)

  return updateFeature({...feature, background}, { expand: background.uuid })
}

export const addBackground = async (props:TAddBackground) => {
  const {
    parentId,
    background
  } = props

  const { feature } = await getFeature(props.feature)
  if(!feature) return logNotFound(`feature`, prefix)

  return !parentId || parentId === feature.uuid
    ? toFeature(feature, background)
    : toRule(feature, parentId, background)
}