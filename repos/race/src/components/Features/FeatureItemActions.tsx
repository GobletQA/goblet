import type {
  TRaceFeature,
  TEditorFeatureActions
} from '@GBR/types'

import { cls } from '@keg-hub/jsutils'
import { useCallback, useMemo } from 'react'
import { toolTipProps, styles } from './FeatureItemHelpers'
import { openYesNo } from '@GBR/actions/general/toggleConfirm'
import { FeatureItemActionsContainer } from './FeaturesList.styled'
import {
  RedText,
  Tooltip,
  TrashIcon,
  stopEvent,
  PencilIcon,
} from '@gobletqa/components'

export type TFeatureItemActions = TEditorFeatureActions & {
  currentPath?:string
  feature:TRaceFeature
}

const DeleteFeatureMsg = ({ feature }:TFeatureItemActions) => {
  return (
    <>
      Are you sure your want to delete feature <b><RedText>{feature?.feature}</RedText></b>?
    </>
  )
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
    stopEvent(e)

    openYesNo({
      title: `Delete Feature`,
      text: <DeleteFeatureMsg feature={feature} />,
      yes: {onClick: () => onDeleteFeature?.(e, feature.path)}
    })
  }, [
    feature?.uuid,
    feature?.feature,
  ])


  const classNames = useMemo(() => {
    return [
      `gb-race-feature-item-row`,
      currentPath === feature.path &&
        `gb-race-feature-item-row-focused`,
    ].filter(Boolean).join(` `).trim()
  }, [currentPath, feature.path])

  return (
    <FeatureItemActionsContainer className={cls(classNames, `gb-feature-item-action-container`)} >

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