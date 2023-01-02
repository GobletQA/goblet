import type { TTabAction } from '@gobletqa/components'
import type { TRaceFeatures, TRaceFeature, TRaceFeatureGroup } from '@GBR/types'

import { useMemo } from 'react'
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

  // TODO: clean this up, sorting could be handled when the groups and items are set
  // Not right before render 
  const {
    items,
    groups
  } = useMemo(() => {
    const {
      items,
      groups
    } = Object.entries(featureGroup)
      .reduce((acc, [key, feature]) => {

        ;(feature  as TRaceFeatureGroup)?.items
          ? acc.groups.push(
              <FeatureListGroup
                active={active}
                key={`${feature?.title || key}-${feature.uuid}`}
                onActiveFeature={onActiveFeature}
                featureGroup={feature as TRaceFeatureGroup}
              />
            )
          : acc.items.push(
              <FeatureListItem
                active={active}
                key={`${feature?.title || key}-${feature.uuid}`}
                feature={feature as TRaceFeature}
                onActiveFeature={onActiveFeature}
              />
            )
        
        return acc
      }, { groups: [], items: [] } as Record<`groups`|`items`, JSX.Element[]> )
    
    // TODO: This uses the exposed key on the react-object
    // Not the best solution, need to fix it
    return {
      // @ts-ignore
      items: items.sort((a,b) => (a.key > b.key) ? 1 : ((b.key > a.key) ? -1 : 0)),
      // @ts-ignore
      groups: groups.sort((a,b) => (a.key > b.key) ? 1 : ((b.key > a.key) ? -1 : 0)),
    }
    
  }, [featureGroup, active, onActiveFeature])

  return (
    <>
      {groups}
      {items}
    </>
  )
}