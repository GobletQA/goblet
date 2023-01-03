import type { TRaceFeature, TRaceFeatures } from '@GBR/types'

import { omitKeys } from '@keg-hub/jsutils'
import { EmptyFeatureUUID } from '@GBR/constants/values'

/**
 * Cleans the feature name, and adds the call amount if it exists
 * This ensure the file name does not match an existing feature
 */
const cleanFeatureName = (name:string, call:number) => {
  const cleaned = name.replace(/[\s`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, '-')
  return call ? `${cleaned}-${call}` : cleaned
}

/**
 * Ensure the feature file extension is added to the file name
 * Removes the extension if it already exists, then adds it
 */
const addFeatureExt = (location:string) => {
  return `${location.replace(/\.feature$/, ``)}.feature`
}

/**
 * Builds a uuid matching the same format Parkin uses
 */
const buildFeatureUuid = (name:string, location:string, fileName:string) => {
  return `${location}-${fileName}-${name.length}`
}

/**
 * Generates the feature file path, uuid and parent properties
 * Ensures it does not overwrite an existing feature file name
 */
const generateFeatureProps = (
  feat:TRaceFeature,
  featuresRef:TRaceFeatures,
  call:number=0
):Partial<TRaceFeature> => {
 
  const fileName = cleanFeatureName(feat.feature, call)
  const nameExt = addFeatureExt(fileName)

  const relative = `/${nameExt}`
  const fullLoc = `${feat.parent.location}${relative}`
  
  const uuid = buildFeatureUuid(feat.feature, fullLoc, fileName)

  /**
   * If the generated uuid already exists
   * Then add 1 to the call amount and regenerate the uuid
   */
  return featuresRef[uuid as keyof typeof featuresRef]
    ? generateFeatureProps(feat, featuresRef, call + 1)
    : {
        uuid,
        path: relative,
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
    5. Remove feature.empty property
    6. Add `Feature: <name>\n` to content
    7. Update the uuid
*/
export const updateEmptyFeature = (feat:TRaceFeature, features:TRaceFeatures) => {
  return feat.uuid !== EmptyFeatureUUID
    ? feat
    : {
        ...omitKeys(feat, [`empty`]),
        ...generateFeatureProps(feat, features, 0)
      } as TRaceFeature

}