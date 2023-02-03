
import type { TStepAst } from '@GBR/types'

import { findScenario, findRule } from '@GBR/utils/find'
import { stepFactory } from '@GBR/factories/stepFactory'
import { updateFeature } from '@GBR/actions/feature/updateFeature'
import { getFeature } from '@gobletqa/race/utils/features/getFeature'

export const changeRuleScenarioStep = async (
  step:TStepAst,
  scenarioId:string,
  ruleId:string
) => {
  const feature = await getFeature()
  if(!feature) console.warn(`Can not access feature context from 'addStory' action.`) 

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


  console.log(`------- TODO: add updating step here -------`)

  // scenarios[scenarioIdx as number] = {
  //   ...scenario,
  //   steps: [
  //     ...scenario.steps,
  //     stepFactory(undefined, true)
  //   ]
  // }

  // rules[ruleIdx as number] = {...rule, scenarios}

  // updateFeature({...feature, rules})

}