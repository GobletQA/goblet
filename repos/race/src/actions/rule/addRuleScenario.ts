
import { exists } from '@keg-hub/jsutils'
import { scenarioFactory } from '@GBR/factories/scenarioFactory'
import { updateFeature } from '@GBR/actions/feature/updateFeature'
import { getFeature } from '@gobletqa/race/utils/features/getFeature'

export const addRuleScenario = async (ruleId:string) => {

  const feature = await getFeature()
  if(!feature) console.warn(`Can not access feature context from 'addStory' action.`) 

  const rule = feature?.rules?.find(rule => rule.uuid === ruleId)
  if(!rule) return console.warn(`Rule with id ${ruleId} could not be found`, feature, ruleId)

  const ruleIdx = feature?.rules?.indexOf(rule)

  const rules = [...(feature?.rules || []) ]

  rules[ruleIdx as number] = {
    ...rule,
    scenarios: [
      ...rule.scenarios,
      scenarioFactory(undefined, true)
    ]
  }

  updateFeature({...feature, rules})

}