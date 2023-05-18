import type {
  RefObject,
  CSSProperties
} from 'react'
import {
  Tooltip,
  TrashIcon,
  PencilIcon,
  NewFileIcon,
  NewFolderIcon,
  stopPropagation,
  DropdownHeaderText,
} from '@gobletqa/components'

import { 
  FeatureGroupHeaderEdit,
  FeatureGroupHeaderActions,
} from './FeaturesList.styled'

import { emptyObj } from '@keg-hub/jsutils'
import { toolTipProps, styles } from './FeatureItemHelpers'


export type TFeatureGroupHeader = {
  text: string
  editing?:boolean
  nameConflict?:boolean
  textSx?: CSSProperties
  onBlur?:(evt:any) => void
  onKeyDown?:(evt:any) => void
  onEditName?:(evt:any) => void
  onDeleteGroup?:(evt:any) => void
  onAddSubFolder?:(evt:any) => void
  onCreateFeature?:(evt:any) => void
  nameRef:RefObject<HTMLDivElement|undefined>
}

export const FeatureGroupHeader = (props:TFeatureGroupHeader) => {
  
  const {
    text,
    onBlur,
    textSx,
    editing,
    nameRef,
    onKeyDown,
    onEditName,
    nameConflict,
    onDeleteGroup,
    onAddSubFolder,
    onCreateFeature
  } = props

  return (
    <>
      {editing ? (
        <FeatureGroupHeaderEdit
          ref={nameRef}
          contentEditable
          onBlur={onBlur}
          spellCheck={false}
          onKeyDown={onKeyDown}
          onClick={stopPropagation}
          className='gb-race-group-item-edit'
          style={nameConflict ? styles.conflictFolder : emptyObj}
        />
      ) : (
        <>
          <DropdownHeaderText sx={textSx} >{text}</DropdownHeaderText>
          <FeatureGroupHeaderActions>
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
                onClick={onAddSubFolder}
                styles={styles.altIconLast}
                className='gb-race-group-header-action'
              />
            </Tooltip>
          </FeatureGroupHeaderActions>
        </>
      )}
    </>
  )
  
}