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
  prePath: MutableRefObject<string | null>
  setCurPath: (data: SetStateAction<string>) => void
  onSaveFile?: (path: string, content: string) => void
  restoreModel: (path: string) => false | editor.ITextModel
  setOpenedFiles: (data: SetStateAction<TEditorOpenFiles>) => void
}

const clearPath = (
  prePath:MutableRefObject<string | null>,
  restoreModel:(path: string) => false | editor.ITextModel,
  setCurPath:(data: SetStateAction<string>) => void
) => {
  restoreModel?.('')
  setCurPath?.('')
  prePath.current = ''
}

const updateTargetPath = (
  targetPath:string,
  restoreModel:(path: string) => false | editor.ITextModel,
  setCurPath:(data: SetStateAction<string>) => void
) => {
  restoreModel?.(targetPath)
  setCurPath?.(targetPath)
}

const resolvePreOpened = (
  pre:TEditorOpenFiles,
  path:string,
  targetPath:string
) => {
  return pre.filter((loc, index) => {
    if (loc.path === path){}
      index === 0
        ? pre[index + 1] && (targetPath = pre[index + 1].path)
        : targetPath = pre[index - 1].path

    return loc.path !== path
  })
}

export const useCloseFile = (props:TUseCloseFile) => {
  const {
    prePath,
    autoSave,
    filesRef,
    onSaveFile,
    curPathRef,
    setCurPath,
    openedFiles,
    restoreModel,
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

      setOpenedFiles(pre => {
        if(!pre?.length) return pre

        let targetPath = ''
        const res = resolvePreOpened(pre, path, targetPath)

        targetPath
          && curPathRef.current === path
          && updateTargetPath(targetPath, restoreModel, setCurPath)

        res.length === 0
          && clearPath(prePath, restoreModel, setCurPath)

        return res

      })
    },
    [autoSave, onSaveFile, restoreModel, openedFiles]
  )
}