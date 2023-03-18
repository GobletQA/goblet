import type { TRaceFeature, TRaceBackgroundParent, TRaceBackground } from '@GBR/types'

import { ESectionType } from '@GBR/types'
import { stepsFactory } from './stepFactory'
import { deepMerge, uuid } from '@keg-hub/jsutils'

export type TBackgroundFactory = {
  empty?:boolean
  feature:TRaceFeature,
  parent?:TRaceBackgroundParent
  background?:Partial<TRaceBackground>
}

const emptyBackground = (parent:TRaceBackgroundParent) => {

  return {
    steps: [],
    uuid: uuid(),
    background: ``,
    whitespace: `  `,
    type: ESectionType.background,
  } as Partial<TRaceBackground>
}

export const backgroundFactory = ({
  parent,
  feature,
  background,
  empty=false,
}:TBackgroundFactory) => {
  if(!parent) throw new Error(`A parent type of feature or rule is required.`)

  return background
    ? deepMerge<TRaceBackground>(
        emptyBackground(parent),
        background,
        {steps: stepsFactory({steps: background?.steps, feature})}
      )
    : empty
      ? emptyBackground(parent) as TRaceBackground
      : undefined
}

