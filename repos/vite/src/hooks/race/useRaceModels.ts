import type { TRaceModels } from '@gobletqa/race'
import type { TFeatureAst, TFeatureFileModel, TFeaturesState } from '@types'

import { useMemo } from 'react'


export const useRaceModels = (features:TFeaturesState) => {
  return useMemo(() => {
    return Object.entries(features.files)
      .reduce((models, [key, fileModel]) => {
        fileModel?.ast && (models[key] = fileModel.ast)

        return models
      }, {} as TRaceModels)
  }, [features.files])
}