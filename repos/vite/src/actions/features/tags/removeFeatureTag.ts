import type { TFeatureFileModel } from '@types'
import { featuresDispatch } from '@store'
import { validateFeatureAction } from '@utils/features/validateFeatureAction'

/**
 * Removes a tag from a parent fileModels ast for features
 * @type function
 *
 * @return {void}
 */
export const removeFeatureTag = (parent:TFeatureFileModel, tag:string) => {
  const { feature, index } = validateFeatureAction(parent, 'tags')

  index > -1
    && feature
    && featuresDispatch.setFeature({
      ...feature,
      ast: { ...feature.ast, tags: feature.ast?.tags?.filter(pTag => pTag !== tag) },
    })
}
