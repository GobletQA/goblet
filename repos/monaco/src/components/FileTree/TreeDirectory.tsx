import type { TFolder, TFileCallback } from '../../types'
import type { CSSProperties, RefObject, Dispatch, SetStateAction } from 'react'

import { useCallback } from 'react'
import { noOpObj } from '@keg-hub/jsutils'
import { stopPropagation } from '@GBM/utils/dom/stopPropagation'
import { toolTipProps, styles } from '@GBM/utils/file/fileHelpers'
import {
  Arrow,
  Tooltip,
  TrashIcon,
  FolderIcon,
  PencilIcon,
  NewFileIcon,
  NewFolderIcon,
  FolderOpenIcon,
} from '@gobletqa/components'

export type TTreeDirectory = {
  file: TFolder
  parent: TFolder
  editing: boolean
  showChild: boolean
  nameConflict?: boolean
  fileBlur: TFileCallback
  fileClick:TFileCallback
  onAddFile: TFileCallback
  onAddFolder: TFileCallback
  fileKeyDown: TFileCallback
  onDeleteFolder: TFileCallback
  nameRef:RefObject<HTMLDivElement>
  setEditing:Dispatch<SetStateAction<boolean>>
  setShowChild:Dispatch<SetStateAction<boolean>>
}

export const TreeDirectory = ({
  file,
  nameRef,
  editing,
  fileBlur,
  showChild,
  fileClick,
  setEditing,
  fileKeyDown,
  setShowChild,
  nameConflict,
  onDeleteFolder,
  onAddFile:addFile,
  onAddFolder:addFolder,
}:TTreeDirectory) => {

  const onEdit = useCallback((e: Event) => {
    e.stopPropagation()
    setEditing(true)
  }, [setEditing])

  const onDelete = useCallback((e: Event) => {
    e.stopPropagation()
    onDeleteFolder(file.path)
  }, [file.path])

  const onAddFolder = useCallback((e: Event) => {
    e.stopPropagation()
    setShowChild(true)
    addFolder(file.path + '/')

  }, [addFolder, file.path])

  const onAddFile = useCallback((e: Event) => {
    e.stopPropagation()
    setShowChild(true)
    addFile(file.path + '/')
  }, [addFile, file.path])

  return (
    <div
      onClick={fileClick}
      className='goblet-editor-file-item-row'
      style={styles.row as CSSProperties}
    >
      <Arrow collapse={!showChild} />
      {showChild
        ? <FolderOpenIcon styles={styles.iconFolder} />
        : <FolderIcon styles={styles.iconFolder} />
      }
      {file.name && !editing ? (
        <>
          <span style={styles.name}>{file.name}</span>
          <span className='goblet-editor-actions-container' >
            <Tooltip
              {...toolTipProps}
              title={`Edit the folder name`}
            >
              <PencilIcon
                onClick={onEdit}
                styles={styles.altIcon}
                className='goblet-editor-file-item-icon'
              />
            </Tooltip>
            <Tooltip
              {...toolTipProps}
              title={`Delete the folder and content`}
            >
              <TrashIcon
                onClick={onDelete}
                styles={styles.altIcon}
                className='goblet-editor-file-item-icon'
              />
            </Tooltip>
            <Tooltip
              {...toolTipProps}
              title={`Create a new file in the folder`}
            >
              <NewFileIcon
                onClick={onAddFile}
                styles={styles.altIcon}
                className='goblet-editor-file-item-icon'
              />
            </Tooltip>
            <Tooltip
              {...toolTipProps}
              title={`Create a new sub-folder`}
            >
              <NewFolderIcon
                onClick={onAddFolder}
                styles={styles.altIconLast}
                className='goblet-editor-file-item-icon'
              />
            </Tooltip>
          </span>
        </>
      ) : (
        <div
          ref={nameRef}
          contentEditable
          onBlur={fileBlur}
          spellCheck={false}
          onKeyDown={fileKeyDown}
          onClick={stopPropagation}
          className='goblet-editor-file-item-new'
          style={nameConflict ? styles.conflictFolder : noOpObj}
        />
      )}
    </div>
  )

}