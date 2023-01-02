import type { TBackgroundAst } from '@GBR/types'

import { stepsFactory } from './stepFactory'
import { deepMerge, uuid } from '@keg-hub/jsutils'

export const backgroundFactory = (background?:Partial<TBackgroundAst>) => {
  return background
    ? deepMerge<TBackgroundAst>(
        {
          index: 0,
          tags: [],
          uuid: uuid(),
          background: ``,
        },
        background,
        {steps: stepsFactory(background.steps)}
      )
    : undefined
}

