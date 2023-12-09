import type {
  TRaceFeature,
} from '@GBR/types'


import {hashString} from '@keg-hub/jsutils'
import { cleanString } from '@GBR/utils/helpers/cleanString'

/**
 * Ensure the feature file extension is added to the file name
 * Removes the extension if it already exists, then adds it
 */
export const addFeatureExt = (location:string) => {
  return `${location.replace(/\.feature$/, ``)}.feature`
}

export type TGenPartialFeat = {
  feature:string
  parent: {
    location:string
  }
}

/**
 * Generates the feature file path, uuid and parent properties
 * Ensures it does not overwrite an existing feature file name
 */
export const generateFeatureProps = (
  feat:TGenPartialFeat,
  rootPrefix:string,
  ext:boolean=true
):Partial<TRaceFeature> => {
  const fileName = cleanString(feat.feature)
  const nameExt = ext ? addFeatureExt(fileName) : fileName

  const relative = `/${nameExt}`
  const fullLoc = `${feat.parent.location.replace(/\/$/, ``)}${relative}`
  const path = fullLoc.replace(rootPrefix, ``)
  const uuid = `feature-${hashString(feat.feature)}`

  return {
    path,
    uuid,
    parent: { uuid: fullLoc, location: fullLoc },
  }
}
