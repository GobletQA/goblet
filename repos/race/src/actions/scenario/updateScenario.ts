import type { TScenarioAst } from '@ltipton/parkin'

import { findScenario } from '@GBR/utils/find'
import { updateFeature } from '@GBR/actions/feature/updateFeature'
import { getFeature } from '@gobletqa/race/utils/features/getFeature'

export const updateScenario = async (
  scenarioId:string,
  update:Partial<TScenarioAst>
) => {
  if(!scenarioId) return console.warn(`Can not update scenario step without scenario Id`)
  
  const feature = await getFeature()
  if(!feature) return

  const {
    scenario,
    scenarios,
    scenarioIdx
  } = findScenario(feature, scenarioId)
  if(!scenario)
    return console.warn(`Scenario Id ${scenarioId} could not be found on feature`, feature)

  scenarios[scenarioIdx] = {...scenario, ...update}

  updateFeature({...feature, scenarios})
}