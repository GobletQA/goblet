import type { MutableRefObject, CSSProperties } from 'react'
import type { Modal } from '../Modal/Modal'
import type {
  TFolder,
  TFilelist,
  TEditorCB,
  TFileCallback,
} from '../../types'

import { useMemo, memo } from 'react'
import { Panel } from '../Sidebar/Panel'
import { FileTreeActions } from './FileTreeActions'
import { useFileTree } from '../../hooks/fileTree/useFileTree'

import './FileTree.css'
import { File } from './File'

export type TFileTree = {
  Modal: Modal
  title?: string
  rootPrefix?: string
  currentPath?: string
  style?: CSSProperties
  defaultFiles: TFilelist
  onPathChange: TEditorCB
  onDeleteFile: TEditorCB
  onAddFile: TFileCallback
  onDeleteFolder: TEditorCB
  onAddFolder: TFileCallback
  rootEl: HTMLElement | null
  onEditFileName: TFileCallback
  onEditFolderName: TFileCallback
  filesRef: MutableRefObject<TFilelist>
}

export const FileTree = memo((props: TFileTree) => {
  const {
    Modal,
    filesRef,
    onPathChange,
    rootPrefix=``,
    currentPath = '',
    title = 'goblet-base-editor',
  } = props


  const {
    filetree,
    addFile,
    addFolder,
    deleteFile,
    editFileName,
    deleteFolder,
    abortAddFile,
    abortAddFolder,
    editFolderName,
    onConfirmAddFile,
    onConfirmAddFolder
  } = useFileTree(props)

  const actions = useMemo(() => {
    return [
      {
        ...FileTreeActions[0],
        action: (e: Event) =>  {
          e.stopPropagation()
          addFile?.(filetree.path)
        },
      },
      {
        ...FileTreeActions[1],
        action: (e: Event) =>  {
          e.stopPropagation()
          addFolder?.(filetree.path)
        }
      },
    ]
  }, [filetree.path, addFile, addFolder])

  return (
    <Panel
      title='Files'
      header={true}
      startOpen={true}
      actions={actions}
    >
      <File
        root
        Modal={Modal}
        file={filetree}
        filesRef={filesRef}
        onAddFile={addFile}
        rootPrefix={rootPrefix}
        onAddFolder={addFolder}
        onDeleteFile={deleteFile}
        currentPath={currentPath}
        onPathChange={onPathChange}
        abortAddFile={abortAddFile}
        parent={filetree as TFolder}
        onDeleteFolder={deleteFolder}
        onEditFileName={editFileName}
        abortAddFolder={abortAddFolder}
        onEditFolderName={editFolderName}
        onConfirmAddFile={onConfirmAddFile}
        onConfirmAddFolder={onConfirmAddFolder}
      />
    </Panel>
  )
})

