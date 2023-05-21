import type { TTabItem } from '@gobletqa/components'
import type { TRaceFeatures, TRaceFeature } from '@GBR/types'

import { groupFindArr } from './groupFindArr'
import {emptyObj, set, unset} from '@keg-hub/jsutils'
import {featureToTab} from '@GBR/utils/features/featureTabs'

export type TRenameGroup = {
  tabs:TTabItem[]
  old:TRaceFeature,
  feature:TRaceFeature,
  features:Record<`items`, TRaceFeatures>,
}

const updateTabs = ({tabs, old, feature }:TRenameGroup) => {
  return !tabs.find(tt => tt.tab.uuid === old.uuid)
    ? emptyObj
    : {
        tabs: tabs.map(tt => {
          if(tt.tab.uuid !== old.uuid) return tt
          
          const update = featureToTab(feature)
          if(tt.tab.active) update.tab.active = true

          return update
        })
      }
}

export const renameFeatureInGroup = (props:TRenameGroup) => {
  const {
    old,
    feature,
    features,
  } = props

  const oldArr = groupFindArr(old.path)

  unset(features.items, oldArr)

  const newArr = groupFindArr(feature.path)

  set(features.items, newArr, feature)

  const update = updateTabs(props)

  return {
    ...update,
    items: features.items
  }
}