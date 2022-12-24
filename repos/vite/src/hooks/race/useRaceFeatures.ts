import type { TFeaturesState } from '@types'
import type { TRaceFeature, TRaceFeatures } from '@gobletqa/race'

import { useMemo } from 'react'
import { ensureArr, noOpObj } from '@keg-hub/jsutils'


export const useRaceFeatures = (features:TFeaturesState) => {
  return useMemo(() => {
    return !features?.files
      ? noOpObj
      : Object.entries(features?.files)
        .reduce((models, [key, fileModel]) => {

          ensureArr<TRaceFeature>(fileModel?.ast)
            .forEach((model) => model?.uuid && (models[model?.uuid] = {
              ...model,
              parent: {
                uuid: key,
                location: key,
              },
            }))

          return models
        }, {} as TRaceFeatures)
  }, [features?.files])
}