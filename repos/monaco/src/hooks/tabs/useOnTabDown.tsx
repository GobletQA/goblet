import type { TFileMeta, TModal } from '../../types'
import type { MouseEventHandler } from 'react'

import { useCallback } from 'react'

export type THOnTabDown = {
  Modal: TModal
  file: TFileMeta
  onTabClose?: (event: any) => void
  onCloseOtherFiles: (path: string) => void
}

export const useOnTabDown = (props:THOnTabDown) => {

  const {
    file,
    Modal,
    onTabClose,
    onCloseOtherFiles,
  } = props

  return useCallback(
    (e:any) => {
      if (e.button !== 2) return

      const position = {
        x: e.clientX,
        y: e.clientY,
      }
      setTimeout(() => {
        Modal.create({
          floatContent: true,
          title: 'Actions',
          className: 'goblet-monaco-editor-modal-rightclick',
          content: (
            <div
              style={{
                top: `${position.y}px`,
                left: `${position.x}px`,
              }}
              className='goblet-monaco-editor-rightclick-panel'
            >
              <div
                onClick={() => {
                  Modal.close()
                  onTabClose?.(event)
                }}
                className='goblet-monaco-editor-rightclick-panel-item'
              >
                Close
              </div>
              <div
                onClick={() => {
                  Modal.close()
                  onCloseOtherFiles(file.path)
                }}
                className='goblet-monaco-editor-rightclick-panel-item'
              >
                Close others
              </div>
              <div
                onClick={() => {
                  Modal.close()
                  onCloseOtherFiles('')
                }}
                className='goblet-monaco-editor-rightclick-panel-item'
              >
                Close all
              </div>
            </div>
          ),
        })
      })
    },
    [
      Modal,
      file.path,
      onTabClose,
      onCloseOtherFiles,
    ]
  )

}