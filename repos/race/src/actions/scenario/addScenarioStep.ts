import type { TRaceFeature, TRaceStep } from '@GBR/types'

import { ESectionType } from '@GBR/types'
import { emptyArr } from '@keg-hub/jsutils'
import { findScenario, findRule } from '@GBR/utils/find'
import { stepFactory } from '@GBR/factories/stepFactory'
import { updateFeature } from '@GBR/actions/feature/updateFeature'
import { getFeature } from '@gobletqa/race/utils/features/getFeature'
import { logNotFound, factoryFailed, missingId } from '@GBR/utils/logging'

const prefix = `[Add Scenario#Step]`

export const addScenarioStep = async (
  scenarioId:string,
  addStep?:TRaceStep,
  addIdx?:number,
  parentFeat?:TRaceFeature
) => {
  if(!scenarioId) return missingId(`scenario`, prefix)
  
  const { feature } = await getFeature(parentFeat)
  if(!feature) return logNotFound(`feature`, prefix)

  const {
    parent:sParent,
    item:scenario,
    group:scenarios,
    index:scenarioIdx,
  } = findScenario(feature, scenarioId)
  if(!scenario) return logNotFound(`scenario`, prefix, scenarioId)


  const steps = [...(scenario?.steps || emptyArr)]
  let step = addStep

  if(step) steps.splice(addIdx || scenario.steps.length - 1, 0, step)
  else {
    step = stepFactory({
      feature,
      parent: scenario
    })
    if(!step) return factoryFailed(`step`, prefix)

    steps.push(step)
  }

  scenarios[scenarioIdx] = {...scenario, steps}

  if(sParent.type === ESectionType.feature){
    const update = {...feature, scenarios}
    !parentFeat && updateFeature(update, { expand: step.uuid })

    return update
  }

  const {
    rule,
    rules,
    ruleIdx,
  } = findRule(feature, sParent.uuid)
  if(!rule) return logNotFound(`rule`, prefix)

  rules[ruleIdx as number] = {...rule, scenarios}

  const update = {...feature, rules}
  !parentFeat && updateFeature(update, { expand: step.uuid })

  return update
}