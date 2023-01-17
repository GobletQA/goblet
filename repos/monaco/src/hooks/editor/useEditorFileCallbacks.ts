import type { editor } from 'monaco-editor'
import type { SetStateAction, MutableRefObject } from 'react'
import type {
  TFilelist,
  TAutoSave,
  TCodeEditorRef,
  TEditorAddFile,
  TEditorDeleteFile,
  TEditorRenameFile,
  TEditorOpenFiles,
} from '../../types'

import { useCallback } from 'react'
import { useCloseFile } from './useCloseFile'
import { getContentFromPath } from '@GBM/utils/editor/getContentFromPath'
import { createOrUpdateModel } from '@GBM/utils/editor/createOrUpdateModel'


export type TUseEditorFileCallbacks = {
  curPath:string
  autoSave: TAutoSave
  editorRef:TCodeEditorRef
  onAddFile?: TEditorAddFile
  openedFiles: TEditorOpenFiles
  onDeleteFile?: TEditorDeleteFile
  onRenameFile?: TEditorRenameFile
  pathChange: (path: string) => void
  deleteModel: (path: string) => void
  filesRef: MutableRefObject<TFilelist>
  openedPathRef: MutableRefObject<string | null>
  onSaveFile?: (path: string, content: string) => void
  setCurPath: (content: SetStateAction<string>) => void
  restoreModel: (path: string) => false | editor.ITextModel
  setOpenedFiles: (content: SetStateAction<TEditorOpenFiles>) => void
}

export const useEditorFileCallbacks = (props:TUseEditorFileCallbacks) => {
  const {
    curPath,
    autoSave,
    filesRef,
    editorRef,
    setCurPath,
    pathChange,
    deleteModel,
    onAddFile,
    onSaveFile,
    openedFiles,
    restoreModel,
    onDeleteFile,
    onRenameFile,
    openedPathRef,
    setOpenedFiles,
  } = props

  const handleFormat = useCallback(
    () => editorRef.current?.getAction('editor.action.formatDocument').run(),
    []
  )

  const saveFile = useCallback(() => {
    const content = getContentFromPath(curPath) || filesRef.current[curPath]
    if(!content) return console.error(`Could not find content for file`, curPath)

    filesRef.current[curPath] = content
    onSaveFile?.(curPath, content)
    setOpenedFiles(openedFiles => {
      return openedFiles.map(file => {
        file.path === curPath && (file.status = undefined)
        return file
      })
    })

  }, [curPath, onSaveFile, handleFormat])

  const closeFile = useCloseFile({
    curPath,
    autoSave,
    filesRef,
    setCurPath,
    openedFiles,
    restoreModel,
    openedPathRef,
    setOpenedFiles,
    // Pass the onSaveFile callback so we can pass the path and content directly
    onSaveFile,
  })

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

      if (autoSave === `change` || ctrlKey && key === `s`) {
        event.preventDefault()
        event.stopPropagation()
        saveFile()
      }
    },
    [saveFile, autoSave]
  )

  const addFile = useCallback(
    (path: string, content?: string, isEdit?:boolean) => {
      const missingName = path.startsWith(`/`) && path.endsWith(`/`)
      const newNamedFile = !missingName && !isEdit

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
    abortFileChange,
  }
}