import type { TStepAst } from '@GBR/types'

import { updateFeature } from '@GBR/actions/feature/updateFeature'
import { getFeature } from '@gobletqa/race/utils/features/getFeature'

export const changeScenarioStep = async (step:TStepAst, scenarioId:string) => {
  const feature = await getFeature()
  if(!feature) return
  
  console.log(`------- changeScenarioStep -------`)
  console.log(step)
}