import type { TFileCallback } from '../../types'
import type { RefObject, Dispatch, SetStateAction } from 'react'

import EditIcon from '../icons/edit'
import DeleteIcon from '../icons/delete'
import { FileIcon } from '../icons/file'

export type TTreeFile = {
  file: any
  editing: boolean
  currentPath: string
  fileBlur: TFileCallback
  fileKeyDown: TFileCallback
  onDeleteFile: TFileCallback
  filePathChange: TFileCallback
  nameRef:RefObject<HTMLDivElement>
  setEditing: Dispatch<SetStateAction<boolean>>
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
  filePathChange,
}:TTreeFile) => {

  const fileType = file.name && file.name.indexOf('.') !== -1
    ? `file_type_${file.name.split('.').slice(-1)}`
    : 'default_file'

  return (
    <div
      data-src={file.path}
      onClick={filePathChange}
      key={file.path}
      className={`goblet-monaco-editor-list-file-item-row ${
        currentPath === file.path
          ? 'goblet-monaco-editor-list-file-item-row-focused'
          : ''
      }`}
    >
      <FileIcon
        style={{
          marginLeft: '14px',
          marginRight: '5px',
        }}
      />
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
              onDeleteFile(file.path)
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