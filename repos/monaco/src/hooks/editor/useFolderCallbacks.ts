import type { SetStateAction, MutableRefObject } from 'react'
import { TEditorOpenFiles, TFilelist } from '../../types'


import { useCallback } from 'react'


export type TUseFolderCallbacks = {
  deleteFile: (path: string) => void
  deleteModel: (path: string) => void
  pathChange: (path: string) => void
  curPathRef: MutableRefObject<string>
  filesRef: MutableRefObject<TFilelist>
  createOrUpdateModel:(path: string, value: string) => void
  setOpenedFiles: (value: SetStateAction<TEditorOpenFiles>) => void
}

export const useFolderCallbacks = (props:TUseFolderCallbacks) => {

  const {
    filesRef,
    curPathRef,
    pathChange,
    deleteFile,
    deleteModel,
    setOpenedFiles,
    createOrUpdateModel
  } = props

    const addFolder = useCallback((path: string) => {
      let hasChild = false
      Object.keys(filesRef.current).forEach(p => {
        if (p.startsWith(path + '/')) hasChild = true
      })

      if (!hasChild) filesRef.current[path] = null
    }, [])

    const deleteFolder = useCallback(
      (path: string) => {
        delete filesRef.current[path]
        Object.keys(filesRef.current).forEach(p => {
          if (p.startsWith(path + '/')) {
            const value = filesRef.current[p]
            if (typeof value === 'string') deleteFile(p)
          }
        })
      },
      [deleteFile]
    )

    const editFolderName = useCallback(
      (path: string, name: string) => {
        const paths = (path || '/').slice(1).split('/')
        const newPath = '/' + paths.slice(0, -1).concat(name).join('/')
        delete filesRef.current[path]
        addFolder(newPath)
        Object.keys(filesRef.current).forEach(p => {
          if (p.startsWith(path + '/')) {
            const value = filesRef.current[p]
            if (typeof value === 'string') {
              setTimeout(() => {
                deleteModel(p)
                const finalPath = p.replace(path + '/', newPath + '/')
                createOrUpdateModel(finalPath, value || '')
                filesRef.current[finalPath] = value || ''
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
      },
      [pathChange, addFolder]
    )

  
  return {
    addFolder,
    deleteFolder,
    editFolderName
  }

}