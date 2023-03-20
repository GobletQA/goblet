import type { TRaceBackground } from '@GBR/types'

import { stepFactory } from '@GBR/factories/stepFactory'
import { backgroundFactory } from '@GBR/factories/backgroundFactory'
import { updateFeature } from '@GBR/actions/feature/updateFeature'
import { getFeature } from '@gobletqa/race/utils/features/getFeature'

export const addBackgroundStep = async (parentId:string) => {
  if(!parentId) return console.warn(`Can not update background step without background Id`)

  const { feature } = await getFeature()
  if(!feature) return

  const background = {
    ...(
      feature.background
        || backgroundFactory({feature, empty: true}) as TRaceBackground
    )
  }

  if(!background)
    return console.warn(`Failed to add background to feature. Background factory failed to build background`)

  const step = stepFactory({
    feature,
    parent: background
  })

  if(!step)
    return console.warn(`Failed to add step to background. Step factory failed to build step`)

  background.steps = [...background.steps, step]

  updateFeature({...feature, background})

}