import type { TBackgroundAst } from '@GBR/types'

import { stepsFactory } from './stepFactory'
import { FeatureIndexMap } from '@GBR/constants'
import { deepMerge, uuid } from '@keg-hub/jsutils'

const emptyBackground = () => ({
  tags: [],
  steps: [],
  uuid: uuid(),
  background: ``,
  index: FeatureIndexMap.background,
})

export const backgroundFactory = (
  background?:Partial<TBackgroundAst>,
  empty:boolean=false
) => {

  return background
    ? deepMerge<TBackgroundAst>(
        emptyBackground(),
        background,
        {steps: stepsFactory(background?.steps)}
      )
    : empty
      ? emptyBackground()
      : undefined
}

