import { findRule } from '@GBR/utils/find'
import { omitKeys } from '@keg-hub/jsutils'
import { logNotFound } from '@GBR/utils/logging'
import { updateFeature } from '@GBR/actions/feature/updateFeature'
import { getFeature } from '@gobletqa/race/utils/features/getFeature'

const prefix = `[Remove Background]`
export const removeBackground = async (parentId:string) => {
  const { feature } = await getFeature()
  if(!feature) return logNotFound(`feature`, `[Remove Background]`)

  if(feature.uuid === parentId)
    return updateFeature(omitKeys(feature, [`background`]))

  if(!feature?.rules?.length)
    return logNotFound(`rule`, `[Remove Background]`)

  const {
    rule,
    rules,
    ruleIdx,
  } = findRule(feature, parentId)
  if(!rule) return logNotFound(`rule`, prefix)

  const { background, ...updated } = rule
  rules[ruleIdx as number] = updated

  updateFeature({...feature, rules})

}