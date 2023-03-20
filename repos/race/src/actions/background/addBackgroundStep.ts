import type { TRaceBackground } from '@GBR/types'

import { stepFactory } from '@GBR/factories/stepFactory'
import { backgroundFactory } from '@GBR/factories/backgroundFactory'
import { updateFeature } from '@GBR/actions/feature/updateFeature'
import { getFeature } from '@gobletqa/race/utils/features/getFeature'
import { logNotFound, factoryFailed, missingId } from '@GBR/utils/logging'

const prefix = `[Add Background#Step]`

export const addBackgroundStep = async (parentId:string) => {
  if(!parentId) return missingId(`background`, prefix)

  const { feature } = await getFeature()
  if(!feature) return logNotFound(`feature`, prefix)

  const background = {
    ...(
      feature.background
        || backgroundFactory({feature, empty: true}) as TRaceBackground
    )
  }

  if(!background) return logNotFound(`background`, prefix)

  const step = stepFactory({
    feature,
    parent: background
  })

  if(!step) return factoryFailed(`step`, prefix)

  background.steps = [...background.steps, step]

  updateFeature({...feature, background}, { expand: step.uuid })

}