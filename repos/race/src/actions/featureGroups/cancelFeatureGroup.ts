import type { TRaceFeatureGroup } from '@GBR/types'

import { getEditor } from '@GBR/utils/editor/getEditor'
import { removeFromGroup } from '@GBR/utils/features/removeFromGroup'

export type TCancelFeatureGroup = {
  uuid:string
}

export const cancelFeatureGroup = async (props:TCancelFeatureGroup) => {
  const { uuid } = props
  if(!uuid) return console.warn(`[Cancel Feature Group] Can not cancel group, missing uuid`)
  
  const { editor } = await getEditor()
  const { featureGroups, setTabsAndGroups } = editor
  const removed = removeFromGroup({ items: featureGroups } as TRaceFeatureGroup, uuid)

  return setTabsAndGroups(undefined, removed.items)
}