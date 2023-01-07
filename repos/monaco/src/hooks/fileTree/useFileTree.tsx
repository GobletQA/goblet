import type { TFileTree } from '../../components/FileTree/FileTree'

import { useAddFolder } from './useAddFolder'
import { useAbortAddFile } from './useAbortAddFile'
import { useDeleteFile } from './useDeleteFile'
import { useEditFileName } from './useEditFileName'
import { useDeleteFolder } from './useDeleteFolder'
import { useAbortAddFolder } from './useAbortAddFolder'
import { useConfirmAddFile } from './useConfirmAddFile'
import { useEditFolderName } from './useEditFolderName'
import { useConfirmAddFolder } from './useConfirmAddFolder'

/**
 * TODO - This should be called from the useEditorFileTree hook
 * Right now its called in the FileTree component
 * But the useAddFile hooks in called from the useEditorFileTree
 * Because we need access to to it in the EmptyEditor Component
 *
 * The problem is it separates that method from all the other similar methods
 * So if we call this hook from the useEditorFileTree
 * Then they could all be in the same place
 * But then we'll have to pass all these props down to the FileTree Component
 */
export const useFileTree = (props:TFileTree) => {
  const {
    Modal,
    rootEl,
    filetree,
    rootPrefix,
    setFiletree,
    onAddFile,
    onAddFolder,
    onDeleteFile,
    onDeleteFolder,
    onEditFileName,
    onEditFolderName,
  } = props

  const abortAddFile = useAbortAddFile({
    filetree,
    rootPrefix,
    updateFiletree: setFiletree,
  })

  const deleteFile = useDeleteFile({
    Modal,
    rootEl,
    filetree,
    onDeleteFile,
    rootPrefix,
    updateFiletree: setFiletree,
  })

  const editFileName = useEditFileName({
    Modal,
    rootEl,
    filetree,
    rootPrefix,
    onEditFileName,
    updateFiletree: setFiletree,
  })

  const onConfirmAddFile = useConfirmAddFile({
    filetree,
    onAddFile,
    rootPrefix,
    updateFiletree: setFiletree,
  })
  
  const addFolder = useAddFolder({
    filetree,
    rootPrefix,
    onAddFolder,
    updateFiletree: setFiletree,
  })

  const abortAddFolder = useAbortAddFolder({
    filetree,
    rootPrefix,
    updateFiletree: setFiletree,
  })

  const deleteFolder = useDeleteFolder({
    Modal,
    rootEl,
    filetree,
    rootPrefix,
    onDeleteFolder,
    updateFiletree: setFiletree,
  })


  const editFolderName = useEditFolderName({
    filetree,
    rootPrefix,
    onEditFolderName,
    updateFiletree: setFiletree,
  })

  const onConfirmAddFolder = useConfirmAddFolder({
    filetree,
    rootPrefix,
    onAddFolder,
    updateFiletree: setFiletree,
  })

  return {
    filetree,
    addFolder,
    deleteFile,
    setFiletree,
    editFileName,
    deleteFolder,
    abortAddFile,
    abortAddFolder,
    editFolderName,
    onConfirmAddFile,
    addFile: onAddFile,
    onConfirmAddFolder,
    updateFiletree: setFiletree,
  }

}