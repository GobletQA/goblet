import type { editor } from 'monaco-editor'
import type { SetStateAction, MutableRefObject } from 'react'
import type {
  TModal,
  TAutoSave,
  TFilelist,
  TEditorOpenFiles,
} from '../../types'

import { createOrUpdateModel } from '../../utils/editor/createOrUpdateModel'

import { useCallback } from 'react'
import { getModelFromPath } from '../../utils/editor/getModelFromPath'

export type TUseCloseOtherFiles = {
  Modal: TModal
  autoSave: TAutoSave
  openedFiles: TEditorOpenFiles
  rootRef: MutableRefObject<any>
  filesRef: MutableRefObject<TFilelist>
  prePath: MutableRefObject<string | null>
  setCurPath: (data: SetStateAction<string>) => void
  restoreModel: (path: string) => false | editor.ITextModel
  setOpenedFiles: (data: SetStateAction<TEditorOpenFiles>) => void
}

export const useCloseOtherFiles = (props:TUseCloseOtherFiles) => {
  const {
    Modal,
    prePath,
    autoSave,
    filesRef,
    setCurPath,
    openedFiles,
    restoreModel,
    setOpenedFiles,
  } = props

  return useCallback(
    (path: string) => {

      const unSavedFiles = openedFiles.filter(file => file.status === 'editing')
      const saveAllFiles = () => {
        unSavedFiles.forEach((file:any) => {
          const model = getModelFromPath(file.path)
          filesRef.current[file.path] = model?.getValue() || ''
        })
        // TODO: validate this is actually saving each file
        // Pretty sure it's only updating locally
        setOpenedFiles(pre => pre.filter(p => p.path === path))
        restoreModel(path)
        setCurPath(path)
        prePath.current = path
      }

      if (unSavedFiles.length) {
        if(autoSave && autoSave === `change`) return saveAllFiles()
        
        Modal.confirm({
          okText: 'OK',
          cancelText: 'Cancel',
          title: 'Close other files',
          onOk: saveAllFiles,
          onCancel: () => {
            setOpenedFiles(pre => pre.filter(p => p.path === path))
            restoreModel(path)
            setCurPath(path)
            unSavedFiles.forEach((file:any) => {
              const content = filesRef.current[file.path] || ''
              createOrUpdateModel(file.path, content)
            })
            prePath.current = path
          },
          content: (
            <>
              <div>The following files have unsaved changes</div>
              <br/>
              {unSavedFiles.map((file:any) => (
                <div key={file.path}>{file.path}</div>
              ))}
              <br/>
              <div>Do you want to save these files before closing?</div>
            </>
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
    [autoSave, restoreModel, openedFiles]
  )
}