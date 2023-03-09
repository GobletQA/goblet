import type { Parkin } from '@ltipton/parkin'
import type { TRaceFeature, TOnReturnFeatureCB } from '@GBR/types'

import { deepMerge } from '@keg-hub/jsutils'

export const mergeFeatureChanges = (
  parkin:Parkin,
  feat?:Partial<TRaceFeature>,
  feature?:TRaceFeature,
  onBeforeFeatureChange?:TOnReturnFeatureCB,
  replace?:boolean
) => {

  const merged = replace
    ? feat as TRaceFeature
    : deepMerge<TRaceFeature>(feature, feat)

  const indexed:TRaceFeature = {
    uuid: merged.uuid,
    path: merged.path,
    parent: merged.parent,
    ...parkin.reIndex(merged, { empty: false, indexes: false }),
  }

  const beforeMdl = onBeforeFeatureChange?.(indexed, feat, feature)
  return beforeMdl || indexed
}
