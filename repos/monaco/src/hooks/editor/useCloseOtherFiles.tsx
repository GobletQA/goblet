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
import { exists } from '@keg-hub/jsutils'
import { saveFile } from '../../utils/file/saveFile'
import { getModelFromPath } from '../../utils/editor/getModelFromPath'

export type TUseCloseOtherFiles = {
  Modal: TModal
  autoSave: TAutoSave
  openedFiles: TEditorOpenFiles
  rootRef: MutableRefObject<any>
  filesRef: MutableRefObject<TFilelist>
  prePath: MutableRefObject<string | null>
  setCurPath: (data: SetStateAction<string>) => void
  onSaveFile?: (path: string, content: string) => void
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
    onSaveFile,
    openedFiles,
    restoreModel,
    setOpenedFiles,
  } = props

  return useCallback(
    (path: string) => {

      const unSavedFiles = openedFiles.filter(file => file.status === 'editing')
      const saveAllFiles = () => {
        unSavedFiles.forEach((file:any) => {
          // This could cause some issue if a lot of files are opened
          saveFile(file, filesRef, onSaveFile)
        })
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
    [autoSave, onSaveFile, restoreModel, openedFiles]
  )
}