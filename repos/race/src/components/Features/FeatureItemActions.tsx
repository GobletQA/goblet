import type {
  TRaceFeature,
  TEditorFeatureActions
} from '@GBR/types'

import { useCallback, useMemo } from 'react'
import { toolTipProps, styles } from './FeatureItemHelpers'
import { FeatureItemActionsContainer } from './FeaturesList.styled'
import {
  Tooltip,
  TrashIcon,
  stopEvent,
  PencilIcon,
} from '@gobletqa/components'

export type TFeatureItemActions = TEditorFeatureActions & {
  currentPath?:string
  feature:TRaceFeature
}

export const FeatureItemActions = (props:TFeatureItemActions) => {

  const {
    feature,
    currentPath,
    onEditFeature,
    onDeleteFeature,
  } = props

  const onEdit = useCallback((e:Event) => {
    if(!onEditFeature) return

    stopEvent(e)
    onEditFeature?.(e, feature.uuid)
  }, [onEditFeature, feature])

  const onDelete = useCallback((e:Event) => {
    if(!onDeleteFeature) return

    stopEvent(e)
    onDeleteFeature?.(e, feature.path)
  }, [feature.path])


  const classNames = useMemo(() => {
    return [
      `gb-race-feature-item-row`,
      currentPath === feature.path &&
        `gb-race-feature-item-row-focused`,
    ].filter(Boolean).join(` `).trim()
  }, [currentPath, feature.path])

  return (
    <FeatureItemActionsContainer className={classNames} >

      {onEditFeature && (
        <Tooltip
          {...toolTipProps}
          title={`Edit the feature name`}
        >
          <PencilIcon
            onClick={onEdit}
            styles={styles.altIcon}
            className='gb-race-feature-item-icon'
          />
        </Tooltip>
      ) || null}

      {onDeleteFeature && (
        <Tooltip
          {...toolTipProps}
          title={`Delete the file`}
        >
          <TrashIcon
            onClick={onDelete}
            styles={styles.altIconLast}
            className='gb-race-feature-item-icon'
          />
        </Tooltip>
      ) || null}

    </FeatureItemActionsContainer>
  )

}