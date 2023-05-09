import type { TRaceFeature, TEditorFeatureActions } from '@GBR/types'

import { cls, wordCaps } from '@keg-hub/jsutils'
import { FeatureItemActions } from './FeatureItemActions'
import { FeatureItem, FeatureItemName } from './FeaturesList.styled'
import { useEventEmit, OnTabActiveEvent } from '@gobletqa/components'

export type TFeatureListItem = TEditorFeatureActions & {
  active:TRaceFeature
  feature:TRaceFeature
}

export const FeatureListItem = (props:TFeatureListItem) => {
  const {
    active,
    feature,
    onEditFeature,
    onDeleteFeature,
  } = props

  /**
   * Instead of calling onActiveFeature, emit the OnTabActiveEvent event
   * The Tabs hooks are listening for this event
   * When emitted it will update the currently opened tabs
   * And calls the onActiveFeature method
   * This ensures the tabs are updated and the feature becomes active
   */
  const onClick = useEventEmit(OnTabActiveEvent, { feature })
  const isActive = feature?.uuid === active?.uuid

  return (
    <FeatureItem
      onClick={onClick}
      focusRipple={true}
      selected={isActive}
      disableRipple={true}
      disableTouchRipple={true}
      className={cls(`gb-features-list-item`, isActive && `active`)}
    >
      <FeatureItemName>
        {wordCaps(feature.feature)}
      </FeatureItemName>
      <FeatureItemActions
        feature={feature}
        currentPath={active?.path}
        onEditFeature={onEditFeature}
        onDeleteFeature={onDeleteFeature}
      />
    </FeatureItem>
  )
}