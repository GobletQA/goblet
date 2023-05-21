import type { TTabItem } from '@gobletqa/components'
import type {
  TRaceFeature,
  TRaceFeatureGroup,
} from '@GBR/types'

import { groupFindArr } from './groupFindArr'
import {emptyObj, set, unset} from '@keg-hub/jsutils'
import { EmptyFeatureUUID } from '@GBR/constants/values'
import {featureToTab} from '@GBR/utils/features/featureTabs'

export type TFeatureFromLoc = {
  tabs:TTabItem[]
  old:TRaceFeature
  feature:TRaceFeature
  features:Partial<TRaceFeatureGroup>
}

type TUpdateTabs = {
  tabs: TTabItem[]
  feature:TRaceFeature,
  replaceEmptyKey:boolean
}

const updateTabs = ({
  tabs,
  feature,
  replaceEmptyKey
}:TUpdateTabs) => {

  const tabMatch = tabs.find(tt => (
    tt?.tab?.uuid === feature.uuid
      || tt?.tab?.uuid === EmptyFeatureUUID
  ))

  if(!tabMatch) return emptyObj

  return {
    tabs: tabs.map(tt => {
      const emptyMatch = replaceEmptyKey && tt.tab.uuid === EmptyFeatureUUID
      const uuidMatch = tt.tab.uuid === feature.uuid
      if(!uuidMatch && !emptyMatch) return tt

      const update = featureToTab(feature)
      if(tt.tab.active) update.tab.active = true

      return update
    })
  }
}

export const updateFeatureInGroup = ({
  old,
  tabs,
  feature,
  features,
}:TFeatureFromLoc) => {

  const items = {...features.items}
  const sameLoc = old.path === feature.path

  if(!sameLoc){
    const oldArr = groupFindArr(old.path)
    unset(items, oldArr)
  }

  const newArr = groupFindArr(feature.path)
  set(items, newArr, feature)

  const updates = updateTabs({
    tabs,
    feature,
    replaceEmptyKey: !sameLoc && old.path.includes(EmptyFeatureUUID)
  })

  return {
    ...updates,
    items,
  }
}