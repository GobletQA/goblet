import type {
  TRepoOpts,
  TRaceFolder,
  TFeatureFileModel,
  TBuiltRaceFeatures,
} from '@types'
import type { TRaceFeatureGroup, TRaceFeature, TRaceFeatures } from '@gobletqa/race'

import { fromRootDir } from '@utils/repo/fromRootDir'
import { rmFeaturePrefix } from '@utils/features/rmFeaturePrefix'
import { ensureArr, isBool } from '@keg-hub/jsutils'

type TBuildFeatureModel = {
  key:string
  uuid?:string
  index?:number
  repo: TRepoOpts
  astCount?:number
  ast:TRaceFeature
  buildEmpty?:boolean
  models:TRaceFeatures
}


const getFeatureName = (loc:string) => {
  const split = loc.split(`/`)
  const part = split?.pop() || split?.shift() || loc
  if(!part.includes(`.`)) return part

  const arr = part?.split(`.`)
  arr.pop()

  return arr.join(`.`)
}

export const buildRaceFeature = ({
  ast,
  key,
  repo,
  models,
}:TBuildFeatureModel) => {

  models[key] = {
    ...ast,
    uuid: key,
    path: rmFeaturePrefix(key, repo),
    parent: { uuid: key, location: key },
  }
}

export const buildRaceErrFeature = ({
  ast,
  key,
  repo,
  models,
  buildEmpty,
}:TBuildFeatureModel) => {

  /**
   * Parkin sets the feature property to `false`
   * When the feature is missing `Feature: ...<some title>`
   * So we have to validate it, and set it to an empty string
   *
   * TODO: Parkin should be update to handle that better
   */
  const feature = !isBool(ast?.feature)
    ? ast?.feature || getFeatureName(key)
    : ``

  return buildEmpty
    ? buildRaceFeature({
        key,
        repo,
        models,
        ast: {
          ...ast,
          feature,
        },
      })
    : console.warn(`[Feature Error]: Could not parse feature`, ast?.errors)
}


export const buildRaceFolder = (
  models: TBuiltRaceFeatures,
  repo: TRepoOpts,
  key:string,
  folder:TRaceFolder,
) => {

  const split = folder.relative.split(`/`).filter(Boolean)
  const name = split.pop() || folder.relative

  models.features[key] = {
    ...folder,
    items: {},
    title: name,
    type: `folder`,
    path: folder.relative,
  }

  return models
}

export const buildRaceFeatures = (
  models:TBuiltRaceFeatures,
  repo:TRepoOpts,
  key:string,
  fileModel:TFeatureFileModel,
) => {
  const featureAsts = ensureArr<TRaceFeature>(fileModel?.ast)
  const astCount = featureAsts.length
  if(astCount > 1){
    models.duplicates = models.duplicates || []
    models.duplicates.push(fromRootDir(fileModel.location, repo))

    return models
  }

  featureAsts.forEach((ast, index) => {
      const buildEmpty = !ast.uuid
        || !ast.content
        || !ast.feature
        || Boolean(ast?.errors?.length)

      buildEmpty
        ? buildRaceErrFeature({
            ast,
            key,
            repo,
            index,
            astCount,
            buildEmpty,
            models: models.features,
          })
        : buildRaceFeature({
            ast,
            key,
            repo,
            index,
            astCount,
            models: models.features,
          })
    })

  return models
}