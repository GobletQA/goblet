import { useCallback } from 'react'
import { noOp } from '@keg-hub/jsutils'
import { deleteSourceFolder } from '../../utils/deleteSourceFolder'


export type THDeleteFolder = {
  Modal: any
  rootEl: any
  rootPrefix?: string
  filetree: Record<any, any>,
  updateFiletree: (...args:any[]) => any,
  onDeleteFolder: (...args:any[]) => any,
}

export const useDeleteFolder = (props:THDeleteFolder) => {
  const {
    Modal,
    rootEl,
    filetree,
    rootPrefix,
    updateFiletree,
    onDeleteFolder
  } = props
  
  
  return useCallback(
    (path: string) => {
      Modal.confirm({
        title: `Delete Folder`,
        okText: `Yes`,
        onOk: () => {
          updateFiletree(deleteSourceFolder({ filetree, path, rootPrefix }))
          onDeleteFolder(path)
        },
        cancelText: `No`,
        onCancel: noOp,
        content: (
          <div>
            <div>Are you sure?</div>
            <div>Delete: {path}</div>
          </div>
        ),
      })
    },
    [filetree, onDeleteFolder, rootEl]
  )

}