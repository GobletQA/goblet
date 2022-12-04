import type { SetStateAction, MutableRefObject } from 'react'
import type {
  TFilelist,
  TAutoSave,
  TEditorAddFile,
  TEditorOpenFiles,
  TEditorDeleteFile,
  TEditorRenameFile
} from '../../types'

import { createOrUpdateModel } from '../../utils/editor/createOrUpdateModel'

import { useCallback } from 'react'


export type TUseFolderCallbacks = {
  autoSave: TAutoSave
  onAddFile?: TEditorAddFile
  onDeleteFile?: TEditorDeleteFile
  onRenameFile?: TEditorRenameFile
  deleteFile: (path: string) => void
  deleteModel: (path: string) => void
  pathChange: (path: string) => void
  curPathRef: MutableRefObject<string>
  filesRef: MutableRefObject<TFilelist>
  setOpenedFiles: (content: SetStateAction<TEditorOpenFiles>) => void
}

export const useFolderCallbacks = (props:TUseFolderCallbacks) => {

  const {
    autoSave,
    filesRef,
    onAddFile,
    onDeleteFile,
    onRenameFile,
    curPathRef,
    pathChange,
    deleteFile,
    deleteModel,
    setOpenedFiles,
  } = props

    const addFolder = useCallback((path: string, isRename?:boolean) => {
      let hasChild = false
      Object.keys(filesRef.current).forEach(p => {
        if (p.startsWith(path + '/')) hasChild = true
      })
      if (!hasChild) filesRef.current[path] = null

      !isRename && onAddFile?.(path, true)
    }, [onAddFile])

    const deleteFolder = useCallback(
      (path: string, isRename?:boolean) => {
        delete filesRef.current[path]
        Object.keys(filesRef.current).forEach(p => {
          if (p.startsWith(path + '/')) {
            const content = filesRef.current[p]
            if (typeof content === 'string') deleteFile(p)
          }
        })

        !isRename && onDeleteFile?.(path, true)
      },
      [deleteFile]
    )

    const editFolderName = useCallback(
      (path: string, name: string) => {
        const paths = (path || '/').slice(1).split('/')
        const newPath = '/' + paths.slice(0, -1).concat(name).join('/')

        delete filesRef.current[path]
        addFolder(newPath, true)

        Object.keys(filesRef.current).forEach(p => {
          if (p.startsWith(path + '/')) {
            const content = filesRef.current[p]
            if (typeof content === 'string') {
              setTimeout(() => {
                deleteModel(p)
                const finalPath = p.replace(path + '/', newPath + '/')
                createOrUpdateModel(finalPath, content || '')
                filesRef.current[finalPath] = content || ''
              }, 50)
            }
            delete filesRef.current[p]
          }
        })

        setOpenedFiles(pre =>
          pre.map(v => {
            if (v.path.startsWith(path + '/')) {
              v.path = v.path.replace(path + '/', newPath + '/')
            }
            return v
          })
        )

        if (curPathRef.current.startsWith(path + '/')) {
          setTimeout(() => {
            pathChange(curPathRef.current.replace(path + '/', newPath + '/'))
          }, 50)
        }

        onRenameFile?.(path, newPath)
      },
      [pathChange, addFolder, onRenameFile]
    )

  
  return {
    addFolder,
    deleteFolder,
    editFolderName
  }

}