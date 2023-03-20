import { findScenario, findRule } from '@GBR/utils/find'
import { logNotFound, missingId } from '@GBR/utils/logging'
import { updateFeature } from '@GBR/actions/feature/updateFeature'
import { getFeature } from '@gobletqa/race/utils/features/getFeature'

const prefix = `[Remove Rule#Scenario#Step]`

export const removeRuleScenarioStep = async (
  stepId:string,
  scenarioId?:string,
  ruleId?:string
) => {

  const { feature } = await getFeature()
  if(!feature) return logNotFound(`feature`, prefix)
  if(!scenarioId) return missingId(`Scenario`, prefix, feature,stepId,scenarioId,ruleId)
  if(!ruleId) return logNotFound(`rule`, prefix, feature,stepId,scenarioId,ruleId)

  const {
    rule,
    rules,
    ruleIdx,
  } = findRule(feature, ruleId)
  if(!rule) return logNotFound(`rule`, prefix)

  const {
    scenario,
    scenarios,
    scenarioIdx
  } = findScenario(rule, scenarioId)
  if(!scenario) return logNotFound(`scenario`, prefix)

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