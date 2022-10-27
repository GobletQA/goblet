import type { TFileProps } from '../../types'

import { useFileHooks } from '../../hooks/file/useFileHooks'
import { TreeFile } from './TreeFile'
import { useFileCallbacks } from '../../hooks/file/useFileCallbacks'
import { TreeDirectory } from './TreeDirectory'

export const File = (props:TFileProps) => {
  const {
    file,
    root,
    onAddFile,
    onAddFolder,
    onPathChange,
    onDeleteFile,
    rootPrefix=``,
    onEditFileName,
    onDeleteFolder,
    currentPath = '',
    onEditFolderName,
    onConfirmAddFile,
    onConfirmAddFolder,
  } = props

  const {
    keys,
    editing,
    nameRef,
    showChild,
    setEditing,
    setShowChild,
  } = useFileHooks(props)

  const {
    fileBlur,
    fileClick,
    fileKeyDown,
    filePathChange,
  } = useFileCallbacks({
    file,
    nameRef,
    editing,
    setEditing,
    setShowChild,
    onPathChange,
    onEditFileName,
    onEditFolderName,
    onConfirmAddFile,
    onConfirmAddFolder,
  })

  return file.ext
    ? (
        <TreeFile
          file={file}
          nameRef={nameRef}
          editing={editing}
          fileBlur={fileBlur}
          setEditing={setEditing}
          currentPath={currentPath}
          fileKeyDown={fileKeyDown}
          onDeleteFile={onDeleteFile}
          filePathChange={filePathChange}
        />
      )
    : (
        <div className='goblet-monaco-editor-list-file-item'>
          {file._isDirectory && (
            <TreeDirectory
              file={file}
              nameRef={nameRef}
              editing={editing}
              fileBlur={fileBlur}
              showChild={showChild}
              fileClick={fileClick}
              onAddFile={onAddFile}
              setEditing={setEditing}
              fileKeyDown={fileKeyDown}
              onAddFolder={onAddFolder}
              setShowChild={setShowChild}
              onDeleteFolder={onDeleteFolder}
            />
          )}

          {(showChild || root) && (
            <div style={{ paddingLeft: file._isDirectory ? '7px' : '0' }}>
              {keys.map(item => (
                <File
                  key={item}
                  root={false}
                  onAddFile={onAddFile}
                  rootPrefix={rootPrefix}
                  onAddFolder={onAddFolder}
                  currentPath={currentPath}
                  file={file.children[item]}
                  onPathChange={onPathChange}
                  onDeleteFile={onDeleteFile}
                  onEditFileName={onEditFileName}
                  onDeleteFolder={onDeleteFolder}
                  onConfirmAddFile={onConfirmAddFile}
                  onEditFolderName={onEditFolderName}
                  onConfirmAddFolder={onConfirmAddFolder}
                />
              ))}
            </div>
          )}
        </div>
      )
}
