import type {
  TRepoOpts,
  TRaceFiles,
  TRaceFolder,
  TBuiltRaceFeatures,
  TFeatureFileModelList,
} from '@types'
import type { TRaceFeature, TRaceFeatures } from '@gobletqa/race'

import { useMemo } from 'react'
import { useRepo } from '@store'
import { isEmptyColl } from '@keg-hub/jsutils'
import { buildRaceFeatures, buildRaceFolder } from '@utils/features/buildRaceFeatures'


export const useRaceFeatures = (files:TRaceFiles) => {
  const repo = useRepo()

  return useMemo(() => {
    return isEmptyColl<TFeatureFileModelList>(files)
      ? { features: {} } as TBuiltRaceFeatures
      : Object.entries(files as TFeatureFileModelList)
        .reduce((models, [key, fileModel]) => {

          return `isDir` in fileModel
            ? buildRaceFolder(models, (fileModel as TRaceFolder).relative)
            : buildRaceFeatures(models, repo, key, fileModel)

        }, { features: {} } as TBuiltRaceFeatures)
  }, [files, repo])
}