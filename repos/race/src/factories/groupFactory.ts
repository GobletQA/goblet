import type { TRaceFeatureGroup, TFeaturesRef } from '@GBR/types'


export type TBuildFeatureGroups = {
  rootPrefix:string
  featuresRef: TFeaturesRef
}

export const groupFactory = (
  fullLoc:string,
  part:string,
  loc:string
) => {
  return {
    path: loc,
    title: part,
    items: {},
    type: `folder` as const,
    uuid: fullLoc,
    parent: {
      uuid: fullLoc,
      location: fullLoc
    }
  } as TRaceFeatureGroup
}
