import { updateFeature } from '@GBR/actions/feature/updateFeature'
import { getFeature } from '@gobletqa/race/utils/features/getFeature'

export const removeRule = async (ruleId:string) => {
  const { feature } = await getFeature()
  if(!feature) return

  const rules = feature?.rules?.filter(rule => rule.uuid !== ruleId)
  updateFeature({...feature, rules})
}