import type { CSSProperties } from 'react'

import { memo, useCallback, useState } from 'react'
import { FileTreeHeader } from './FileTreeHeader'
import { useFileTree } from '../../hooks/fileTree/useFileTree'

import './FileTree.css'
import { File } from './File'
import { Modal } from '../Modal/Modal'

export type FileTree = {
  style?: CSSProperties
  Modal: Modal
  title?: string
  rootPrefix?: string
  currentPath?: string
  rootEl: HTMLElement | null
  onAddFile: (...args: any) => void
  onAddFolder: (...args: any) => void
  onPathChange: (key: string) => void
  onDeleteFile: (...args: any) => void
  onEditFileName: (...args: any) => void
  onDeleteFolder: (path: string) => void
  files?: Record<string, Record<string, any>>
  defaultFiles: any
  // defaultFiles: Record<string, Record<string, any>>
  onEditFolderName: (path: string, name: string) => void
}

export const FileTree = memo((props: FileTree) => {
  const {
    style,
    onPathChange,
    rootPrefix=``,
    currentPath = '',
    title = 'goblet-base-editor',
  } = props

  const [collapse, setCollapse] = useState(false)
  const onCollapse = useCallback(() => {
    setCollapse(pre => !pre)
  }, [])

  const {
    filetree,
    addFile,
    addFolder,
    deleteFile,
    editFileName,
    deleteFolder,
    editFolderName,
    onConfirmAddFile,
    onConfirmAddFolder
  } = useFileTree(props)

  return (
    <div className='goblet-monaco-editor-list-wrapper' style={style}>
      <FileTreeHeader
        title={title}
        addFile={addFile}
        collapse={collapse}
        addFolder={addFolder}
        onCollapse={onCollapse}
      />
      {!collapse && (
        <div className='goblet-monaco-editor-list-files'>
          <File
            root
            file={filetree}
            onAddFile={addFile}
            rootPrefix={rootPrefix}
            onAddFolder={addFolder}
            onDeleteFile={deleteFile}
            currentPath={currentPath}
            onPathChange={onPathChange}
            onDeleteFolder={deleteFolder}
            onEditFileName={editFileName}
            onEditFolderName={editFolderName}
            onConfirmAddFile={onConfirmAddFile}
            onConfirmAddFolder={onConfirmAddFolder}
          />
        </div>
      )}
    </div>
  )
})

