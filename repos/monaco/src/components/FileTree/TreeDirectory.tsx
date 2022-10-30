import type { TFileCallback } from '../../types'
import type { RefObject, Dispatch, SetStateAction } from 'react'

import { useCallback } from 'react'

import Arrow from '../Icons/Arrow'
import EditIcon from '../Icons/Edit'
import DeleteIcon from '../Icons/Delete'
import AddFileIcon from '../Icons/Addfile'
import { FolderIcon } from '../Icons/Folder'
import AddFolderIcon from '../Icons/Addfolder'
import { FolderOpenedIcon } from '../Icons/FolderOpened'
import { stopPropagation } from '../../utils/dom/stopPropagation'


export type TTreeDirectory = {
  file: any
  editing: boolean
  showChild: boolean
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
    <div onClick={fileClick} className='goblet-monaco-editor-list-file-item-row'>
      <Arrow collapse={!showChild} />
      {showChild
        ? <FolderOpenedIcon style={{ marginRight: '5px' }} />
        : <FolderIcon style={{ marginRight: '5px' }} />
      }
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
          <AddFileIcon
            onClick={onAddFile}
            className='goblet-monaco-editor-list-split-icon'
          />
          <AddFolderIcon
            onClick={onAddFolder}
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
        />
      )}
    </div>
  )

}