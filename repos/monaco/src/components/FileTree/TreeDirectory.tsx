import type { TFileCallback } from '../../types'
import type { RefObject, Dispatch, SetStateAction } from 'react'

import AddFileIcon from '../icons/addfile'
import AddFolderIcon from '../icons/addfolder'
import { FolderIcon } from '../icons/folder'
import { FolderOpenedIcon } from '../icons/folderOpened'
import Arrow from '../icons/arrow'
import DeleteIcon from '../icons/delete'
import EditIcon from '../icons/edit'


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
  onAddFile,
  setEditing,
  fileKeyDown,
  onAddFolder,
  setShowChild,
  onDeleteFolder,
}:TTreeDirectory) => {

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
            onClick={(e: Event) => {
              e.stopPropagation()
              setEditing(true)
            }}
            className='goblet-monaco-editor-list-split-icon'
          />
          <DeleteIcon
            onClick={(e: Event) => {
              e.stopPropagation()
              onDeleteFolder(file.path)
            }}
            className='goblet-monaco-editor-list-split-icon'
          />
          <AddFileIcon
            onClick={(e: Event) => {
              e.stopPropagation()
              setShowChild(true)
              onAddFile(file.path + '/')
            }}
            className='goblet-monaco-editor-list-split-icon'
          />
          <AddFolderIcon
            onClick={(e: Event) => {
              e.stopPropagation()
              setShowChild(true)
              onAddFolder(file.path + '/')
            }}
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
          onClick={(e: any) => e.stopPropagation()}
          className='goblet-monaco-editor-list-file-item-new'
        />
      )}
    </div>
  )

}