import type { TFileProps, TFolder, TFile } from '../../types'

import { TreeFile } from './TreeFile'
import { TreeDirectory } from './TreeDirectory'
import { useFileHooks } from '../../hooks/file/useFileHooks'
import { useFileCallbacks } from '../../hooks/file/useFileCallbacks'

export const File = (props:TFileProps) => {
  const {
    file,
    root,
    Modal,
    parent,
    filesRef,
    onAddFile,
    onAddFolder,
    abortAddFile,
    onPathChange,
    onDeleteFile,
    rootPrefix=``,
    onEditFileName,
    abortAddFolder,
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
    nameConflict,
    filePathChange,
  } = useFileCallbacks({
    file,
    parent,
    nameRef,
    editing,
    filesRef,
    setEditing,
    setShowChild,
    onPathChange,
    abortAddFile,
    abortAddFolder,
    onEditFileName,
    onEditFolderName,
    onConfirmAddFile,
    onConfirmAddFolder,
  })

  return (file as TFile)?.ext
    ? (
        <TreeFile
          nameRef={nameRef}
          editing={editing}
          fileBlur={fileBlur}
          file={file as TFile}
          setEditing={setEditing}
          currentPath={currentPath}
          fileKeyDown={fileKeyDown}
          parent={parent as TFolder}
          nameConflict={nameConflict}
          onDeleteFile={onDeleteFile}
          filePathChange={filePathChange}
        />
      )
    : (
        <div className='goblet-monaco-file-item'>
          {(file as TFolder)?._isDirectory && (
            <TreeDirectory
              nameRef={nameRef}
              editing={editing}
              fileBlur={fileBlur}
              showChild={showChild}
              fileClick={fileClick}
              onAddFile={onAddFile}
              file={file as TFolder}
              setEditing={setEditing}
              fileKeyDown={fileKeyDown}
              onAddFolder={onAddFolder}
              parent={parent as TFolder}
              nameConflict={nameConflict}
              setShowChild={setShowChild}
              onDeleteFolder={onDeleteFolder}
            />
          )}

          {(showChild || root) && (
            <div style={{ paddingLeft: (file as TFolder)._isDirectory ? '7px' : '0' }}>
              {keys.map(item => (
                <File
                  key={item}
                  root={false}
                  Modal={Modal}
                  filesRef={filesRef}
                  onAddFile={onAddFile}
                  rootPrefix={rootPrefix}
                  parent={file as TFolder}
                  onAddFolder={onAddFolder}
                  currentPath={currentPath}
                  onPathChange={onPathChange}
                  onDeleteFile={onDeleteFile}
                  onEditFileName={onEditFileName}
                  onDeleteFolder={onDeleteFolder}
                  abortAddFile={abortAddFile}
                  abortAddFolder={abortAddFolder}
                  onConfirmAddFile={onConfirmAddFile}
                  onEditFolderName={onEditFolderName}
                  file={(file as TFolder).children[item]}
                  onConfirmAddFolder={onConfirmAddFolder}
                />
              ))}
            </div>
          )}
        </div>
      )
}
