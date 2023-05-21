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
  const { getOpenedTabs, featureGroups, setTabsAndGroups } = editor
  const tabs = getOpenedTabs()
  const removed = removeFromGroup({
    uuid,
    tabs,
    featureGroups:{ items: featureGroups } as TRaceFeatureGroup,
  })


  return setTabsAndGroups(removed)
}