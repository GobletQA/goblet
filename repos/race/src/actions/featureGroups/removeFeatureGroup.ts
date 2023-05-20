import type { TRaceFeatureGroup } from '@GBR/types'

import { getEditor } from '@GBR/utils/editor/getEditor'
import { removeFromGroup } from '@GBR/utils/features/removeFromGroup'

export type TRMFeatureGroup = {
  featureGroup:TRaceFeatureGroup
}

export const removeFeatureGroup = async (props:TRMFeatureGroup) => {
  const { featureGroup } = props
  const { editor } = await getEditor()
  const {
    featureGroups,
    onFolderDelete,
    setFeatureGroups,
    } = editor
    
  const removed = removeFromGroup({ items: featureGroups } as TRaceFeatureGroup, featureGroup.uuid)
  onFolderDelete?.(featureGroup)

  return setFeatureGroups(removed.items)
}