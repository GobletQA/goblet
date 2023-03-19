import type {
  TRaceFeature,
  TPatchFeatureOpts,
} from '@GBR/types'
import type {
  TAstType,
  TIndexAst,
  TFeatureAst,
  TIndexParentAst,
} from '@ltipton/parkin'

import { Parkin } from '@ltipton/parkin'

/**
 * TODO: update this to just return the parts of the feature that changed
 * Then Modify "mapFeatureUpdate" to expect just a partial feature update
 * This would allow us to just modify the part that changed
 * Instead of looping over the entire feature
 *
 * It would work like this:
 *
 * If the property exists on the object returned from the method
 *  - Then it is expected that it changed
 *  - Otherwise it should be the same
 *  - Then in "mapFeatureUpdate"
 *  - Replace only the parts of the feature that changed
 *  - It would be could be as simple as
 *  - const feature = { ...oldFeature, ...updatedFeature }
 *  - Will most likely need to merge sub-properties and arrays
 *  - Like steps and rule.scenarios 
 */
export const patchIndexes = (props:TPatchFeatureOpts, PK?:Parkin) => {
  const child = props.child as TAstType
  const feature = props.feature as TFeatureAst
  const parent = props.parent as TIndexParentAst

  const parkin  = PK || new Parkin()

  const indexes = (props.indexes as TIndexAst)
    || parkin.indexes.toIndexes(feature)

  const { indexed } = parkin.indexes.indexFrom({
    ...props,
    feature,
    child,
    parent,
    indexes
  })
 
  const updated = parkin.indexes.toFeature(indexed, feature)
  updated.content = parkin.assemble.indexedToString(indexed as unknown as TIndexAst)

  return {
    feature: updated,
    indexes: indexed
  }
}