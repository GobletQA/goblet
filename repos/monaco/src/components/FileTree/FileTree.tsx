import { memo, useCallback, useState } from 'react'
import AddFileIcon from '../icons/addfile'
import AddFolderIcon from '../icons/addfolder'
import Arrow from '../icons/arrow'

import Modal from '../modal'
import {
  generateFileTree,
  addSourceFile,
  deleteSourceFile,
  editSourceFileName,
  addSourceFolder,
  deleteSourceFolder,
  editSourceFolderName,
} from '../../utils'
import './FileTree.css'
import { File } from './File'

export type FileTree = {
  defaultFiles: any
  onPathChange: (key: string) => void
  title?: string
  currentPath?: string
  style?: any
  onAddFile: (...args: any) => void
  onDeleteFile: (...args: any) => void
  onEditFileName: (...args: any) => void
  onAddFolder: (...args: any) => void
  onDeleteFolder: (path: string) => void
  onEditFolderName: (path: string, name: string) => void
  rootEl: HTMLElement | null
}

export const FileTree = memo(({
  defaultFiles,
  onPathChange,
  title = 'monaco-base-editor',
  currentPath = '',
  style,
  onAddFile,
  onDeleteFile,
  onEditFileName,
  onAddFolder,
  onDeleteFolder,
  onEditFolderName,
  rootEl,
}: FileTree) => {
  const [collpase, setCollpase] = useState(false)

  const [filetree, setFiletree] = useState(() => generateFileTree(defaultFiles))

  const addFile = useCallback(
    (path: string) => {
      setFiletree(addSourceFile(filetree, path))
    },
    [filetree]
  )

  const deleteFile = useCallback(
    (path: string) => {
      Modal.confirm({
        target: rootEl,
        okText: 'OK',
        onOk: (close: () => void) => {
          setFiletree(deleteSourceFile(filetree, path))
          onDeleteFile(path)
          close()
        },
        title: 'Confirm Delete',
        content: () => (
          <div>
            <div>Are you sure?</div>
            <div>File: {path}</div>
          </div>
        ),
      })
    },
    [filetree, onDeleteFile, rootEl]
  )

  const editFileName = useCallback(
    (path: string, name: string) => {
      setFiletree(editSourceFileName(filetree, path, name))
      onEditFileName(path, name)
    },
    [filetree, onEditFileName]
  )

  const handleConfirmAddFile = useCallback(
    (file: any) => {
      let tree: any = {}
      if (file.name) {
        tree = deleteSourceFile(filetree, file.path)
        tree = addSourceFile(tree, file.path + file.name)
        onAddFile(file.path + file.name)
      }
      else {
        tree = deleteSourceFile(filetree, file.path)
      }
      setFiletree(tree)
    },
    [filetree, onAddFile]
  )

  const addFolder = useCallback(
    (path: string) => {
      setFiletree(addSourceFolder(filetree, path))
    },
    [filetree]
  )

  const deleteFolder = useCallback(
    (path: string) => {
      Modal.confirm({
        target: rootEl,
        okText: 'OK',
        onOk: (close: () => void) => {
          setFiletree(deleteSourceFolder(filetree, path))
          onDeleteFolder(path)
          close()
        },
        title: 'Confirm Delete',
        content: () => (
          <div>
            <div>Are you sure?</div>
            <div>Delete: {path}</div>
          </div>
        ),
      })
    },
    [filetree, onDeleteFolder, rootEl]
  )

  const editFolderName = useCallback(
    (path: string, name: string) => {
      setFiletree(editSourceFolderName(filetree, path, name))
      onEditFolderName(path, name)
    },
    [filetree, onEditFolderName]
  )

  const handleConfirmAddFolder = useCallback(
    (file: any) => {
      let tree: any = {}
      if (file.name) {
        tree = deleteSourceFolder(filetree, file.path)
        tree = addSourceFolder(tree, file.path + file.name)
        onAddFolder(file.path + file.name)
      }
      else {
        tree = deleteSourceFolder(filetree, file.path)
      }
      setFiletree(tree)
    },
    [filetree, onAddFolder]
  )

  const handleCollapse = useCallback(() => {
    setCollpase(pre => !pre)
  }, [])

  return (
    <div className='goblet-monaco-editor-list-wrapper' style={style}>
      <div className='goblet-monaco-editor-list-title'>{title}</div>
      <div className='goblet-monaco-editor-list-split' onClick={handleCollapse}>
        <Arrow collpase={collpase} />
        <span style={{ flex: 1 }}>&nbsp;Files</span>
        <AddFileIcon
          onClick={(e: Event) => {
            e.stopPropagation()
            addFile('/')
          }}
          className='goblet-monaco-editor-list-split-icon'
        />
        <AddFolderIcon
          onClick={(e: Event) => {
            e.stopPropagation()
            addFolder('/')
          }}
          className='goblet-monaco-editor-list-split-icon'
        />
      </div>
      {!collpase && (
        <div className='goblet-monaco-editor-list-files'>
          <File
            onEditFileName={editFileName}
            onEditFolderName={editFolderName}
            onDeleteFile={deleteFile}
            onDeleteFolder={deleteFolder}
            onAddFile={addFile}
            onAddFolder={addFolder}
            onConfirmAddFile={handleConfirmAddFile}
            onConfirmAddFolder={handleConfirmAddFolder}
            currentPath={currentPath}
            root
            file={filetree}
            onPathChange={onPathChange}
          />
        </div>
      )}
    </div>
  )
})

