import type { TFeaturesState } from '@types'
import type { TRaceFeature, TRaceFeatures } from '@gobletqa/race'

import { useMemo } from 'react'
import { useRepo } from '@store'
import { ensureArr, noOpObj } from '@keg-hub/jsutils'
import { rmRootFromLoc } from '@utils/repo/rmRootFromLoc'
import { getRootPrefix } from '@utils/repo/getRootPrefix'


export const useRaceFeatures = (features:TFeaturesState) => {
  const repo = useRepo()

  return useMemo(() => {
    const rootPrefix = getRootPrefix(repo, repo?.paths?.featuresDir)

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
                // Use this when the Tree Component is completed
                // path: rmRootFromLoc(key, rootPrefix),
                path: rmRootFromLoc(key),
                parent: { uuid: key, location: key },
              }

            })

          return models
        }, {} as TRaceFeatures)
  }, [features?.files, repo])
}