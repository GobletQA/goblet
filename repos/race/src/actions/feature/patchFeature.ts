import type {
  TRaceIndex,
  TRaceFeature,
  TUpdateFeature,
  TRaceIndexParent,
  TPatchFeatureOpts,
  TUpdateFeatureOpts
} from '@GBR/types'

import { emptyObj, exists } from '@keg-hub/jsutils'
import { EE } from '@gobletqa/shared/libs/eventEmitter'
import { UpdateFeatureContextEvt } from '@GBR/constants'
import { ParkinWorker } from '@GBR/workers/parkin/parkinWorker'
import { getFeature } from '@gobletqa/race/utils/features/getFeature'
import { mapFeatureUpdate } from '@GBR/utils/features/mapFeatureUpdate'


export type TPatchFeature = Omit<TPatchFeatureOpts, `feature`|`indexes`|`parent`> & {
  indexes?:TRaceIndex
  feature?:TRaceFeature
  parent?:TRaceIndexParent
}

export const patchFeature = async (
  patch:TPatchFeature,
  updateOpts:TUpdateFeatureOpts=emptyObj
) => {

  const {
    child,
    parent,
    childKey,
  } = patch

  const { feature, indexes } = patch?.feature && patch?.indexes ? patch : await getFeature()

  if(!feature || !feature.feature)
    return console.warn(`A named feature is required when calling updateFeature action`, feature)

  const { feature:updated, indexes:idxes  } = await ParkinWorker.patchFeature({
    child,
    indexes,
    childKey,
    feature,
    parent: parent || feature,
  })

  const mapped = mapFeatureUpdate(updated, feature)

  EE.emit<TUpdateFeature>(
    UpdateFeatureContextEvt,
    {
      indexes: idxes,
      feature: mapped,
      options: {...updateOpts, replace: true}
    }
  )
}