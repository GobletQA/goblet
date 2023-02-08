import type { TBackgroundAst } from '@GBR/types'

import { ESectionType } from '@GBR/types'
import { stepsFactory } from './stepFactory'
import { FeatureIndexMap } from '@GBR/constants'
import { deepMerge, uuid } from '@keg-hub/jsutils'

const emptyBackground = (parent?:ESectionType) => ({
  tags: [],
  steps: [],
  uuid: uuid(),
  background: `${parent} background`,
  index: FeatureIndexMap.background,
})

export const backgroundFactory = (
  background?:Partial<TBackgroundAst>,
  empty:boolean=false,
  parent:ESectionType=ESectionType.feature
) => {

  return background
    ? deepMerge<TBackgroundAst>(
        emptyBackground(parent),
        background,
        {steps: stepsFactory(background?.steps)}
      )
    : empty
      ? emptyBackground(parent)
      : undefined
}

