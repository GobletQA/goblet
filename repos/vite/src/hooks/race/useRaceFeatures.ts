import type { TFeaturesState } from '@types'
import type { TRaceFeature, TRaceFeatures } from '@gobletqa/race'

import { useMemo } from 'react'
import { useRepo } from '@store'
import { ensureArr, noOpObj } from '@keg-hub/jsutils'
import { rmFeaturePrefix } from '@utils/features/rmFeaturePrefix'

export const useRaceFeatures = (features:TFeaturesState) => {
  const repo = useRepo()

  return useMemo(() => {

    return !features?.files
      ? noOpObj
      : Object.entries(features?.files)
        .reduce((models, [key, fileModel]) => {

          ensureArr<TRaceFeature>(fileModel?.ast)
            .forEach((model) => {
              if(!model?.uuid) return

              const uuidRef = `${key}-${model.uuid}`
              models[uuidRef] = {
                ...model,
                uuid: uuidRef,
                title: model?.feature,
                path: rmFeaturePrefix(key, repo),
                parent: { uuid: key, location: key },
              }

            })

          return models
        }, {} as TRaceFeatures)
  }, [features?.files, repo])
}