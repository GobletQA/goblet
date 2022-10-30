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
    event.preventDefault()

    if(file.status !== 'editing')
      return onCloseFile(file.path)

    setTimeout(() => {
      Modal.confirm({
        maxWidth: `sm`,
        title: `Unsaved Changes`,
        content: (
          <>
            File <b>{file.path}</b> has unsaved changes.
            <br/>
            Do you want to save the changes before closing?
          </>
        ),
        onCancel: () => {
          console.log(`------- cancel action -------`)
          onAbortSave(file.path)
        },
        onOk: () => {
          console.log(`------- ok action -------`)
          onCloseFile(file.path)
          onSaveFile(file.path)
        }
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