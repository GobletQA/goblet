import type { TFolder, TFile, TFileCallback } from '../../types'
import type { RefObject, Dispatch, SetStateAction } from 'react'


import { useCallback, useMemo } from 'react'
import { emptyObj } from '@keg-hub/jsutils'
import { stopPropagation } from '@GBM/utils/dom/stopPropagation'
import { toolTipProps, styles } from '@GBM/utils/file/fileHelpers'
import {
  Tooltip,
  FileIcon,
  TrashIcon,
  PencilIcon,
} from '@gobletqa/components'

import {
  TreeEditItem,
  TreeItemName,
  TreeItemContainer,
  TreeItemActionsContainer
} from './FileTree.styled'


export type TTreeFile = {
  file: TFile
  parent: TFolder
  editing: boolean
  currentPath: string
  nameConflict?: boolean
  fileBlur: TFileCallback
  fileKeyDown: TFileCallback
  onDeleteFile: TFileCallback
  filePathChange: TFileCallback
  nameRef:RefObject<HTMLDivElement>
  setEditing: Dispatch<SetStateAction<boolean>>
}

export const TreeFile = ({
  file,
  parent,
  nameRef,
  editing,
  fileBlur,
  setEditing,
  currentPath,
  fileKeyDown,
  onDeleteFile,
  nameConflict,
  filePathChange,
}:TTreeFile) => {

  // const fileType = useFileType(file.name)

  const onEdit = useCallback((e: Event) => {
    e.stopPropagation()
    setEditing(true)
  }, [setEditing])

  const onDelete = useCallback((e: Event) => {
    e.stopPropagation()
    onDeleteFile(file.path)
  }, [file.path])

  const classNames = useMemo(() => {
    return [
      `gb-editor-file-item-row`,
      currentPath === file.path &&
        `gb-editor-file-item-row-focused`,
    ].filter(Boolean).join(` `).trim()
  }, [currentPath, file.path])

  return (
    <TreeItemContainer
      key={file.path}
      data-src={file.path}
      className={classNames}
      parentPath={parent.path}
      onClick={filePathChange}
    >
      {/* fileType is used here for different file type icons */}
      {/* For now, just default to basic file type */}
      <FileIcon styles={styles.iconFile} />
      {file.name && !editing ? (
        <>
          <TreeItemName>
            {file.name}
          </TreeItemName>
          <TreeItemActionsContainer className='gb-editor-actions-container'>
            <Tooltip
              {...toolTipProps}
              title={`Edit the file name`}
            >
              <PencilIcon
                onClick={onEdit}
                styles={styles.altIcon}
                className='gb-editor-file-item-icon'
              />
            </Tooltip>
            <Tooltip
              {...toolTipProps}
              title={`Delete the file`}
            >
              <TrashIcon
                onClick={onDelete}
                styles={styles.altIconLast}
                className='gb-editor-file-item-icon'
              />
            </Tooltip>
          </TreeItemActionsContainer>
        </>
      ) : (
        <TreeEditItem
          ref={nameRef}
          contentEditable
          onBlur={fileBlur}
          spellCheck={false}
          onKeyDown={fileKeyDown}
          onClick={stopPropagation}
          className='gb-editor-file-item-edit'
          style={nameConflict ? styles.conflictFile : emptyObj}
        />
      )}
    </TreeItemContainer>
  )

}