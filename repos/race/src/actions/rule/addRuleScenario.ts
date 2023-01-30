import { ruleFactory } from '@GBR/factories/ruleFactory'
import { updateFeature } from '@GBR/actions/feature/updateFeature'
import { getFeature } from '@gobletqa/race/utils/features/getFeature'

export const addRuleScenario = async () => {
  const { feature } = await getFeature()
  if(!feature) console.warn(`Can not access feature context from 'addStory' action.`) 

  console.log(`------- addRuleScenario -------`)
  // const rule = ruleFactory(undefined, true)
  // const rules = [...(feature.rules || [])]
  // rule && rules.push(rule)

  // updateFeature({...feature, rules}, true)
}