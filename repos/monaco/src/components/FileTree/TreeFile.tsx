import type { TFolder, TFile, TFileCallback } from '../../types'
import type { RefObject, Dispatch, SetStateAction } from 'react'


import { useCallback, useMemo } from 'react'

import EditIcon from '../Icons/Edit'
import { FileIcon } from '../Icons/File'
import DeleteIcon from '../Icons/Delete'
import { noOpObj } from '@keg-hub/jsutils'

import { stopPropagation } from '../../utils/dom/stopPropagation'

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

const styles = {
  fileIcon: {
    marginLeft: '14px',
    marginRight: '5px',
  },
  nameConflict: {
    color: `#E83333`,
    border: `1px solid #E83333`,
  }
}


export const TreeFile = ({
  file,
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
      `goblet-monaco-editor-list-file-item-row`,
      currentPath === file.path &&
        `goblet-monaco-editor-list-file-item-row-focused`,
    ].filter(Boolean).join(` `).trim()
  }, [currentPath, file.path])

  return (
    <div
      key={file.path}
      data-src={file.path}
      onClick={filePathChange}
      className={classNames}
    >
      {/* fileType is used here for different file type icons */}
      {/* For now, just default to basic file type */}
      <FileIcon style={styles.fileIcon} />
      {file.name && !editing ? (
        <>
          <span style={{ flex: 1 }}>{file.name}</span>
          <EditIcon
            onClick={onEdit}
            className='goblet-monaco-editor-list-split-icon'
          />
          <DeleteIcon
            onClick={onDelete}
            className='goblet-monaco-editor-list-split-icon'
          />
        </>
      ) : (
        <div
          ref={nameRef}
          contentEditable
          onBlur={fileBlur}
          spellCheck={false}
          onKeyDown={fileKeyDown}
          onClick={stopPropagation}
          className='goblet-monaco-editor-list-file-item-new'
          style={nameConflict ? styles.nameConflict : noOpObj}
        />
      )}
    </div>
  )

}