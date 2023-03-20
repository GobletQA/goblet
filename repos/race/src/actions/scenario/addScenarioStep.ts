
import { ESectionType } from '@GBR/types'
import { findScenario } from '@GBR/utils/find'
import { stepFactory } from '@GBR/factories/stepFactory'
import { findNextIndex } from '@GBR/utils/find/findNextIndex'
import { getFeature } from '@gobletqa/race/utils/features/getFeature'
import { updateFeature } from '@GBR/actions/feature/updateFeature'

export const addScenarioStep = async (parentId:string) => {
  if(!parentId) return console.warn(`Can not update scenario step without scenario Id`)
  
  const { feature } = await getFeature()
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
      index: findNextIndex({ feature, parent: scenario, type: ESectionType.steps }),
      whitespace: `${scenario.whitespace}${scenario.whitespace}`
    }
  })
 
  scenarios[scenarioIdx] = {
    ...scenario,
    steps: [
      ...scenario.steps,
      step
    ]
  }

  updateFeature({...feature, scenarios})
}