import type { TTabAction } from '@gobletqa/components'
import type { TRaceFeatures, TRaceFeature, TRaceFeatureGroup } from '@GBR/types'

import { FeatureListItem } from './FeatureListItem'
import { FeatureListGroup } from './FeatureListGroup'


export type TFeatureItemRender = {
  active:TRaceFeature
  onActiveFeature: TTabAction
  featureGroup: TRaceFeatures
}

export const FeatureItemRender = (props:TFeatureItemRender) => {
  const {
    active,
    featureGroup,
    onActiveFeature,
  } = props

  return (
    <>
      {
        Object.entries(featureGroup)
          .map(([key, feature]) => {
            
            return (feature  as TRaceFeatureGroup)?.items
              ? (
                  <FeatureListGroup
                    active={active}
                    key={`${key}-${feature.uuid}`}
                    onActiveFeature={onActiveFeature}
                    featureGroup={feature as TRaceFeatureGroup}
                  />
                )
              : (
                  <FeatureListItem
                    active={active}
                    key={`${key}-${feature.uuid}`}
                    feature={feature as TRaceFeature}
                    onActiveFeature={onActiveFeature}
                  />
                )
          })
      }
    </>
  )
}