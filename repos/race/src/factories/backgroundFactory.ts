import type { TBackgroundAst } from '@ltipton/parkin'

import { ESectionType } from '@GBR/types'
import { stepsFactory } from './stepFactory'
import { FeatureIndexMap } from '@GBR/constants'
import { deepMerge, uuid } from '@keg-hub/jsutils'

export type TBackgroundFactory = {
  empty?:boolean
  parent?:ESectionType
  background?:Partial<TBackgroundAst>
}

const emptyBackground = (parent?:ESectionType) => ({
  tags: [],
  steps: [],
  uuid: uuid(),
  whitespace: ``,
  background: `${parent} background`,
  index: FeatureIndexMap.background,
})

export const backgroundFactory = ({
  background,
  empty=false,
  parent=ESectionType.feature
}:TBackgroundFactory) => {

  return background
    ? deepMerge<TBackgroundAst>(
        emptyBackground(parent),
        background,
        {steps: stepsFactory({steps: background?.steps})}
      )
    : empty
      ? emptyBackground(parent)
      : undefined
}

