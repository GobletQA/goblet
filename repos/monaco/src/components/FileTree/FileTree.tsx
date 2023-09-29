import type { MutableRefObject, CSSProperties, Dispatch } from 'react'
import type { Modal } from '../Modal/Modal'
import type {
  TRootDir,
  TFolder,
  TFilelist,
  TEditorCB,
  TFileCallback,
  TEditorAddFile,
} from '@GBM/types'

import { File } from './File'
import { useMemo, memo } from 'react'
import { Panel } from '@gobletqa/components'
import { FileTreeActions } from './FileTreeActions'
import { useFileTree } from '@GBM/hooks/fileTree/useFileTree'

export type TFileTree = {
  Modal: Modal
  title?: string
  rootPrefix?: string
  currentPath?: string
  style?: CSSProperties
  onPathChange: TEditorCB
  onDeleteFile: TEditorCB
  onAddFile: TEditorAddFile
  onDeleteFolder: TEditorCB
  onAddFolder: TFileCallback
  rootEl: HTMLElement | null
  filetree: TFolder | TRootDir
  onEditFileName: TFileCallback
  onEditFolderName: TFileCallback
  filesRef: MutableRefObject<TFilelist>
  setFiletree: Dispatch<React.SetStateAction<TRootDir | TFolder>>
}

export const FileTree = memo((props: TFileTree) => {
  const {
    Modal,
    filesRef,
    filetree,
    onPathChange,
    rootPrefix=``,
    currentPath = '',
  } = props

  const {
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
        action: (e: Event) => {
          e.stopPropagation()
          addFile?.(filetree.path)
        },
      },
      {
        ...FileTreeActions[1],
        action: (e: Event) => {
          e.stopPropagation()
          addFolder?.(filetree.path)
        }
      },
    ]
  }, [filetree.path, addFile, addFolder])

  return (
    <Panel
      fillHeight
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

