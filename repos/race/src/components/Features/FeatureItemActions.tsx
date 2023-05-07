
import type { TRaceFeature } from '@GBR/types'
import type { RefObject, Dispatch, SetStateAction } from 'react'

import { noOpObj } from '@keg-hub/jsutils'
import { useCallback, useMemo } from 'react'
import { toolTipProps, styles } from './FeatureItemHelpers'

import {
  Tooltip,
  FileIcon,
  TrashIcon,
  stopEvent,
  PencilIcon,
  stopPropagation,
} from '@gobletqa/components'

import {
  FeatureItemActionsContainer,
} from './FeaturesList.styled'


export type TFeatureItemActions = {
  currentPath?:string
  feature:TRaceFeature
  setEditing:(state:boolean) => void
  onDeleteFile:(path:string) => void
}

export const FeatureItemActions = (props:TFeatureItemActions) => {

  const {
    feature,
    setEditing,
    currentPath,
    onDeleteFile,
  } = props

  const onEdit = useCallback((e: Event) => {
    stopEvent(e)
    setEditing(true)
  }, [setEditing])

  const onDelete = useCallback((e: Event) => {
    stopEvent(e)
    onDeleteFile(feature.path)
  }, [feature.path])


  const classNames = useMemo(() => {
    return [
      `gb-race-feature-item-row`,
      currentPath === feature.path &&
        `gb-race-feature-item-row-focused`,
    ].filter(Boolean).join(` `).trim()
  }, [currentPath, feature.path])

  return (
    <FeatureItemActionsContainer>
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
    </FeatureItemActionsContainer>
  )

}