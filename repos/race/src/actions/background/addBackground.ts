import type { TRaceFeature, TRaceBackground } from '@GBR/types'

import { findRule } from '@GBR/utils/find'
import { logNotFound, factoryFailed } from '@GBR/utils/logging'
import { updateFeature } from '@GBR/actions/feature/updateFeature'
import { backgroundFactory } from '@GBR/factories/backgroundFactory'
import { getFeature } from '@gobletqa/race/utils/features/getFeature'

export type TAddBackground = {
  parentId:string,
  persist?:Boolean
  feature?:TRaceFeature
  background?:TRaceBackground
}

const prefix = `[Add Background]`

const toRule = async (
  props:TAddBackground,
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
    || await backgroundFactory({
        feature,
        empty: true,
        parent: rule,
        background: rule?.background
      })

  if(!background) return factoryFailed(`background`, prefix)

  rules[ruleIdx as number] = {...rule, background: background}

  const update = {...feature, rules}
  props.persist !== false && updateFeature(update, { expand: background.uuid, skipAudit: false })

  return update
}

const toFeature = async (
  props:TAddBackground,
  feature:TRaceFeature,
  addBackground?:TRaceBackground
) => {

  const background = addBackground || await backgroundFactory({feature, empty: true})
  if(!background) return factoryFailed(`background`, prefix)

  const update = {...feature, background}
  props.persist !== false && updateFeature(update, { expand: background.uuid, skipAudit: false })

  return update
}

export const addBackground = async (props:TAddBackground) => {
  const {
    parentId,
    background
  } = props

  const { feature } = await getFeature(props.feature)
  if(!feature) return logNotFound(`feature`, prefix)

  return !parentId || parentId === feature.uuid
    ? await toFeature(props, feature, background)
    : await toRule(props, feature, parentId, background)
}