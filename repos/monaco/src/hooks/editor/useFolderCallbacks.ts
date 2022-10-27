import type { SetStateAction, MutableRefObject } from 'react'
import { TMFiles, TMFile, TEditorOpenFiles, TFilelist } from '../../types'


import { useCallback } from 'react'


export type TUseFolderCallbacks = {
  deleteFile: (path: string) => void
  deleteModel: (path: string) => void
  pathChange: (path: string) => void
  curPathRef: MutableRefObject<string>
  filesRef: MutableRefObject<TFilelist>
  fileModelsRef: MutableRefObject<TMFiles>
  createOrUpdateModel:(path: string, value: string) => void
  createOrUpdateFileModel:(path: string, fileModel: TMFile) => void
  setOpenedFiles: (value: SetStateAction<TEditorOpenFiles>) => void
}

export const useFolderCallbacks = (props:TUseFolderCallbacks) => {

  const {
    filesRef,
    curPathRef,
    pathChange,
    deleteFile,
    deleteModel,
    fileModelsRef,
    setOpenedFiles,
    createOrUpdateModel,
    createOrUpdateFileModel
  } = props

    const addFolder = useCallback((path: string) => {
      let hasChild = false
      Object.keys(filesRef.current).forEach(p => {
        if (p.startsWith(path + '/')) hasChild = true
      })
      if (!hasChild) filesRef.current[path] = null

      // TODO: investigate if this is needed for file models
      let modelHasChild =false
      Object.keys(fileModelsRef.current).forEach(p => {
        if (p.startsWith(path + '/')) modelHasChild = true
      })
      // @ts-ignore
      if (!modelHasChild) fileModelsRef.current[path].content = undefined

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

        delete fileModelsRef.current[path]
        Object.keys(fileModelsRef.current).forEach(p => {
          if (p.startsWith(path + '/')) {
            const value = fileModelsRef.current[p].content
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
        // TODO: update to use file models
        // delete fileModelsRef.current[path]
        delete fileModelsRef.current[path]
        addFolder(newPath)
        Object.keys(fileModelsRef.current).forEach(p => {
          if (p.startsWith(path + '/')) {
            const value = fileModelsRef.current[p].content
            if (typeof value === 'string') {
              setTimeout(() => {
                deleteModel(p)
                const finalPath = p.replace(path + '/', newPath + '/')
                createOrUpdateFileModel(finalPath, fileModelsRef.current[finalPath])
                fileModelsRef.current[finalPath].content = value || ''
              }, 50)
            }
            delete fileModelsRef.current[p]
          }
        })
        setOpenedFiles(pre =>
          pre.map(file => {
            if (file.path.startsWith(path + '/')) {
              file.path = file.path.replace(path + '/', newPath + '/')
            }
            return file
          })
        )


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