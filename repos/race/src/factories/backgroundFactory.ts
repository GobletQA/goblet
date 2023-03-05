import type { TBackgroundAst } from '@ltipton/parkin'

import { stepsFactory } from './stepFactory'
import { deepMerge, uuid } from '@keg-hub/jsutils'
import { ESectionType, EGherkinKeys } from '@GBR/types'

export type TBackgroundFactory = {
  empty?:boolean
  parent?:ESectionType
  background?:Partial<TBackgroundAst>
}

const emptyBackground = (parent?:ESectionType) => ({
  tags: [],
  steps: [],
  uuid: uuid(),
  background: `${EGherkinKeys.Background}: `,
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

