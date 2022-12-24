import type { TRaceModel, TRaceModels } from '@gobletqa/race'
import type { TFeatureAst, TFeatureFileModel, TFeaturesState } from '@types'

import { useMemo } from 'react'
import { ensureArr } from '@keg-hub/jsutils'


export const useRaceModels = (features:TFeaturesState) => {
  return useMemo(() => {
    return Object.entries(features.files)
      .reduce((models, [key, fileModel]) => {

        ensureArr<TRaceModel>(fileModel.ast)
          .forEach((model) => model?.uuid && (models[model?.uuid] = {
            ...model,
            parent: {
              uuid: key,
              location: key,
             },
          }))

        return models
      }, {} as TRaceModels)
  }, [features.files])
}