import type { TRaceFeature, TRaceBackgroundParent, TRaceBackground } from '@GBR/types'

import { EAstObject } from '@ltipton/parkin'
import { stepsFactory } from './stepFactory'
import { deepMerge } from '@keg-hub/jsutils'
import { ParkinWorker } from '@GBR/workers/parkin/parkinWorker'

export type TBackgroundFactory = {
  empty?:boolean
  feature:TRaceFeature,
  parent?:TRaceBackgroundParent
  background?:Partial<TRaceBackground>
}

const emptyBackground = (background:Partial<TRaceBackground>) => {
  return {
    steps: [],
    background: ``,
    type: EAstObject.background,
    ...background
  } as Partial<TRaceBackground>
}

export const backgroundFactory = async ({
  feature,
  background,
  empty=false,
  parent=feature,
}:TBackgroundFactory) => {
  if(!parent) throw new Error(`A parent type of feature or rule is required.`)

  const index = await ParkinWorker.findIndex({
    parent,
    feature,
    type: EAstObject.background,
  })

  const whitespace = parent?.whitespace?.length ? `${parent.whitespace}  ` : `  `
  const uuid = `${parent.uuid}.${EAstObject.background}.${index}`

  const built = background
    ? deepMerge<TRaceBackground>(emptyBackground({
        uuid,
        index,
        whitespace
      }), background)
    : empty
      ? emptyBackground({
          uuid,
          index,
          whitespace
        }) as TRaceBackground
      : undefined
  
  built && (
    built.steps = await stepsFactory({
      feature,
      parent: built,
      steps: background?.steps,
    })
  )

  return built
  
}

