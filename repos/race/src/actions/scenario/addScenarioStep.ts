import { ESectionType } from '@GBR/types'
import { findScenario } from '@GBR/utils/find'
import { stepFactory } from '@GBR/factories/stepFactory'
import { patchFeature } from '@GBR/actions/feature/patchFeature'
import { getFeature } from '@gobletqa/race/utils/features/getFeature'

import { updateFeature } from '@GBR/actions/feature/updateFeature'

export const addScenarioStep = async (parentId:string) => {
  if(!parentId) return console.warn(`Can not update scenario step without scenario Id`)
  
  const { feature, indexes } = await getFeature()

  if(!feature) return

  const {
    scenario,
    scenarios,
    scenarioIdx
  } = findScenario(feature, parentId)
  if(!scenario) return

  const step = stepFactory({
    feature,
    step: {
      whitespace: `${scenario.whitespace}${scenario.whitespace}`
    }
  })

  patchFeature({
    feature,
    indexes,
    child: step,
    parent: scenario,
    key: ESectionType.steps
  })

  // scenarios[scenarioIdx] = {
  //   ...scenario,
  //   steps: [
  //     ...scenario.steps,
  //     stepFactory({
  //       feature,
  //       step: {
  //         whitespace: `${scenario.whitespace}${scenario.whitespace}`
  //       }
  //     })
  //   ]
  // }

  // updateFeature({...feature, scenarios})
}