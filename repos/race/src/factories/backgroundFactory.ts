import type { TBackgroundAst } from '@ltipton/parkin'

import { stepsFactory } from './stepFactory'
import { deepMerge, uuid } from '@keg-hub/jsutils'
import { EGherkinKeys } from '@GBR/types'

export type TBackgroundFactory = {
  empty?:boolean
  background?:Partial<TBackgroundAst>
}

const emptyBackground = () => ({
  tags: [],
  steps: [],
  uuid: uuid(),
  background: `${EGherkinKeys.Background}: `,
})

export const backgroundFactory = ({
  background,
  empty=false,
}:TBackgroundFactory) => {
  if(!parent) throw new Error(`A parent type of feature or rule is required.`)

  return background
    ? deepMerge<TBackgroundAst>(
        emptyBackground(),
        background,
        {steps: stepsFactory({steps: background?.steps})}
      )
    : empty
      ? emptyBackground()
      : undefined
}

