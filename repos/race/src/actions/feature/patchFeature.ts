import type {
  TRaceIndex,
  TRaceFeature,
  TPatchParams,
  TUpdateFeature,
  TRaceIndexParent,
  TPatchFeatureOpts,
} from '@GBR/types'

import { emptyObj } from '@keg-hub/jsutils'
import { EE } from '@gobletqa/shared/libs/eventEmitter'
import { UpdateFeatureContextEvt } from '@GBR/constants'
import { ParkinWorker } from '@GBR/workers/parkin/parkinWorker'
import { getFeature } from '@gobletqa/race/utils/features/getFeature'


export type TPatchFeature = Omit<TPatchFeatureOpts, `feature`|`indexes`|`parent`> & {
  indexes?:TRaceIndex
  feature?:TRaceFeature
  parent?:TRaceIndexParent
}

export const patchFeature = async (
  patch:TPatchFeature,
  updateOpts:TPatchParams=emptyObj
) => {

  const {
    key,
    child,
    parent,
  } = patch

  const { feature, indexes } = (patch?.feature && patch?.indexes)
    ? patch
    : await getFeature()

  if(!feature || !feature.feature)
    return console.warn(`A named feature is required when calling updateFeature action`, feature)

  const {
    indexes:idxes,
    feature:updated,
  } = await ParkinWorker.patchFeature({
    key,
    child,
    indexes,
    feature,
    parent: parent || feature,
  })

  const patched = {...feature, ...updated} as unknown as TRaceFeature

  EE.emit<TUpdateFeature>(
    UpdateFeatureContextEvt,
    {
      indexes: idxes,
      feature: patched,
      options: {...updateOpts, replace: true}
    }
  )
}