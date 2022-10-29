import type { TModal } from '../../types'

import { useCallback } from 'react'

export type THOnTabClose = {
  Modal: TModal
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
  onSaveFile,
  onCloseFile,
  onAbortSave,
  } = props
  
  return useCallback((event:any) => {
    event.stopPropagation()
    if(file.status !== 'editing')
      return onCloseFile(file.path)

    setTimeout(() => {
      Modal.confirm({
        target: rootEl,
        okText: 'OK',
        title: 'Confirm Close',
        cancelText: 'Cancel',
        onCancel: (close: () => void) => {
          close()
          onAbortSave(file.path)
        },
        onOk: (close: () => void) => {
          close()
          onCloseFile(file.path)
          onSaveFile(file.path)
        },
        content: () => (
          <div>
            <div>File has unsaved changes</div>
            <div>File: {file.path}</div>
          </div>
        )
      })
    })

  }, [
    file,
    Modal,
    rootEl,
    onSaveFile,
    onCloseFile,
    onAbortSave,
  ])
}