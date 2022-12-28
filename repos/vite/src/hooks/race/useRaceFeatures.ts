import type { TFeaturesState } from '@types'
import type { TRaceFeature, TRaceFeatures } from '@gobletqa/race'

import { useMemo } from 'react'
import { ensureArr, noOpObj } from '@keg-hub/jsutils'
import { addRootToLoc } from '@utils/repo/addRootToLoc'
import { rmRootFromLoc } from '@utils/repo/rmRootFromLoc'

export const useRaceFeatures = (features:TFeaturesState) => {
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
                path: rmRootFromLoc(key),
                parent: { uuid: key, location: key },
              }

            })

          return models
        }, {} as TRaceFeatures)
  }, [features?.files])
}