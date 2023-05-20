import type {
  TFeaturesRef,
  TRaceFeature,
} from '@GBR/types'

import { omitKeys } from '@keg-hub/jsutils'
import { EmptyFeatureUUID } from '@GBR/constants/values'
import { cleanString } from '@GBR/utils/helpers/cleanString'

/**
 * Ensure the feature file extension is added to the file name
 * Removes the extension if it already exists, then adds it
 */
const addFeatureExt = (location:string) => {
  return `${location.replace(/\.feature$/, ``)}.feature`
}

/**
 * Generates the feature file path, uuid and parent properties
 * Ensures it does not overwrite an existing feature file name
 */
const generateFeatureProps = (feat:TRaceFeature, rootPrefix:string):Partial<TRaceFeature> => {
  const fileName = cleanString(feat.feature)
  const nameExt = addFeatureExt(fileName)

  const relative = `/${nameExt}`
  const fullLoc = `${feat.parent.location.replace(/\/$/, ``)}${relative}`
  const path = fullLoc.replace(rootPrefix, ``)

  return {
    path,
    uuid: fullLoc,
    parent: { uuid: fullLoc, location: fullLoc },
  }
}

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