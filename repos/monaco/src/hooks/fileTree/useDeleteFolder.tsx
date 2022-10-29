import { useCallback } from 'react'
import { deleteSourceFolder } from '../../utils'


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
        okText: 'OK',
        onOk: (close: () => void) => {
          updateFiletree(deleteSourceFolder({ filetree, path, rootPrefix }))
          onDeleteFolder(path)
          close()
        },
        title: 'Confirm Delete',
        content: () => (
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