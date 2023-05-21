import type { TRaceFeatureGroup } from '@GBR/types'

import { getEditor } from '@GBR/utils/editor/getEditor'
import { updateGroups } from '@GBR/utils/features/updateGroups'

export type TEditFeatureGroup = {
  editing?:boolean
  featureGroup:TRaceFeatureGroup
}

export const editFeatureGroupName = async (props:TEditFeatureGroup) => {

  const { featureGroup, editing=true } = props

  const { editor } = await getEditor()
  const { getOpenedTabs, featureGroups, setTabsAndGroups } = editor
  const tabs = getOpenedTabs()
  const updated = updateGroups({
    tabs,
    parentGroup: { items: featureGroups },
    featureGroup: {...featureGroup, editing },
  })

  return setTabsAndGroups(updated)
}
