import type { TModal } from '../../types'
import type { MouseEventHandler } from 'react'

import { useCallback } from 'react'

export type THOnTabDown = {
  Modal: TModal
  onTabClose?: (event: any) => void
  onCloseOtherFiles: (path: string) => void
  file: { path: string, status?: string }
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
      if (e.button !== 2) {
        return
      }
      const position = {
        x: e.clientX,
        y: e.clientY,
      }
      setTimeout(() => {
        Modal.create({
          title: '????？',
          onOk: (close: () => void) => {
            close()
          },
          content: (close: any) => (
            <div
              style={{
                top: `${position.y}px`,
                left: `${position.x}px`,
              }}
              className='goblet-monaco-editor-rightclick-panel'
            >
              <div
                onClick={e => {
                  close()
                  onTabClose?.(e)
                }}
                className='goblet-monaco-editor-rightclick-panel-item'
              >
                Close
              </div>
              <div
                onClick={() => {
                  close()
                  onCloseOtherFiles(file.path)
                }}
                className='goblet-monaco-editor-rightclick-panel-item'
              >
                Close others
              </div>
              <div
                onClick={() => {
                  close()
                  onCloseOtherFiles('')
                }}
                className='goblet-monaco-editor-rightclick-panel-item'
              >
                Close all
              </div>
            </div>
          ),
          className: 'goblet-monaco-editor-modal-rightclick',
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