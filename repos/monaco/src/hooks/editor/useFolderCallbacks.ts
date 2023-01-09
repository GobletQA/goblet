import type { SetStateAction, MutableRefObject } from 'react'
import type {
  TFilelist,
  TAutoSave,
  TEditorAddFile,
  TEditorOpenFiles,
  TEditorDeleteFile,
  TEditorRenameFile
} from '../../types'

import { useCallback } from 'react'
import { createOrUpdateModel } from '../../utils/editor/createOrUpdateModel'


export type TUseFolderCallbacks = {
  curPath:string
  autoSave: TAutoSave
  onAddFile?: TEditorAddFile
  onDeleteFile?: TEditorDeleteFile
  onRenameFile?: TEditorRenameFile
  deleteFile: (path: string) => void
  deleteModel: (path: string) => void
  pathChange: (path: string) => void
  filesRef: MutableRefObject<TFilelist>
  setOpenedFiles: (content: SetStateAction<TEditorOpenFiles>) => void
}

const updateFilesRef = (
  filesRef: MutableRefObject<TFilelist>,
  deleteModel: (path: string) => void,
  path:string,
  newPath:string
) => {
  Object.keys(filesRef.current).forEach(loc => {
    if(!loc.startsWith(path + '/')) return

    const content = filesRef.current[loc]

    typeof content === 'string'
      && setTimeout(() => {
          deleteModel(loc)
          const finalPath = loc.replace(path + '/', newPath + '/')
          createOrUpdateModel(finalPath, content)
          filesRef.current[finalPath] = content
        }, 50)

    delete filesRef.current[loc]
  })
}

export const useFolderCallbacks = (props:TUseFolderCallbacks) => {

  const {
    curPath,
    filesRef,
    onAddFile,
    pathChange,
    deleteFile,
    deleteModel,
    onDeleteFile,
    onRenameFile,
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

        Object.keys(filesRef.current)
          .forEach(loc => {
            if (loc.startsWith(path + '/')) {
              const content = filesRef.current[loc]
              if (typeof content === 'string') deleteFile(loc)
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
        updateFilesRef(filesRef, deleteModel, path, newPath)

        setOpenedFiles(openedFiles =>
          openedFiles.map(file => {
            file.path.startsWith(path + '/')
              && (file.path = file.path.replace(path + '/', newPath + '/'))

            return file
          })
        )

        curPath.startsWith(path + '/')
          && setTimeout(() => pathChange(curPath.replace(path + '/', newPath + '/')), 50)

        onRenameFile?.(path, newPath)
      },
      [
        curPath,
        addFolder,
        pathChange,
        onRenameFile
      ]
    )

  
  return {
    addFolder,
    deleteFolder,
    editFolderName
  }

}