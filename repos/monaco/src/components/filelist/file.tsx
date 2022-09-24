import React, { useCallback, useState, useMemo, useRef, useEffect } from 'react'
import Icon from '../icons'
import Arrow from '../icons/arrow'
import EditIcon from '../icons/edit'
import DeleteIcon from '../icons/delete'
import AddFileIcon from '../icons/addfile'
import AddFolderIcon from '../icons/addfolder'

export const File: React.FC<{
  file: any
  onPathChange: (key: string) => void
  root: boolean
  currentPath?: string
  onAddFile: (...args: any[]) => void
  onConfirmAddFile: (...args: any[]) => void
  onDeleteFile: (...args: any[]) => void
  onEditFileName: (...args: any[]) => void
  onConfirmAddFolder: (...args: any[]) => void
  onAddFolder: (...args: any[]) => void
  onDeleteFolder: (...args: any[]) => void
  onEditFolderName: (...args: any[]) => void
}> = ({
  file,
  onPathChange,
  currentPath = '',
  root,
  onAddFile,
  onConfirmAddFile,
  onDeleteFile,
  onEditFileName,
  onConfirmAddFolder,
  onAddFolder,
  onDeleteFolder,
  onEditFolderName,
}) => {
  const [showChild, setShowChild] = useState(false)
  const [editing, setEditing] = useState(false)
  const nameRef = useRef<HTMLDivElement>(null)
  const handleClick = useCallback(() => {
    setShowChild(pre => !pre)
  }, [])

  const handlePathChange = useCallback(
    (e:any) => {
      const key = e.currentTarget.dataset.src!
      onPathChange(key)
    },
    [onPathChange]
  )

  const handleBlur = useCallback(
    (e: any) => {
      const name = nameRef.current?.textContent
      if (editing) {
        setEditing(false)
        if (file.name !== name) {
          if (file._isDirectory) {
            onEditFolderName(file.path, name)
          }
          else {
            onEditFileName(file.path, name)
          }
        }
      }
      else if (file._isDirectory) {
        onConfirmAddFolder({
          ...file,
          name,
        })
      }
      else {
        onConfirmAddFile({
          ...file,
          name,
        })
      }
    },
    [
      editing,
      file,
      onEditFileName,
      onConfirmAddFile,
      onConfirmAddFolder,
      onEditFolderName,
    ]
  )

  const handleKeyDown = useCallback(
    (e: any) => {
      if (e.keyCode === 13) {
        e.preventDefault()
        handleBlur(e)
      }
    },
    [handleBlur]
  )

  useEffect(() => {
    if (!root && !file.name) {
      nameRef.current!.focus()
    }
  }, [file, root])

  useEffect(() => {
    if (editing) {
      const dotIndex = file.name.indexOf('.')
      nameRef.current!.textContent = file.name
      nameRef.current!.focus()
      const selection = window.getSelection()
      const range = document.createRange()
      range.setStart(nameRef.current?.firstChild!, 0)
      range.setEnd(
        nameRef.current?.firstChild!,
        dotIndex > 0 ? dotIndex : file.name.length
      )
      selection?.removeAllRanges()
      selection?.addRange(range)
    }
  }, [editing, file])

  const keys = useMemo(() => {
    if (file._isFile) return []
    const childs = file.children
    const folders = Object.keys(childs)
      .filter(key => !childs[key]._isFile)
      .sort()
    const files = Object.keys(childs)
      .filter(key => childs[key]._isFile)
      .sort()
    return folders.concat(files)
  }, [file])

  useEffect(() => {
    if (currentPath && currentPath.startsWith(file.path + '/')) {
      setShowChild(true)
    }
  }, [currentPath, file.path])

  if (file._isFile) {
    let fileType
    if (file.name && file.name.indexOf('.') !== -1) {
      fileType = `file_type_${file.name.split('.').slice(-1)}`
    }
    else {
      fileType = 'default_file'
    }

    return (
      <div
        data-src={file.path}
        onClick={handlePathChange}
        key={file.path}
        className={`goblet-monaco-editor-list-file-item-row ${
          currentPath === file.path
            ? 'goblet-monaco-editor-list-file-item-row-focused'
            : ''
        }`}
      >
        <Icon
          type={fileType}
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
            onClick={(e: any) => {
              e.stopPropagation()
            }}
            spellCheck={false}
            onKeyDown={handleKeyDown}
            onBlur={handleBlur}
            ref={nameRef}
            className='goblet-monaco-editor-list-file-item-new'
            contentEditable
          />
        )}
      </div>
    )
  }
  return (
    <div className='goblet-monaco-editor-list-file-item'>
      {file._isDirectory && (
        <div onClick={handleClick} className='goblet-monaco-editor-list-file-item-row'>
          <Arrow collpase={!showChild} />
          <Icon
            style={{
              marginRight: '5px',
            }}
            type={showChild ? 'default_folder_opened' : 'default_folder'}
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
              onClick={(e: any) => {
                e.stopPropagation()
              }}
              spellCheck={false}
              onKeyDown={handleKeyDown}
              onBlur={handleBlur}
              ref={nameRef}
              className='goblet-monaco-editor-list-file-item-new'
              contentEditable
            />
          )}
        </div>
      )}
      {(showChild || root) && (
        <div style={{ paddingLeft: file._isDirectory ? '7px' : '0' }}>
          {keys.map(item => (
            <File
              onEditFileName={onEditFileName}
              onEditFolderName={onEditFolderName}
              onDeleteFile={onDeleteFile}
              onDeleteFolder={onDeleteFolder}
              onConfirmAddFile={onConfirmAddFile}
              onConfirmAddFolder={onConfirmAddFolder}
              onAddFile={onAddFile}
              onAddFolder={onAddFolder}
              currentPath={currentPath}
              root={false}
              file={file.children[item]}
              onPathChange={onPathChange}
              key={item}
            />
          ))}
        </div>
      )}
    </div>
  )
}
