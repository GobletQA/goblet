import { findScenario, findRule } from '@GBR/utils/find'
import { updateFeature } from '@GBR/actions/feature/updateFeature'
import { getFeature } from '@gobletqa/race/utils/features/getFeature'

export const removeRuleScenarioStep = async (
  stepId:string,
  scenarioId?:string,
  ruleId?:string
) => {

  const feature = await getFeature()
  if(!feature)
    return console.warn(`Remove Rule#scenario#step - Can not access feature context`)
  if(!scenarioId)
    return console.warn(`Remove Rule#scenario#step - Scenario Id is required`,feature,stepId,scenarioId,ruleId)
  if(!ruleId)
    return console.warn(`Remove Rule#scenario#step - Rule Id is required`,feature,stepId,scenarioId,ruleId)

  const {
    rule,
    rules,
    ruleIdx,
  } = findRule(feature, ruleId)
  if(!rule) return

  const {
    scenario,
    scenarios,
    scenarioIdx
  } = findScenario(rule, scenarioId)
  if(!scenario) return


  scenarios[scenarioIdx as number] = {
    ...scenario,
    steps: scenario.steps.filter(step => step.uuid !== stepId)
  }

  rules[ruleIdx as number] = {
    ...rule,
    scenarios
  }

  updateFeature({...feature, rules})

}