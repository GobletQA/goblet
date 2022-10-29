import type { editor } from 'monaco-editor'
import type { SetStateAction, MutableRefObject } from 'react'
import type { TEditorOpenFiles, TFilelist, TMFiles, TMFile } from '../../types'

import { Modal } from '../../components/Modal'

import { useCallback } from 'react'

export type TUseCloseOtherFiles = {
  openedFiles: TEditorOpenFiles
  rootRef: MutableRefObject<any>
  filesRef: MutableRefObject<TFilelist>
  prePath: MutableRefObject<string | null>
  setCurPath: (data: SetStateAction<string>) => void
  createOrUpdateModel:(path: string, content: string) => void
  setOpenedFiles: (data: SetStateAction<TEditorOpenFiles>) => void
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
    setOpenedFiles,
    createOrUpdateModel,
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
              const content = filesRef.current[file.path] || ''
              createOrUpdateModel(file.path, content)
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