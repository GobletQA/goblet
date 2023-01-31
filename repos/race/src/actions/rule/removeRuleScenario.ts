import { scenarioFactory } from '@GBR/factories/scenarioFactory'
import { updateFeature } from '@GBR/actions/feature/updateFeature'
import { getFeature } from '@gobletqa/race/utils/features/getFeature'

export const removeRuleScenario = async (
  scenarioId:string,
  parentId:string
) => {

  const feature = await getFeature()
  if(!feature) console.warn(`Can not access feature context from 'addStory' action.`) 

  const rule = feature?.rules?.find(rule => rule.uuid === parentId)
  if(!rule) return console.warn(`Rule with id ${parentId} could not be found`, feature, feature?.rules)

  const ruleIdx = feature?.rules?.indexOf(rule)

  const rules = [...(feature?.rules || []) ]

  console.log(`------- removeRuleScenario -------`)
  console.log(rule)
  console.log(`------- scenarioId -------`)
  console.log(scenarioId)

  // rules[ruleIdx] = {
  //   ...rule,
  //   scenarios: [
  //     ...rule.scenarios,
  //     scenarioFactory(undefined, true)
  //   ]
  // }

  // updateFeature({...feature, rules})

}