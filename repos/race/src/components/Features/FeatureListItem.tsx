import type { TTabAction } from '@gobletqa/components'
import type { TRaceFeature } from '@GBR/types'

import { useCallback } from 'react'
import { cls, wordCaps } from '@keg-hub/jsutils'
import { FeatureItemActions } from './FeatureItemActions'
import {
  FeatureItem,
  FeatureItemName,
} from './FeaturesList.styled'

export type TFeatureListItem = {
  active:TRaceFeature
  feature:TRaceFeature
  onActiveFeature: TTabAction
}

export const FeatureListItem = (props:TFeatureListItem) => {
  const { active, feature, onActiveFeature } = props

  const onClick = useCallback(() => onActiveFeature(feature), [feature, onActiveFeature])

  const isActive = feature?.uuid === active?.uuid

  // TODO: update these to actually change the file
  const setEditing = () => {
    console.log(`------- editing feature -------`)
  }
  const onDeleteFile = () => {
    console.log(`------- delete feature -------`)
  }

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
        setEditing={setEditing}
        currentPath={active?.path}
        onDeleteFile={onDeleteFile}
      />
    </FeatureItem>
  )
}