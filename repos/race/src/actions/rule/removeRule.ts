import { logNotFound } from '@GBR/utils/logging'
import { updateFeature } from '@GBR/actions/feature/updateFeature'
import { getFeature } from '@gobletqa/race/utils/features/getFeature'

export const removeRule = async (ruleId:string) => {
  const { feature } = await getFeature()
  if(!feature) return logNotFound(`feature`, `[Remove Rule]`)

  const rules = feature?.rules?.filter(rule => rule.uuid !== ruleId)
  updateFeature({...feature, rules})
}