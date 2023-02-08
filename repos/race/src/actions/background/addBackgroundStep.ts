import type { TBackgroundAst } from '@GBR/types'
import { ESectionType } from '@GBR/types'
import { stepFactory } from '@GBR/factories/stepFactory'
import { backgroundFactory } from '@GBR/factories/backgroundFactory'
import { updateFeature } from '@GBR/actions/feature/updateFeature'
import { getFeature } from '@gobletqa/race/utils/features/getFeature'

export const addBackgroundStep = async (parentId:string) => {
  if(!parentId) return console.warn(`Can not update background step without background Id`)

  const feature = await getFeature()
  if(!feature) return

  const background = {
    ...(
      feature.background
        || backgroundFactory(undefined, true) as TBackgroundAst
    )
  }

  background.steps = [...background.steps, stepFactory(undefined, true)]

  updateFeature({...feature, background})

}