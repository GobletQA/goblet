import type { TBackgroundAst, TBackgroundParentAst } from '@ltipton/parkin'

import { updateFeature } from '@GBR/actions/feature/updateFeature'
import { getFeature } from '@gobletqa/race/utils/features/getFeature'
import { deepMerge } from '@keg-hub/jsutils'

// TODO: allow this to work with rules as well
// Switch backgroundId argument to be parent:TBackgroundParentAst
// And ref background directly via parent.background
export const updateBackground = async (update:Partial<TBackgroundAst>) => {
  const feature = await getFeature()
  if(!feature) return

  // TODO: parkin is not parsing the background title content
  // It gets replace with some content from the parent, need to update parkin
  updateFeature({...feature, background: deepMerge(feature?.background, update)})
}