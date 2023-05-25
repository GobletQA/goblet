import type { TRaceFeatureGroup } from '@GBR/types'
import type { TTabItem } from '@gobletqa/components'

import { groupFindArr } from './groupFindArr'
import {emptyObj, get, unset} from '@keg-hub/jsutils'

export type TRemoveFromGroup = {
  uuid:string,
  path:string
  tabs?:TTabItem[]
  featureGroups:TRaceFeatureGroup,
}

type TUpdateTabs = {
  tabs?:TTabItem[]
  group:TRaceFeatureGroup
}

const updateTabs = ({tabs, group}:TUpdateTabs) => {
  const items = Object.values(group?.items || emptyObj)
  const isFolder = group.type === `folder`

  if(!tabs?.length || (!items.length && isFolder)) return emptyObj

  const itemIds = isFolder
    ? items.filter(item => item.type !== `folder`).map(item => item.uuid).filter(Boolean)
    : [group.uuid]

  const filterTabs = tabs.filter((tt, idx) => !tt?.tab?.uuid || !itemIds.includes((tt?.tab?.uuid)))
  if(filterTabs.length === tabs?.length) return emptyObj

  if(!filterTabs.find(tt => tt.tab.active)){
    const lIdx = filterTabs.length - 1
    const last = filterTabs[lIdx]
    if(last) filterTabs[lIdx] = {...last, tab: { ...last?.tab, active: true }}
  }

  return { tabs: filterTabs }
}

export const removeFromGroup = (props:TRemoveFromGroup) => {
  const {
    tabs,
    uuid,
    path,
    featureGroups,
  } = props

  if(!uuid || !path){
    console.warn(`[Remove Feature Group] Missing feature group item uuid or path`)
    return { items: featureGroups.items }
  }

  const items = {...featureGroups.items}
  const findArr = groupFindArr(path)
  const group = get(items, findArr)

  unset(items, findArr)

  return {
    items,
    ...updateTabs({ tabs, group }),
  }
}
