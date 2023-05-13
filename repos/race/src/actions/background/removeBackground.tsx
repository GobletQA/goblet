import type { TRaceFeature, TRaceRule, TRaceBackground } from '@GBR/types'

import { findRule } from '@GBR/utils/find'
import { omitKeys } from '@keg-hub/jsutils'
import { RedText } from '@gobletqa/components'
import { logNotFound } from '@GBR/utils/logging'
import { openYesNo } from '@GBR/actions/general/toggleConfirm'
import { updateFeature } from '@GBR/actions/feature/updateFeature'
import { getFeature } from '@gobletqa/race/utils/features/getFeature'

const prefix = `[Remove Background]`

export type TRemoveBackground = {
  parentId:string
  persist?:Boolean
  feature?:TRaceFeature
}

const toRule = (
  props:TRemoveBackground,
  feature:TRaceFeature,
  rules?:TRaceRule[],
  rule?:TRaceRule,
  ruleIdx?:number
) => {
  const { persist } = props

  if(!rule || !rules) return logNotFound(`rule`, prefix)

  const { background, ...updated } = rule
  rules[ruleIdx as number] = updated

  const update = {...feature, rules}
  persist !== false &&  updateFeature(update, { removeAuditSteps: true })

  return update
}

const toFeature = (feature:TRaceFeature) => updateFeature(omitKeys(feature, [`background`]))

export const removeBackground = async (props:TRemoveBackground) => {
  const { parentId, persist } = props

  const { feature } = await getFeature(props.feature)
  if(!feature) return logNotFound(`feature`, prefix)

  let background:TRaceBackground|undefined

  const {
      rule,
      rules,
      ruleIdx,
    } = feature.uuid === parentId
      ? { rule: undefined, rules:undefined, ruleIdx:undefined }
      : findRule(feature, parentId)
  
  if(feature.uuid === parentId)
    background = feature.background
  else {
    if(!rule) return logNotFound(`rule`, prefix)
    background = rule.background
  }

  return !background
    ? logNotFound(`background`, prefix)
    : new Promise(async (res) => {
        openYesNo({
          title: `Delete ${background?.background}`,
          text: (
            <>
              Are you sure your want to delete background <b><RedText>{background?.background}</RedText></b>?
            </>
          ),
          yes: {
            onClick: () => {
              const updated = feature.uuid === parentId
                ? toFeature(feature)
                : toRule(props, feature, rules, rule, ruleIdx)
              
              res(updated)
            }
          }
        })
      })
}