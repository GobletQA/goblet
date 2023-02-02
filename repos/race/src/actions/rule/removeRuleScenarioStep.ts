import { updateFeature } from '@GBR/actions/feature/updateFeature'
import { getFeature } from '@gobletqa/race/utils/features/getFeature'

export const removeRuleScenarioStep = async (
  stepId:string,
  scenarioId?:string,
  ruleId?:string
) => {

  const feature = await getFeature()
  if(!feature) console.warn(`Can not access feature context from 'addStory' action.`) 

  console.log(`------- TOOD - Fix me -------`)
  // const rule = feature?.rules?.find(rule => rule.uuid === parentId)
  // if(!rule) return console.warn(`Rule with id ${parentId} could not be found`, feature, feature?.rules)

  // const ruleIdx = feature?.rules?.indexOf(rule)
  // const rules = [...(feature?.rules || []) ]

  // rules[ruleIdx as number] = {
  //   ...rule,
  //   scenarios: rule.scenarios.filter(scenario => scenario.uuid !== scenarioId)
  // }

  // updateFeature({...feature, rules})

}