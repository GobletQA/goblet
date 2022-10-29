import type { editor } from 'monaco-editor'
import type { SetStateAction, MutableRefObject } from 'react'
import type { TFilelist, TEditorOpenFiles, TModal } from '../../types'

import { useCloseFile } from './useCloseFile'
import { useCloseOtherFiles } from './useCloseOtherFiles'
import { createOrUpdateModel } from '../../utils/editor/createOrUpdateModel'

import { useCallback } from 'react'

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
  setCurPath: (content: SetStateAction<string>) => void
  restoreModel: (path: string) => false | editor.ITextModel
  editorRef:MutableRefObject<editor.IStandaloneCodeEditor | null>
  setOpenedFiles: (content: SetStateAction<TEditorOpenFiles>) => void
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
    openedFiles,
    restoreModel,
    setOpenedFiles,
  } = props

    const onCloseFile = useCloseFile({
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
  }, [handleFormat])


  const abortFileChange = useCallback(
    (path: string) => {
      const content = filesRef.current[path] || ''
      createOrUpdateModel(path, content)

      onCloseFile(path)
    },
    [onCloseFile]
  )

  const dealKey = useCallback(
    (e: React.KeyboardEvent<HTMLElement>) => {
      const ctrlKey = e.ctrlKey || e.metaKey
      const keyCode = e.keyCode

      if (ctrlKey && keyCode === 83) {
        e.preventDefault()
        saveFile()
      }
    },
    [saveFile]
  )

  const addFile = useCallback(
    (path: string, content?: string) => {
      createOrUpdateModel(path, content || '')
      filesRef.current[path] = content || ''

      setTimeout(() => {
        pathChange(path)
      }, 50)
    },
    [pathChange]
  )

  const deleteFile = useCallback(
    (path: string) => {
      deleteModel(path)
      delete filesRef.current[path]
      onCloseFile(path)
    },
    [onCloseFile]
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
    dealKey,
    addFile,
    deleteFile,
    onCloseFile,
    editFileName,
    handleFormat,
    closeOtherFiles,
    abortFileChange,
  }
}