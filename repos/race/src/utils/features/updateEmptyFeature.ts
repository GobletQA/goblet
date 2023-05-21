import type { TRaceFeature } from '@GBR/types'

import { omitKeys } from '@keg-hub/jsutils'
import { EmptyFeatureUUID } from '@GBR/constants/values'
import { generateFeatureProps } from '@GBR/utils/features/generateFeatureProps'

/*
  To Update
    1. clean feature name to be valid file path
      * Remove space and dots
      * Add .feature ext if it doesn't exist
    2. set the feature.path to be `/feature-name.feature` from setup 1
    3. build the full path from the feature.parent.location
      * update feature.parent.location to be the new location
      * Update feature.parent.uuid to be the new location
    5. Remove feature.isEmpty property
    6. Add `Feature: <name>\n` to content
    7. Update the uuid
*/
export const updateEmptyFeature = (feat:TRaceFeature, rootPrefix:string) => {
  return feat.uuid !== EmptyFeatureUUID
    ? feat
    : {
        ...omitKeys(feat, [`isEmpty`]),
        ...generateFeatureProps(feat, rootPrefix)
      } as TRaceFeature

}