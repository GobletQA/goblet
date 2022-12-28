import type { TFolder, TFileCallback } from '../../types'
import type { RefObject, Dispatch, SetStateAction } from 'react'

import { useCallback } from 'react'
import { noOpObj } from '@keg-hub/jsutils'

import EditIcon from '../Icons/Edit'
import { Arrow } from '../Icons/Arrow'
import DeleteIcon from '../Icons/Delete'
import AddFileIcon from '../Icons/AddFile'
import { FolderIcon } from '../Icons/Folder'
import AddFolderIcon from '../Icons/AddFolder'
import { FolderOpenedIcon } from '../Icons/FolderOpened'
import { stopPropagation } from '../../utils/dom/stopPropagation'

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

const styles = {
  name: {
    flex: 1
  },
  folderIcon: {
    marginRight: '5px'
  },
  nameConflict: {
    color: `#E83333`,
  }
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
      style={{
        paddingLeft: `5px`,
        position: `relative`,
      }}
    >
      <Arrow collapse={!showChild} />
      {showChild
        ? <FolderOpenedIcon style={styles.folderIcon} />
        : <FolderIcon style={styles.folderIcon} />
      }
      {file.name && !editing ? (
        <>
          <span style={styles.name}>{file.name}</span>
          <span className='goblet-editor-actions-container' >
            <EditIcon
              onClick={onEdit}
              className='goblet-editor-file-item-icon'
            />
            <DeleteIcon
              onClick={onDelete}
              className='goblet-editor-file-item-icon'
            />
            <AddFileIcon
              onClick={onAddFile}
              className='goblet-editor-file-item-icon'
            />
            <AddFolderIcon
              onClick={onAddFolder}
              className='goblet-editor-file-item-icon'
            />
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
          style={nameConflict ? styles.nameConflict : noOpObj}
        />
      )}
    </div>
  )

}