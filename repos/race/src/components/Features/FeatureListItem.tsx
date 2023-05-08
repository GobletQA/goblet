import type { MouseEventHandler } from 'react'
import type { TRaceFeature, TEditorFeatureActions } from '@GBR/types'

import { useCallback } from 'react'
import { cls, wordCaps } from '@keg-hub/jsutils'
import { FeatureItemActions } from './FeatureItemActions'
import { FeatureItem, FeatureItemName } from './FeaturesList.styled'

export type TFeatureListItem = TEditorFeatureActions & {
  active:TRaceFeature
  feature:TRaceFeature
}

export const FeatureListItem = (props:TFeatureListItem) => {
  const {
    active,
    feature,
    onEditFeature,
    onActiveFeature,
    onDeleteFeature,
  } = props

  const onClick = useCallback<MouseEventHandler<HTMLDivElement>>(
    (evt) => onActiveFeature?.(evt, feature),
    [feature, onActiveFeature]
  )

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