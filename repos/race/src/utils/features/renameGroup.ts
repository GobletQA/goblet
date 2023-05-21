import type { TTabItem } from '@gobletqa/components'
import type { TRaceFeatureGroup, TRaceFeatures, TRaceFeatureItem, TRaceFeature } from '@GBR/types'

import { groupFindArr } from './groupFindArr'
import {get, set, unset} from '@keg-hub/jsutils'
import { featureToTab } from '@GBR/utils/features/featureTabs'

export type TRenameGroup = {
  oldPath:string
  tabs:TTabItem[]
  featureGroup:TRaceFeatureGroup,
  parentGroup:Record<`items`, TRaceFeatures>,
}

type TUpdateChildPaths = {
  tabs:TTabItem[]
  oldPath:string,
  tabsRef:TTabsRef
  items:TRaceFeatures
  tabIds:string[]
  featureGroup:TRaceFeatureGroup,
}

type TUpdateTab = {
  tabs:TTabItem[]
  tabsRef:TTabsRef
  old:TRaceFeature
  feature:TRaceFeature
}

type TTabsRef = {
  tabs?:TTabItem[]
}

const updateTab = ({
  old,
  tabs,
  feature,
  tabsRef,
}:TUpdateTab) => {
  tabs.forEach((tt, idx) => {
    if(tt.tab.uuid !== old.uuid) return

    tabsRef.tabs = tabsRef.tabs || [...tabs]
    const update = featureToTab(feature)
    if(tt.tab.active) update.tab.active = true

    tabsRef.tabs[idx] = update
  })
}


const updateChildPaths = ({
  tabs,
  items,
  tabIds,
  tabsRef,
  oldPath,
  featureGroup,
}:TUpdateChildPaths) => {
  return Object.entries(items)
    .reduce((acc, [key, item]) => {
      const fullLoc = item.parent.location.replace(oldPath, featureGroup.path)

      const updated = {
        ...item,
        uuid: fullLoc,
        parent: { uuid: fullLoc, location: fullLoc },
        path: item.path.replace(oldPath, featureGroup.path),
      } as TRaceFeatureItem
      
      if((`items` in updated))
        updated.items = updateChildPaths({
          tabs,
          tabIds,
          tabsRef,
          oldPath: item.path,
          items: updated.items,
          featureGroup: updated,
        })
      else if(tabIds?.length && tabIds.includes(item.uuid))
        updateTab({
          tabs,
          tabsRef,
          feature:updated,
          old:item as TRaceFeature,
        })

      acc[key] = updated

      return acc
    }, {} as TRaceFeatures)
}

export const renameGroup = ({
  tabs,
  oldPath,
  parentGroup,
  featureGroup,
}:TRenameGroup) => {

  const oldArr = groupFindArr(oldPath)
  const oldGrp = get(parentGroup.items, oldArr)

  unset(parentGroup.items, oldArr)

  const tabsRef:TTabsRef = {}
  
  const newArr = groupFindArr(featureGroup.path)

  const updated = {
    ...featureGroup,
    items: updateChildPaths({
      tabs,
      tabsRef,
      oldPath,
      featureGroup,
      items: {...oldGrp?.items, ...featureGroup.items},
      tabIds: tabs.map(tt => (tt?.tab?.uuid || ``) as string).filter(Boolean),
    })
  }

  set(parentGroup.items, newArr, updated)

  return {
    ...tabsRef,
    items: parentGroup.items
  }
}