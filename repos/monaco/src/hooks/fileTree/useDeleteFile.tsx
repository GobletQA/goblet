import { useCallback } from 'react'
import { deleteSourceFile } from '../../utils/deleteSourceFile'



export type THDeleteFile = {
  Modal: any
  rootEl: any
  rootPrefix?: string
  filetree: Record<any, any>,
  updateFiletree: (...args:any[]) => any,
  onDeleteFile: (...args:any[]) => any,
}

export const useDeleteFile = (props:THDeleteFile) => {
  const {
    Modal,
    rootEl,
    filetree,
    rootPrefix,
    onDeleteFile,
    updateFiletree,
  } = props
  
  return useCallback(
    (path: string) => {
      Modal.confirm({
        okText: 'OK',
        onOk: (close: () => void) => {
          updateFiletree(deleteSourceFile({
            path,
            filetree,
            rootPrefix
          }))
          onDeleteFile(path)
          close()
        },
        title: 'Confirm Delete',
        content: () => (
          <div>
            <div>Are you sure?</div>
            <div>File: {path}</div>
          </div>
        ),
      })
    },
    [filetree, onDeleteFile, rootEl]
  )
}