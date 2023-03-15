import type { TRaceBackground } from '@GBR/types'

import { stepsFactory } from './stepFactory'
import { deepMerge, uuid } from '@keg-hub/jsutils'

export type TBackgroundFactory = {
  empty?:boolean
  background?:Partial<TRaceBackground>
}

const emptyBackground = () => ({
  tags: [],
  steps: [],
  uuid: uuid(),
  background: ``,
  whitespace: `  `,
})

export const backgroundFactory = ({
  background,
  empty=false,
}:TBackgroundFactory) => {
  if(!parent) throw new Error(`A parent type of feature or rule is required.`)

  return background
    ? deepMerge<TRaceBackground>(
        emptyBackground(),
        background,
        {steps: stepsFactory({steps: background?.steps})}
      )
    : empty
      ? emptyBackground()
      : undefined
}

