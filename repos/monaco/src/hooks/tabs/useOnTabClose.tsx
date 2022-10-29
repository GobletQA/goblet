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
        title: `Close File`,
        content: [
          `File: ${file.path}, has unsaved changes`,
        ],
        // actions: [
        //   {
        //     text: `Cancel`,
        //     type: `warn`,
        //     action: () => {
        //       console.log(`------- cancel action -------`)
        //       onAbortSave(file.path)
        //     }
        //   },
        //   {
        //     text: `Ok`,
        //     type: `primary`,
        //     action: () => {
        //       console.log(`------- ok action -------`)
                
        //       onCloseFile(file.path)
        //       onSaveFile(file.path)
        //     }
        //   },
        // ],

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