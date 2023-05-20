import type { TRaceFeatureItem, TRaceFeatures } from '@GBR/types'


export type TFeatureFromLoc = {
  features: TRaceFeatures
  loc:string
}

export const featureFromLoc = ({
  features,
  loc
}:TFeatureFromLoc):TRaceFeatureItem|undefined => {
  
  const split = loc.split(`/`).filter(Boolean) as string[]
  if(!split.length) return undefined

  return Object.entries(features)
    .reduce((found:TRaceFeatureItem|undefined, feature) => {
      if(found || !split.length) return found

      const part = split.shift() as string
      const item = features[`/${part}`]

      if(!item) return found

      // If it's the last item in the path, then return it
      else if(!split.length) return item
      
      // If it has children search the children
      else if((`items` in item))
        return featureFromLoc({ features: item.items, loc: split.join(`/`)})

      return found
    }, undefined)
}