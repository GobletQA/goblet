import type { editor } from 'monaco-editor'
import type { TEditorOpenFiles } from '../../types'
import type { SetStateAction, MutableRefObject } from 'react'

import { useCallback } from 'react'

export type TUseCloseFile = {
  prePath: MutableRefObject<string | null>
  curPathRef: MutableRefObject<string>
  setCurPath: (data: SetStateAction<string>) => void
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
    curPathRef,
    setCurPath,
    restoreModel,
    setOpenedFiles
  } = props

  return useCallback(
    (path: string) => {
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
    [restoreModel]
  )
}