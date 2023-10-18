import type { CSSProperties } from 'react'
import type {
  TRaceFeatures,
  TRaceFeatureGroup,
} from '@GBR/types'

import {
  Tooltip,
  TrashIcon,
  PencilIcon,
  NewFileIcon,
  NewFolderIcon,
  DropdownHeaderText,
} from '@gobletqa/components'

import { toolTipProps, styles } from './FeatureItemHelpers'
import { FeatureGroupHeaderActions } from './FeaturesList.styled'
import { useFeatureGroupHooks } from '@GBR/hooks/featureGroups/useFeatureGroupHooks'


export type TFeatureGroupHeader = {
  text: string
  textSx?: CSSProperties
  featureGroups:TRaceFeatures
  featureGroup:TRaceFeatureGroup
}

export const FeatureGroupHeader = (props:TFeatureGroupHeader) => {
  
  const {
    text,
    textSx,
  } = props

  const {
    onEditName,
    onCreateGroup,
    onDeleteGroup,
    onCreateFeature,
  } = useFeatureGroupHooks(props)

  return (
    <>
      <DropdownHeaderText
        sx={textSx}
        className='feature-group-drp-down-txt'
      >
        {text}
      </DropdownHeaderText>
      <FeatureGroupHeaderActions className='feature-group-header-actions'>
        <Tooltip
          {...toolTipProps}
          title={`Edit the group name`}
        >
          <PencilIcon
            onClick={onEditName}
            styles={styles.altIcon}
            className='gb-race-group-header-action'
          />
        </Tooltip>
        <Tooltip
          {...toolTipProps}
          title={`Delete group and and child features`}
        >
          <TrashIcon
            onClick={onDeleteGroup}
            styles={styles.altIcon}
            className='gb-race-group-header-action'
          />
        </Tooltip>
        <Tooltip
          {...toolTipProps}
          title={`Create a new feature in the group`}
        >
          <NewFileIcon
            styles={styles.altIcon}
            onClick={onCreateFeature}
            className='gb-race-group-header-action'
          />
        </Tooltip>
        <Tooltip
          {...toolTipProps}
          title={`Create a new sub-group`}
        >
          <NewFolderIcon
            onClick={onCreateGroup}
            styles={styles.altIconLast}
            className='gb-race-group-header-action'
          />
        </Tooltip>
      </FeatureGroupHeaderActions>
    </>
  )
  
}