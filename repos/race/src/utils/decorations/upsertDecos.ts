import type { TParentAst } from '@ltipton/parkin'
import type {
  TRaceDeco,
  TDecoCache,
  TRaceFeature,
  TRaceDecorations,
} from '@GBR/types'

import { findTextMatch } from '@gobletqa/race/utils/decorations/findTextMatch'

type TUpsertDeco = {
  location:string,
  cache: TDecoCache
  parent?:TParentAst
  updates:TRaceDeco[]
  feature:TRaceFeature
  decorations:TRaceDecorations
}

export const upsertDecos = ({
  cache,
  parent,
  feature,
  updates,
  location,
  decorations,
}:TUpsertDeco) => {

  let cacheUpdate = cache
  const updated = Object.entries(updates).reduce((acc, [key, deco]) => {
    const item = cache.cache[deco.id]
      || findTextMatch({
          deco,
          parent,
          feature,
          cache: cache.cache,
        })

    if(!item?.uuid){
      console.warn(`[Race Deco] Can not update decorations, failed to match ID`)
      return acc
    }

    acc[location] = {
      ...acc[location],
      [item.uuid]: deco
    }

    if(item && cacheUpdate?.cache?.[deco.id] !== item)
      cacheUpdate = {
        ...cache,
        cache:{...cache.cache, [deco.id]: item}
      }

    return acc
  }, {...decorations} as TRaceDecorations)

  return {
    cache: cacheUpdate,
    decorations: updated
  }
  
}
