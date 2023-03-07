import type { TBackgroundAst } from '@ltipton/parkin'

import { findRule } from '@GBR/utils/find'
import { backgroundFactory } from '@GBR/factories/backgroundFactory'
import { updateFeature } from '@GBR/actions/feature/updateFeature'
import { getFeature } from '@gobletqa/race/utils/features/getFeature'

export const addRuleBackground = async (ruleId:string) => {

  const feature = await getFeature()
  if(!feature) return

  const {
    rule,
    rules,
    ruleIdx,
  } = findRule(feature, ruleId)
  if(!rule) return

  rules[ruleIdx as number] = {
    ...rule,
    background: {
      ...rule?.background,
      ...backgroundFactory({empty: true})
    } as TBackgroundAst
  }

  updateFeature({...feature, rules})

}