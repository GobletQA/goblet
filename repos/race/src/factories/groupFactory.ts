import type { TRaceFeatureGroup, TFeaturesRef } from '@GBR/types'
import {exists} from '@keg-hub/jsutils'



export type TGroupFactory = Partial<TRaceFeatureGroup> & {
  path?:string,
  title?:string,
  fullLoc?:string,
}

export const groupFactory = ({
  path,
  title,
  fullLoc,
  ...rest
}:TGroupFactory) => {
  return {
    path,
    items: {},
    uuid: fullLoc,
    type: `folder` as const,
    title: exists(title) ? title : path?.split(`/`)?.pop(),
    ...rest,
    parent: {
      uuid: fullLoc,
      location: fullLoc,
      ...rest?.parent
    }
  } as TRaceFeatureGroup
}
