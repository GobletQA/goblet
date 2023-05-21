import type { TRaceFeatureGroup } from '@GBR/types'

import { EPatchType } from '@GBR/types'
import { getEditor } from '@GBR/utils/editor/getEditor'
import { removeFromGroup } from '@GBR/utils/features/removeFromGroup'

export type TRMFeatureGroup = {
  featureGroup:TRaceFeatureGroup
}

export const removeFeatureGroup = async (props:TRMFeatureGroup) => {
  const { featureGroup } = props
  const { editor } = await getEditor()
  const {
    getOpenedTabs,
    featureGroups,
    onFolderDelete,
    setTabsAndGroups,
    } = editor
  
  const tabs = getOpenedTabs()
  const removed = removeFromGroup({
    tabs,
    uuid:featureGroup.uuid,
    featureGroups:{ items: featureGroups } as TRaceFeatureGroup,
  })
  onFolderDelete?.(featureGroup)

  return setTabsAndGroups(removed)
}