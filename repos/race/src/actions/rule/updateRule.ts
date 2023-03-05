import type { TRuleAst } from '@ltipton/parkin'

import { findRule } from '@GBR/utils/find'
import { updateFeature } from '@GBR/actions/feature/updateFeature'
import { getFeature } from '@gobletqa/race/utils/features/getFeature'
import { deepMerge } from '@keg-hub/jsutils'


export const updateRule = async (ruleId:string, update:Partial<TRuleAst>) => {
  if(!ruleId) return console.warn(`Can not update rule step without rule Id`)
  
  const feature = await getFeature()
  if(!feature) return

  const {
    rule,
    rules,
    ruleIdx
  } = findRule(feature, ruleId)
  if(!rule) return

  rules[ruleIdx] = deepMerge(rule, update)

  updateFeature({...feature, rules})
}