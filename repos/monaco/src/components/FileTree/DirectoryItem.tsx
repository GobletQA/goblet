import type { TFolder, TFileCallback } from '../../types'
import type { Dispatch, SetStateAction } from 'react'

import { useCallback } from 'react'
import { toolTipProps, styles } from '@GBM/utils/file/fileHelpers'
import {
  Tooltip,
  TrashIcon,
  PencilIcon,
  NewFileIcon,
  NewFolderIcon,
} from '@gobletqa/components'

import {
  TreeItemName,
  TreeItemActionsContainer
} from './FileTree.styled'

export type TTreeDirectory = {
  file: TFolder
  onAddFile: TFileCallback
  onAddFolder: TFileCallback
  onDeleteFolder: TFileCallback
  setEditing:Dispatch<SetStateAction<boolean>>
  setShowChild:Dispatch<SetStateAction<boolean>>
}

export const DirectoryItem = ({
  file,
  setEditing,
  setShowChild,
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
    <>
      <TreeItemName className='gb-editor-directory-ame' >
        {file.name}
      </TreeItemName>
      <TreeItemActionsContainer className='gb-editor-actions-container'>
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
      </TreeItemActionsContainer>
    </>
  )
  
}