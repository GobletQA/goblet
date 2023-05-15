import type {
  TRepoOpts,
  TFeatureFileModel,
  TFeatureFileModelList,
} from '@types'
import type { TRaceFeature, TRaceFeatures } from '@gobletqa/race'

import { useMemo } from 'react'
import { useRepo } from '@store'
import { fromRootDir } from '@utils/repo/fromRootDir'
import { rmFeaturePrefix } from '@utils/features/rmFeaturePrefix'
import { ensureArr, isEmptyColl, isBool } from '@keg-hub/jsutils'


export type THRaceFeaturesResp = {
  features: TRaceFeatures
  duplicates?: string[]
}


const getFeatureName = (loc:string) => {
  const split = loc.split(`/`)
  const part = split?.pop() || split?.shift() || loc
  if(!part.includes(`.`)) return part

  const arr = part?.split(`.`)
  arr.pop()

  return arr.join(`.`)
}

type TBuildFeatureModel = {
  key:string
  uuid?:string
  index?:number
  repo: TRepoOpts
  astCount?:number
  model:TRaceFeature
  buildEmpty?:boolean
  models:TRaceFeatures
}

const buildFeatureModel = ({
  key,
  repo,
  index,
  model,
  models,
  astCount=1,
}:TBuildFeatureModel) => {
  const uuidRef = astCount > 1 ? `${key}-${index}` : key
  models[uuidRef] = {
    ...model,
    uuid: uuidRef,
    path: rmFeaturePrefix(key, repo),
    parent: { uuid: key, location: key },
  }
}

const buildErrFeatureModel = ({
  key,
  repo,
  model,
  index,
  models,
  astCount,
  buildEmpty,
}:TBuildFeatureModel) => {

  /**
   * Parkin sets the feature property to `false`
   * When the feature is missing `Feature: ...<some title>`
   * So we have to validate it, and set it to an empty string
   *
   * TODO: Parkin should be update to handle that better
   */
  const feature = !isBool(model?.feature)
    ? model?.feature || getFeatureName(key)
    : ``

  return buildEmpty
    ? buildFeatureModel({
        key,
        repo,
        index,
        models,
        astCount,
        model: {
          ...model,
          feature,
        },
      })
    : console.warn(`[Feature Error]: Could not parse feature`, model?.errors)
}

export const useRaceFeatures = (files:TFeatureFileModelList) => {
  const repo = useRepo()

  return useMemo(() => {
    return isEmptyColl<TFeatureFileModelList>(files)
      ? { features: {} } as THRaceFeaturesResp
      : Object.entries(files as TFeatureFileModelList)
        .reduce((models, [key, fileModel]) => {

          const featureAsts = ensureArr<TRaceFeature>(fileModel?.ast)
          const astCount = featureAsts.length
          if(astCount > 1){
            models.duplicates = models.duplicates || []
            models.duplicates.push(fromRootDir(fileModel.location, repo))

            return models
          }

          featureAsts.forEach((model, index) => {
            const buildEmpty = !model.uuid
              || !model.content
              || !model.feature

            buildEmpty || model?.errors?.length
              ? buildErrFeatureModel({
                  key,
                  repo,
                  model,
                  index,
                  astCount,
                  buildEmpty,
                  models: models.features,
                })
              : buildFeatureModel({
                  key,
                  repo,
                  index,
                  model,
                  astCount,
                  models: models.features,
                })
          })

          return models
        }, { features: {} } as THRaceFeaturesResp)
  }, [files, repo])
}