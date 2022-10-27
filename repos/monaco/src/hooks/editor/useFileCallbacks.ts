import type { SetStateAction, MutableRefObject } from 'react'
import type { editor } from 'monaco-editor'

import { TMFiles, TMFile, TFilelist, TEditorOpenFiles } from '../../types'

import { useCloseFile } from './useCloseFile'
import { useCloseOtherFiles } from './useCloseOtherFiles'

import { useCallback } from 'react'

export type TUseFileCallbacks = {
  openedFiles: TEditorOpenFiles
  rootRef: MutableRefObject<any>
  curPathRef: MutableRefObject<string>
  deleteModel: (path: string) => void
  curValueRef: MutableRefObject<string>
  filesRef: MutableRefObject<TFilelist>
  fileModelsRef: MutableRefObject<TMFiles>
  prePath: MutableRefObject<string | null>
  pathChange: (path: string) => void
  setCurPath: (value: SetStateAction<string>) => void
  createOrUpdateModel:(path: string, value: string) => void
  createOrUpdateFileModel:(path: string, fileModel: TMFile) => void
  setOpenedFiles: (value: SetStateAction<TEditorOpenFiles>) => void
  restoreModel: (path: string) => false | editor.ITextModel
  editorRef:MutableRefObject<editor.IStandaloneCodeEditor | null>
}

export const useFileCallbacks = (props:TUseFileCallbacks) => {
  const {
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
    fileModelsRef,
    setOpenedFiles,
    createOrUpdateModel,
    createOrUpdateFileModel
  } = props

    const onCloseFile = useCloseFile({
      prePath,
      curPathRef,
      setCurPath,
      restoreModel,
      setOpenedFiles
    })
    
    const closeOtherFiles = useCloseOtherFiles({
      prePath,
      rootRef,
      filesRef,
      setCurPath,
      openedFiles,
      restoreModel,
      fileModelsRef,
      setOpenedFiles,
      createOrUpdateModel,
      createOrUpdateFileModel,
    })


  const handleFormat = useCallback(
    () => editorRef.current?.getAction('editor.action.formatDocument').run(),
    []
  )

  const saveFile = useCallback(() => {
    filesRef.current[curPathRef.current] = curValueRef.current
    fileModelsRef.current[curPathRef.current].content = curValueRef.current
  }, [handleFormat])


  const abortFileChange = useCallback(
    (path: string) => {
      const value = filesRef.current[path] || ''
      createOrUpdateModel(path, value)
      // Add method to create or update a file model
      const model = fileModelsRef.current[path]

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
    (path: string, value?: string) => {
      createOrUpdateModel(path, value || '')
      filesRef.current[path] = value || ''

      // Need to create a new model here
      fileModelsRef.current[path].content = value || ``

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
      delete fileModelsRef.current[path]
      onCloseFile(path)
    },
    [onCloseFile]
  )

  const editFileName = useCallback(
    (path: string, name: string) => {
      const value = filesRef.current[path] || ''
      const model = fileModelsRef.current[path]
      setTimeout(() => {
        deleteFile(path)
        const newPath = path.split('/').slice(0, -1).concat(name).join('/')
        addFile(newPath, value)
        // addFileModel(newPath, model)
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