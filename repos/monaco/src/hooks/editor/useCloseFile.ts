import type { editor } from 'monaco-editor'
import type { SetStateAction, MutableRefObject } from 'react'
import type { TFilelist, TAutoSave, TEditorOpenFiles } from '../../types'

import { useCallback } from 'react'
import { saveFile } from '../../utils/file/saveFile'

export type TUseCloseFile = {
  autoSave: TAutoSave
  openedFiles: TEditorOpenFiles
  curPathRef: MutableRefObject<string>
  filesRef: MutableRefObject<TFilelist>
  openedPathRef: MutableRefObject<string | null>
  setCurPath: (data: SetStateAction<string>) => void
  onSaveFile?: (path: string, content: string) => void
  restoreModel: (path: string) => false | editor.ITextModel
  setOpenedFiles: (data: SetStateAction<TEditorOpenFiles>) => void
}

const clearPath = (
  openedPathRef:MutableRefObject<string | null>,
  restoreModel:(path: string) => false | editor.ITextModel,
  setCurPath:(data: SetStateAction<string>) => void
) => {
  restoreModel?.('')
  setCurPath?.('')
  openedPathRef.current = ''
}

const updateTargetPath = (
  targetPath:string,
  restoreModel:(path: string) => false | editor.ITextModel,
  setCurPath:(data: SetStateAction<string>) => void
) => {
  restoreModel?.(targetPath)
  setCurPath?.(targetPath)
}

const resolveFileOpened = (
  openedFiles:TEditorOpenFiles,
  path:string,
  targetPath:string
) => {
  return openedFiles.filter((loc, index) => {
    if (loc.path === path){}
      index === 0
        ? openedFiles[index + 1] && (targetPath = openedFiles[index + 1].path)
        : targetPath = openedFiles[index - 1].path

    return loc.path !== path
  })
}

export const useCloseFile = (props:TUseCloseFile) => {
  const {
    autoSave,
    filesRef,
    onSaveFile,
    curPathRef,
    setCurPath,
    openedFiles,
    restoreModel,
    openedPathRef,
    setOpenedFiles
  } = props

  // TODO: Need to add modal confirm, in some cases it needs to be shown
  return useCallback(
    (path: string) => {

      // Check if the file was changed and call onSaveFile if needed
      autoSave !== `off`
        && openedFiles.forEach(file => {
          file.path === path
            && file.status === 'editing'
            && saveFile(file, filesRef, onSaveFile)
        })

      setOpenedFiles(openedFiles => {
        if(!openedFiles?.length) return openedFiles

        let targetPath = ''
        const res = resolveFileOpened(openedFiles, path, targetPath)

        targetPath
          && curPathRef.current === path
          && updateTargetPath(targetPath, restoreModel, setCurPath)

        res.length === 0
          && clearPath(openedPathRef, restoreModel, setCurPath)

        return res

      })
    },
    [autoSave, onSaveFile, restoreModel, openedFiles]
  )
}