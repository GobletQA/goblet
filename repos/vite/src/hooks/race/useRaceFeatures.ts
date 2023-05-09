import type { TRepoOpts, TFeatureFileModelList } from '@types'
import type { TRaceFeature, TRaceFeatures } from '@gobletqa/race'

import { useMemo } from 'react'
import { useRepo } from '@store'
import { ensureArr, emptyArr, isEmptyColl } from '@keg-hub/jsutils'
import { rmFeaturePrefix } from '@utils/features/rmFeaturePrefix'

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
  repo: TRepoOpts
  model:TRaceFeature
  buildEmpty?:boolean
  models:TRaceFeatures
}

const buildFeatureModel = ({
  key,
  repo,
  model,
  models,
}:TBuildFeatureModel) => {
  const uuidRef = `${key}-${model.uuid}`
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
  models,
  buildEmpty
}:TBuildFeatureModel) => {
  const feature = model?.feature || getFeatureName(key)
  return buildEmpty
    ? buildFeatureModel({
        key,
        repo,
        models,
        model: {
          ...model,
          feature,
          uuid: `${feature}-0`
        },
      })
    : console.warn(`[Feature Error]: Could not parse feature`, model?.errors)
}


export const useRaceFeatures = (files:TFeatureFileModelList) => {
  const repo = useRepo()

  return useMemo(() => {
    return isEmptyColl<TFeatureFileModelList>(files)
      ? {}
      : Object.entries(files as TFeatureFileModelList)
        .reduce((models, [key, fileModel]) => {

          ensureArr<TRaceFeature>(fileModel?.ast)
            .forEach((model) => {

              const buildEmpty = !model.uuid
                || !model.content
                || !model.feature

              return buildEmpty || model?.errors?.length
                ? buildErrFeatureModel({
                    key,
                    repo,
                    model,
                    models,
                    buildEmpty
                  })
                : buildFeatureModel({
                    key,
                    repo,
                    model,
                    models,
                  })
            })

          return models
        }, {} as TRaceFeatures)
  }, [files, repo])
}