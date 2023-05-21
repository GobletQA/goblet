import type { TRaceFeatureGroup } from '@GBR/types'

import { getEditor } from '@GBR/utils/editor/getEditor'
import { removeFromGroup } from '@GBR/utils/features/removeFromGroup'

export type TCancelFeatureGroup = {
  path:string
  uuid:string
}

export const cancelFeatureGroup = async (props:TCancelFeatureGroup) => {
  const { uuid, path } = props
  if(!uuid) return console.warn(`[Cancel Feature Group] Can not cancel group, missing uuid`)
  if(!path) return console.warn(`[Cancel Feature Group] Can not cancel group, missing path`)

  const { editor } = await getEditor()
  const { getOpenedTabs, featureGroups, setTabsAndGroups } = editor
  const tabs = getOpenedTabs()
  const removed = removeFromGroup({
    path,
    uuid,
    tabs,
    featureGroups:{ items: featureGroups } as TRaceFeatureGroup,
  })


  return setTabsAndGroups(removed)
}