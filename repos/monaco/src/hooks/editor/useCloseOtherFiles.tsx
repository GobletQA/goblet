import type { editor } from 'monaco-editor'
import type { SetStateAction, MutableRefObject } from 'react'
import { TEditorOpenFiles, TFilelist } from '../../types'
import { Modal } from '../../components/Modal'

import { useCallback } from 'react'

export type TUseCloseOtherFiles = {
  openedFiles: TEditorOpenFiles
  rootRef: MutableRefObject<any>
  filesRef: MutableRefObject<TFilelist>
  prePath: MutableRefObject<string | null>
  setCurPath: (value: SetStateAction<string>) => void
  createOrUpdateModel:(path: string, value: string) => void
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
            unSavedFiles.forEach(v => {
              const value = filesRef.current[v.path] || ''
              createOrUpdateModel(v.path, value)
            })
            prePath.current = path
          },
          onOk: (close: () => void) => {
            close()
            unSavedFiles.forEach(v => {
              const model = window.monaco.editor
                .getModels()
                .find(model => model.uri.path === v.path)

              filesRef.current[v.path] = model?.getValue() || ''
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
              {unSavedFiles.map(v => (
                <div key={v.path}>{v.path}</div>
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