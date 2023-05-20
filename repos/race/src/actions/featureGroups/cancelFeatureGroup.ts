import type { TRaceFeatureGroup } from '@GBR/types'

import { getEditor } from '@GBR/utils/editor/getEditor'
import { removeGroup } from '@GBR/utils/features/removeGroup'

export type TCancelFeatureGroup = {
  uuid:string
}

export const cancelFeatureGroup = async (props:TCancelFeatureGroup) => {
  const { uuid } = props
  if(!uuid) return console.warn(`[Cancel Feature Group] Can not cancel group, missing uuid`)
  
  const { editor } = await getEditor()
  const { featureGroups, setFeatureRefs } = editor
  const removed = removeGroup({ items: featureGroups } as TRaceFeatureGroup, uuid)

  return setFeatureRefs(removed.items)
}