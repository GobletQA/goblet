import type { editor } from 'monaco-editor'
import type { SetStateAction, MutableRefObject } from 'react'
import type { TFilelist, TEditorOpenFiles, TModal } from '../../types'

import { useCloseFile } from './useCloseFile'
import { useCloseOtherFiles } from './useCloseOtherFiles'
import { createOrUpdateModel } from '../../utils/editor/createOrUpdateModel'

import { useCallback, useEffect } from 'react'

export type TUseFileCallbacks = {
  Modal: TModal
  openedFiles: TEditorOpenFiles
  rootRef: MutableRefObject<any>
  curPathRef: MutableRefObject<string>
  deleteModel: (path: string) => void
  curValueRef: MutableRefObject<string>
  filesRef: MutableRefObject<TFilelist>
  prePath: MutableRefObject<string | null>
  pathChange: (path: string) => void
  onDeleteFile?: (path: string) => void
  onAddFile?: (path: string, content:string) => void
  onSaveFile?: (path: string, content: string) => void
  setCurPath: (content: SetStateAction<string>) => void
  restoreModel: (path: string) => false | editor.ITextModel
  editorRef:MutableRefObject<editor.IStandaloneCodeEditor | null>
  setOpenedFiles: (content: SetStateAction<TEditorOpenFiles>) => void
}

const preventDefault = (event:Event) => event.preventDefault()
const windowListen = () => {
  window.addEventListener('keydown', preventDefault)
  return () => window.removeEventListener('keydown', preventDefault)
}


export const useFileCallbacks = (props:TUseFileCallbacks) => {
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
    (path: string, content?: string) => {
      const cont = content || ''
      createOrUpdateModel(path, cont)
      filesRef.current[path] = cont
      onAddFile?.(path, cont)

      setTimeout(() => pathChange(path), 50)
    },
    [onAddFile, pathChange]
  )

  const deleteFile = useCallback(
    (path: string) => {
      deleteModel(path)
      delete filesRef.current[path]
      closeFile(path)
      onDeleteFile?.(path)
    },
    [onDeleteFile, closeFile]
  )

  const editFileName = useCallback(
    (path: string, name: string) => {
      const content = filesRef.current[path] || ''
      setTimeout(() => {
        deleteFile(path)
        const newPath = path.split('/').slice(0, -1).concat(name).join('/')
        addFile(newPath, content)
      }, 50)
    },
    [deleteFile, addFile]
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