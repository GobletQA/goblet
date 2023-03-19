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
 * 
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

  return {
    feature: updated,
    indexes: indexed
  }
}