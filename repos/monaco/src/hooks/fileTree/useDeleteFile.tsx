import { useCallback } from 'react'
import { noOp } from '@keg-hub/jsutils/noOp'
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
        title: `Delete File`,
        okText: `Yes`,
        onOk: () => {
          updateFiletree(deleteSourceFile({
            path,
            filetree,
            rootPrefix
          }))
          onDeleteFile(path)
        },
        cancelText: `No`,
        onCancel: noOp,
        content: (
          <>
            Are you sure you want to delete file <b>{path}</b>?
          </>
        ),
      })
    },
    [filetree, onDeleteFile, rootEl]
  )
}