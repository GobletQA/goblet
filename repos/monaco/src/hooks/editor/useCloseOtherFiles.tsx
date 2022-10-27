import type { editor } from 'monaco-editor'
import type { SetStateAction, MutableRefObject } from 'react'
import type { TEditorOpenFiles, TFilelist, TMFiles, TMFile } from '../../types'

import { Modal } from '../../components/Modal'

import { useCallback } from 'react'

export type TUseCloseOtherFiles = {
  openedFiles: TEditorOpenFiles
  rootRef: MutableRefObject<any>
  filesRef: MutableRefObject<TFilelist>
  fileModelsRef: MutableRefObject<TMFiles>
  prePath: MutableRefObject<string | null>
  setCurPath: (value: SetStateAction<string>) => void
  createOrUpdateModel:(path: string, value: string) => void
  createOrUpdateFileModel:(path: string, fileModel: TMFile) => void
  setOpenedFiles: (value: SetStateAction<TEditorOpenFiles>) => void
  restoreModel: (path: string) => false | editor.ITextModel
}

export const useCloseOtherFiles = (props:TUseCloseOtherFiles) => {
  const {
    prePath,
    rootRef,
    filesRef,
    setCurPath,
    openedFiles,
    restoreModel,
    fileModelsRef,
    setOpenedFiles,
    createOrUpdateModel,
    createOrUpdateFileModel
  } = props

  return useCallback(
    (path: string) => {

      const unSavedFiles = openedFiles.filter(v => v.status === 'editing')

      if (unSavedFiles.length) {
        Modal.confirm({
          title: 'Confirm',
          target: rootRef.current,
          okText: 'OK',
          cancelText: 'Cancel',
          onCancel: (close: () => void) => {
            close()
            setOpenedFiles(pre => pre.filter(p => p.path === path))
            restoreModel(path)
            setCurPath(path)
            unSavedFiles.forEach((file:any) => {
              const value = filesRef.current[file.path] || ''
              createOrUpdateModel(file.path, value)
              const model = fileModelsRef.current[file.path]
              createOrUpdateFileModel(file.path, model)
            })
            prePath.current = path
          },
          onOk: (close: () => void) => {
            close()
            unSavedFiles.forEach((file:any) => {
              const model = window.monaco.editor
                .getModels()
                .find(model => model.uri.path === file.path)

              filesRef.current[file.path] = model?.getValue() || ''
              fileModelsRef.current[file.path].content = model?.getValue() || ''
            })
            setOpenedFiles(pre => pre.filter(p => p.path === path))
            restoreModel(path)
            setCurPath(path)
            prePath.current = path
          },
          content: () => (
            <div>
              <div>There are unsaved changes, are you sure?</div>
              <div>Files:</div>
              {unSavedFiles.map((file:any) => (
                <div key={file.path}>{file.path}</div>
              ))}
            </div>
          ),
        })
      }
      else {
        setOpenedFiles(pre => pre.filter(p => p.path === path))
        restoreModel(path)
        setCurPath(path)
        prePath.current = path
      }
    },
    [restoreModel, openedFiles]
  )
}