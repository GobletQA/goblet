import type { TRaceFeature } from '@GBR/types'

import { EmptyFeatureUUID } from '@GBR/constants/values'
import { UpdateFeatureContextEvt } from '@GBR/constants'
import { EE } from '@gobletqa/shared/libs/eventEmitter'


const cleanFeatureName = (name:string) => {
  return name.replace(/[\s`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, '-')
}

const addFeatureExt = (location:string) => {
  return `${location.replace(/\.feature$/, ``)}.feature`
}

const buildFeatureUuid = (name:string, location:string, fileName:string) => {
  return `${location}-${fileName}-${name.length}`
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
const updateEmptyFeature = (feat:TRaceFeature) => {
  if(feat.uuid !== EmptyFeatureUUID) return feat

  const fileName = cleanFeatureName(feat.feature)
  const nameExt = addFeatureExt(fileName)

  const relative = `/${nameExt}`
  const fullLoc = `${feat.parent.location}${relative}`

  if(feat.empty === true) delete feat.empty

  return {
    ...feat,
    path: relative,
    parent: { uuid: fullLoc, location: fullLoc },
    uuid: buildFeatureUuid(feat.feature, fullLoc, fileName),
  } as TRaceFeature

}

export const updateFeature = (feat:TRaceFeature) => {
  if(!feat.feature)
    return console.warn(`Can not update a feature without a feature name`, feat)

  const feature = updateEmptyFeature(feat)
  EE.emit<TRaceFeature>(UpdateFeatureContextEvt, feature)
}