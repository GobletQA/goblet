import type { TTab } from '@gobletqa/components'
import type { TFileMeta, TAutoSave, TModal } from '@GBM/types'

import { useCallback } from 'react'
import { fileFromTab } from '@GBM/utils/file/fileTabs'

export type THOnTabClose = {
  Modal: TModal
  autoSave: TAutoSave
  rootEl: HTMLElement | null
  onCloseFile: (key: string) => void
  onSaveFile: (path: string) => void
  onAbortSave: (path: string) => void
}

export const useOnTabClose = (props:THOnTabClose) => {
  const {
    Modal,
    rootEl,
    autoSave,
    onSaveFile,
    onCloseFile,
    onAbortSave,
  } = props

  return useCallback((tab:TTab, event:any) => {
    const file = fileFromTab(tab)

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
    Modal,
    rootEl,
    autoSave,
    onSaveFile,
    onCloseFile,
    onAbortSave,
  ])
}