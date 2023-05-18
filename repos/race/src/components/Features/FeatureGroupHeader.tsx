import type { RefObject, CSSProperties } from 'react'
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

import { useCallback } from 'react'
import { emptyObj } from '@keg-hub/jsutils'
import { toolTipProps, styles } from './FeatureItemHelpers'

export type TFeatureGroupHeader = {
  text: string
  editing?:boolean
  nameConflict?:boolean
  textSx?: CSSProperties
  onBlur?:(evt:any) => void
  onKeyDown?:(evt:any) => void
  setEditing?:(state:boolean) => void
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
    setEditing,
    nameConflict,
  } = props

  const onEdit = useCallback((evt: Event) => {
    stopPropagation(evt)
    setEditing?.(true)
  }, [setEditing])

  const onDelete = useCallback((evt: Event) => {
    stopPropagation(evt)
    // onDeleteFolder(file.path)
  }, [])

  const onAddFolder = useCallback((evt: Event) => {
    stopPropagation(evt)
    // setShowChild(true)
    // addFolder(file.path + '/')

  }, [])

  const onAddFile = useCallback((evt: Event) => {
    stopPropagation(evt)
    // setShowChild(true)
    // addFile(file.path + '/')
  }, [])

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
                onClick={onEdit}
                styles={styles.altIcon}
                className='gb-race-group-header-action'
              />
            </Tooltip>
            <Tooltip
              {...toolTipProps}
              title={`Delete group and and child features`}
            >
              <TrashIcon
                onClick={onDelete}
                styles={styles.altIcon}
                className='gb-race-group-header-action'
              />
            </Tooltip>
            <Tooltip
              {...toolTipProps}
              title={`Create a new feature in the group`}
            >
              <NewFileIcon
                onClick={onAddFile}
                styles={styles.altIcon}
                className='gb-race-group-header-action'
              />
            </Tooltip>
            <Tooltip
              {...toolTipProps}
              title={`Create a new sub-group`}
            >
              <NewFolderIcon
                onClick={onAddFolder}
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