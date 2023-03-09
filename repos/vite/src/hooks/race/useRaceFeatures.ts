import type { TFeatureFileModelList } from '@types'
import type { TRaceFeature, TRaceFeatures } from '@gobletqa/race'

import { useMemo } from 'react'
import { useRepo } from '@store'
import { ensureArr, emptyObj, isEmptyColl } from '@keg-hub/jsutils'
import { rmFeaturePrefix } from '@utils/features/rmFeaturePrefix'

export const useRaceFeatures = (files:TFeatureFileModelList) => {
  const repo = useRepo()

  return useMemo(() => {

    return isEmptyColl<TFeatureFileModelList>(files)
      ? emptyObj
      : Object.entries(files as TFeatureFileModelList)
        .reduce((models, [key, fileModel]) => {

          ensureArr<TRaceFeature>(fileModel?.ast)
            .forEach((model) => {
              if(!model?.uuid) return

              const uuidRef = `${key}-${model.uuid}`
              models[uuidRef] = {
                ...model,
                uuid: uuidRef,
                path: rmFeaturePrefix(key, repo),
                parent: { uuid: key, location: key },
              }

            })

          return models
        }, {} as TRaceFeatures)
  }, [files, repo])
}