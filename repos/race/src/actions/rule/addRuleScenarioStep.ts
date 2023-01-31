
import { stepFactory } from '@GBR/factories/stepFactory'
import { updateFeature } from '@GBR/actions/feature/updateFeature'
import { getFeature } from '@gobletqa/race/utils/features/getFeature'

export const addRuleScenarioStep = async (
  scenarioId:string,
  ruleId:string
) => {
  const feature = await getFeature()
  if(!feature) console.warn(`Can not access feature context from 'addStory' action.`) 

  const rule = feature?.rules?.find(rule => rule.uuid === ruleId)
  if(!rule) return console.warn(`Rule with id ${ruleId} could not be found`, feature, ruleId)

  const ruleIdx = feature?.rules?.indexOf(rule)
  const rules = [...(feature?.rules || []) ]

  const scenario = rule.scenarios.find(scenario => scenario.uuid === scenarioId)
  if(!scenario)
    return console.warn(`Scenario with id ${scenarioId} could not be found in rule`, rule, scenarioId)
  
  const scenarioIdx = rule.scenarios.indexOf(scenario)
  const scenarios = [...rule.scenarios]

  scenarios[scenarioIdx as number] = {
    ...scenario,
    steps: [
      ...scenario.steps,
      stepFactory(undefined, true)
    ]
  }

  rules[ruleIdx as number] = {...rule, scenarios}

  updateFeature({...feature, rules})

}