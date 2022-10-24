import type { FileTree } from '../../components/FileTree/FileTree'

import { useState } from 'react'
import { generateFileTree } from '../../utils/generateFileTree'

import { useAddFile } from './useAddFile'
import { useAddFolder } from './useAddFolder'
import { useDeleteFile } from './useDeleteFile'
import { useEditFileName } from './useEditFileName'
import { useDeleteFolder } from './useDeleteFolder'
import { useConfirmAddFile } from './useConfirmAddFile'
import { useEditFolderName } from './useEditFolderName'
import { useConfirmAddFolder } from './useConfirmAddFolder'

export const useFileTree = (props:FileTree) => {
  const {
    Modal,
    files,
    rootEl,
    rootPrefix,
    defaultFiles,
    onAddFile,
    onAddFolder,
    onDeleteFile,
    onDeleteFolder,
    onEditFileName,
    onEditFolderName,
  } = props

  const [filetree, setFiletree] = useState(() => generateFileTree(defaultFiles))

  const addFile = useAddFile({
    filetree,
    onAddFile,
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
    setFiletree,
    addFile,
    addFolder,
    deleteFile,
    editFileName,
    deleteFolder,
    editFolderName,
    onConfirmAddFile,
    onConfirmAddFolder
  }

}