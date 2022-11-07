import type { editor } from 'monaco-editor'
import type { SetStateAction, MutableRefObject } from 'react'
import type { TEditorDeleteFile, TEditorRenameFile, TFilelist, TEditorOpenFiles, TModal, TEditorAddFile } from '../../types'

import { useCallback } from 'react'
import { useCloseFile } from './useCloseFile'
import { useCloseOtherFiles } from './useCloseOtherFiles'
import { createOrUpdateModel } from '../../utils/editor/createOrUpdateModel'


export type TUseEditorFileCallbacks = {
  Modal: TModal
  onAddFile?: TEditorAddFile
  onDeleteFile?: TEditorDeleteFile
  onRenameFile?: TEditorRenameFile
  openedFiles: TEditorOpenFiles
  rootRef: MutableRefObject<any>
  curPathRef: MutableRefObject<string>
  deleteModel: (path: string) => void
  curValueRef: MutableRefObject<string>
  filesRef: MutableRefObject<TFilelist>
  prePath: MutableRefObject<string | null>
  pathChange: (path: string) => void
  onSaveFile?: (path: string, content: string) => void
  setCurPath: (content: SetStateAction<string>) => void
  restoreModel: (path: string) => false | editor.ITextModel
  editorRef:MutableRefObject<editor.IStandaloneCodeEditor | null>
  setOpenedFiles: (content: SetStateAction<TEditorOpenFiles>) => void
}

export const useEditorFileCallbacks = (props:TUseEditorFileCallbacks) => {
  const {
    Modal,
    rootRef,
    prePath,
    filesRef,
    editorRef,
    curPathRef,
    setCurPath,
    pathChange,
    curValueRef,
    deleteModel,
    onAddFile,
    onSaveFile,
    openedFiles,
    restoreModel,
    onDeleteFile,
    onRenameFile,
    setOpenedFiles,
  } = props

  const closeFile = useCloseFile({
    prePath,
    curPathRef,
    setCurPath,
    restoreModel,
    setOpenedFiles
  })
  
  const closeOtherFiles = useCloseOtherFiles({
    Modal,
    prePath,
    rootRef,
    filesRef,
    setCurPath,
    openedFiles,
    restoreModel,
    setOpenedFiles,
  })

  const handleFormat = useCallback(
    () => editorRef.current?.getAction('editor.action.formatDocument').run(),
    []
  )

  const saveFile = useCallback(() => {
    filesRef.current[curPathRef.current] = curValueRef.current
    onSaveFile?.(curPathRef.current, curValueRef.current)
  }, [onSaveFile, handleFormat])

  const abortFileChange = useCallback(
    (path: string) => {
      const content = filesRef.current[path] || ''
      createOrUpdateModel(path, content)
      closeFile(path)
    },
    [closeFile]
  )

  const keyDown = useCallback(
    (event: React.KeyboardEvent<HTMLElement>) => {
      const ctrlKey = event.ctrlKey || event.metaKey
      const key = event.key.toLowerCase()

      if (ctrlKey && key === `s`) {
        event.preventDefault()
        event.stopPropagation()
        saveFile()
      }
    },
    [saveFile]
  )

  const addFile = useCallback(
    (path: string, content?: string, isEdit?:boolean) => {
      const missingNamed = path.startsWith(`/`) && path.endsWith(`/`)
      const newNamedFile = !missingNamed && !isEdit

      const cont = content || ''
      createOrUpdateModel(path, cont)
      filesRef.current[path] = cont

      if(!newNamedFile) return

      // Auto open the file in the editor when a new file is created
      pathChange(path)
      onAddFile?.(path, false)
    },
    [onAddFile, pathChange]
  )

  const deleteFile = useCallback(
    (path: string, isEdit?:boolean) => {
      deleteModel(path)
      delete filesRef.current[path]
      closeFile(path)
      !isEdit && onDeleteFile?.(path)
    },
    [onDeleteFile, closeFile]
  )

  const editFileName = useCallback(
    (path: string, name: string) => {
      const content = filesRef.current[path] || ''
      deleteFile(path, true)
      const newPath = path.split('/').slice(0, -1).concat(name).join('/')
      addFile(newPath, content, true)

      onRenameFile?.(path, newPath)
      setTimeout(() => pathChange(newPath), 50)
    },
    [deleteFile, addFile, onRenameFile]
  )

  return {
    saveFile,
    keyDown,
    addFile,
    deleteFile,
    closeFile,
    editFileName,
    handleFormat,
    closeOtherFiles,
    abortFileChange,
  }
}