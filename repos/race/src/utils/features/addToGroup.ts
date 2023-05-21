import type { TRaceFeature, TRaceFeatureGroup } from '@GBR/types'
import type { TTabItem } from '@gobletqa/components'

import {emptyObj} from '@keg-hub/jsutils'
import {featureToTab} from '@GBR/utils/features/featureTabs'
import { createFromPath } from '@GBR/utils/features/createFromPath'

export type TAddToGroup = {
  tabs:TTabItem[]
  feature:TRaceFeature
  features:Partial<TRaceFeatureGroup>
}

const updateTabs = ({tabs, feature }:TAddToGroup) => {
  return !tabs.find(tt => tt.tab.uuid === feature.uuid)
    ? emptyObj
    : {
        tabs: tabs.map(tt => {
          return tt.tab.uuid !== feature.uuid
            ? tt
            : featureToTab(feature)
        })
      }
}

export const addToGroup = (props:TAddToGroup) => {
  const {
    feature,
    features
  } = props

  const added = createFromPath(
    features as TRaceFeatureGroup,
    feature,
    feature.path.split(`/`).filter(Boolean),
    feature.uuid,
    feature.path
  )

  return {
    ...updateTabs(props),
    items: added.items
  }
}