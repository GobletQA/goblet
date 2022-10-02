import type { TFeatureFileModel } from '@types'
import { featuresDispatch } from '@store'
import { validateFeatureAction } from '@utils/features/validateFeatureAction'


/**
 * Adds a new tag to a parent fileModels ast for features
 * @type function
 * @param {Object} parent - Item to add the tag to
 * @param {Object} tag - New tag to add to the parent
 *
 * @return {void}
 */
export const addFeatureTag = (parent:TFeatureFileModel, tag:string) => {
  const { feature, index } = validateFeatureAction(parent, 'tags')
  if(!feature) return
  
  tag = tag[0] === '@' ? tag : `@${tag}`
  const tags = feature.ast.tags ? [...feature.ast.tags, tag] : [tag]

  index > -1
    && feature
    && featuresDispatch.setFeature({
      ...feature,
      ast: { ...feature.ast, tags: tags }
    })
}
