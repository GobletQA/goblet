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
import { omitKeys } from '@keg-hub/jsutils'
import { buildRaceFeatures, buildRaceFolder } from '@utils/features/buildRaceFeatures'


export const useRaceFeatures = (files:TRaceFiles) => {
  const repo = useRepo()

  return useMemo(() => {
    const items = { features: {} } as TBuiltRaceFeatures

    return Object.entries(files as TFeatureFileModelList)
      .reduce((models, [key, fileModel]) => {
        return (`isDir` in fileModel)
          ? buildRaceFolder(models, omitKeys(fileModel, [`location`]) as TRaceFolder)
          : buildRaceFeatures(models, repo, key, fileModel)
      }, items)

  }, [files, repo])
}