import { useCallback } from 'react'
import { deleteSourceFile } from '../../utils/deleteSourceFile'



export type THDeleteFile = {
  Modal: any
  rootEl: any
  filetree: Record<any, any>,
  updateFiletree: (...args:any[]) => any,
  onDeleteFile: (...args:any[]) => any,
}

export const useDeleteFile = (props:THDeleteFile) => {
  const {
    Modal,
    rootEl,
    filetree,
    onDeleteFile,
    updateFiletree,
  } = props
  
  return useCallback(
    (path: string) => {
      Modal.confirm({
        target: rootEl,
        okText: 'OK',
        onOk: (close: () => void) => {
          updateFiletree(deleteSourceFile(filetree, path))
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