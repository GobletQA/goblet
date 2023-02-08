import type { TStepAst, TBackgroundAst } from '@GBR/types'

import { ESectionType } from '@GBR/types'
import { findStep } from '@GBR/utils/find'
import { backgroundFactory } from '@GBR/factories/backgroundFactory'
import { updateFeature } from '@GBR/actions/feature/updateFeature'
import { getFeature } from '@gobletqa/race/utils/features/getFeature'

export const changeBackgroundStep = async (step:TStepAst) => {
  const feature = await getFeature()
  if(!feature) return

  const background = {
    ...(
      feature.background
        || backgroundFactory(undefined, true) as TBackgroundAst
    )
  }

  const { step:found, stepIdx, steps } = findStep(background, step.uuid)
  if(!found) return

  steps[stepIdx] = step
  updateFeature({...feature, background: {...background, steps}})

}