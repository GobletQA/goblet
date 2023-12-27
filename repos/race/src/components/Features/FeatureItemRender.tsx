import type {
  TRaceFeature,
  TRaceFeatures,
  TRaceFeatureGroup,
  TEditorFeatureActions,
} from '@GBR/types'

import { useMemo } from 'react'
import { FeatureListItem } from './FeatureListItem'
import { FeatureListGroup } from './FeatureListGroup'


export type TFeatureItemRender = TEditorFeatureActions & {
  active:TRaceFeature
  featureGroup:TRaceFeatures
  featureGroups:TRaceFeatures
}

export const FeatureItemRender = (props:TFeatureItemRender) => {
  const {
    active,
    editingName,
    featureGroup,
    featureGroups,
    onEditFeature,
    onDeleteFeature,
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
      .reduce((acc, [key, item]) => {

        ;(item as TRaceFeatureGroup)?.items
          ? acc.groups.push(
              <FeatureListGroup
                active={active}
                editingName={editingName}
                onEditFeature={onEditFeature}
                featureGroups={featureGroups}
                onDeleteFeature={onDeleteFeature}
                onActiveFeature={onActiveFeature}
                featureGroup={item as TRaceFeatureGroup}
                key={`${(item as TRaceFeatureGroup)?.title || key}-${item.uuid}`}
              />
            )
          : acc.items.push(
              <FeatureListItem
                active={active}
                editingName={editingName}
                featureGroups={featureGroups}
                onEditFeature={onEditFeature}
                feature={item as TRaceFeature}
                onDeleteFeature={onDeleteFeature}
                onActiveFeature={onActiveFeature}
                key={`${(item as TRaceFeature)?.feature || key}-${item.uuid}`}
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
    
  }, [
    active,
    editingName,
    featureGroup,
    onEditFeature,
    onActiveFeature,
    onDeleteFeature,
  ])

  return (
    <>
      {groups}
      {items}
    </>
  )
}