import type { TRaceFeature, TRaceBackgroundParent, TRaceBackground } from '@GBR/types'

import { EAstObject } from '@ltipton/parkin'
import { stepsFactory } from './stepFactory'
import { deepMerge, uuid } from '@keg-hub/jsutils'
import { findNextIndex } from '@GBR/utils/find/findNextIndex'

export type TBackgroundFactory = {
  empty?:boolean
  feature:TRaceFeature,
  parent?:TRaceBackgroundParent
  background?:Partial<TRaceBackground>
}

const emptyBackground = (background:Partial<TRaceBackground>) => {
  return {
    steps: [],
    uuid: uuid(),
    background: ``,
    type: EAstObject.background,
    ...background
  } as Partial<TRaceBackground>
}

export const backgroundFactory = ({
  feature,
  background,
  empty=false,
  parent=feature,
}:TBackgroundFactory) => {
  if(!parent) throw new Error(`A parent type of feature or rule is required.`)

  const index = findNextIndex({
    parent,
    feature,
    type: EAstObject.background,
  })

  const whitespace = parent?.whitespace?.length ? `${parent.whitespace}  ` : `  `

  const built = background
    ? deepMerge<TRaceBackground>(emptyBackground({ index, whitespace }), background)
    : empty
      ? emptyBackground({ index, whitespace }) as TRaceBackground
      : undefined
  
  built && (
    built.steps = stepsFactory({
      feature,
      parent: built,
      steps: background?.steps,
    })
  )

  return built
  
}

