import type { TAutoSave, TModal } from '../../types'

import { useCallback } from 'react'

export type THOnTabClose = {
  Modal: TModal
  autoSave: TAutoSave
  rootEl: HTMLElement | null
  onCloseFile: (key: string) => void
  onSaveFile: (path: string) => void
  onAbortSave: (path: string) => void
  file: { path: string, status?: string }
}

export const useOnTabClose = (props:THOnTabClose) => {
  const {
  file,
  Modal,
  rootEl,
  autoSave,
  onSaveFile,
  onCloseFile,
  onAbortSave,
  } = props

  return useCallback((event:any) => {
    event.stopPropagation()
    event.preventDefault()

    if(file.status !== 'editing')
      return onCloseFile(file.path)

    if(autoSave && autoSave === `change`){
      onCloseFile(file.path)
      return onSaveFile(file.path)
    }

    setTimeout(() => {
      Modal.confirm({
        title: `Unsaved Changes`,
        content: (
          <>
            File <b>{file.path}</b> has unsaved changes.
            <br/>
            Do you want to save the changes before closing?
          </>
        ),
        cancelText: `No`,
        onCancel: () => {
          onAbortSave(file.path)
        },
        okText: `Yes`,
        onOk: () => {
          onCloseFile(file.path)
          onSaveFile(file.path)
        }
      })
    })
  }, [
    file,
    Modal,
    rootEl,
    autoSave,
    onSaveFile,
    onCloseFile,
    onAbortSave,
  ])
}