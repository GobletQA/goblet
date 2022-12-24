import type { TFeaturesState } from '@types'
import type { TRaceFeature, TRaceFeatures } from '@gobletqa/race'

import { useMemo } from 'react'
import { ensureArr } from '@keg-hub/jsutils'


export const useRaceFeatures = (features:TFeaturesState) => {
  return useMemo(() => {
    return Object.entries(features.files)
      .reduce((models, [key, fileModel]) => {

        ensureArr<TRaceFeature>(fileModel.ast)
          .forEach((model) => model?.uuid && (models[model?.uuid] = {
            ...model,
            parent: {
              uuid: key,
              location: key,
             },
          }))

        return models
      }, {} as TRaceFeatures)
  }, [features.files])
}