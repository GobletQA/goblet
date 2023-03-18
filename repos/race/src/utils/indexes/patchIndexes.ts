import type {
  TPatchFeatureOpts,
} from '@GBR/types'

import { indexFromAst } from '@GBR/utils/indexes/indexFromAst'
import { featureToIndexes } from '@GBR/utils/indexes/featureToIndexes'
import { indexesToFeature } from '@GBR/utils/indexes/indexesToFeature'
import { mapFeatureUpdate } from '@GBR/utils/features/mapFeatureUpdate'


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
export const patchIndexes = (props:TPatchFeatureOpts) => {
  const { feature } = props
  const indexes = props.indexes || featureToIndexes(feature)
  const { indexed } = indexFromAst({...props, indexes})

  const updated = indexesToFeature(
    indexed,
    feature
  )

  return {
    feature: updated,
    indexes: indexed
  }
}