import type { SetStateAction, MutableRefObject } from 'react'
import * as TMonacoType from 'monaco-editor'
import { TEditorOpenFiles } from '../../types'

import { useCallback } from 'react'


export type TUseCloseFile = {
  prePath: MutableRefObject<string | null>
  curPathRef: MutableRefObject<string>
  restoreModel: (path: string) => false | TMonacoType.editor.ITextModel
  setCurPath: (value: SetStateAction<string>) => void
  setOpenedFiles: (value: SetStateAction<TEditorOpenFiles>) => void
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
        let targetPath = ''
        if (pre.length) {
          const res = pre.filter((v, index) => {
            if (v.path === path) {
              if (index === 0) {
                if (pre[index + 1]) {
                  targetPath = pre[index + 1].path
                }
              }
              else {
                targetPath = pre[index - 1].path
              }
            }
            return v.path !== path
          })

          if (targetPath && curPathRef.current === path) {
            restoreModel(targetPath)
            setCurPath(targetPath)
          }
          if (res.length === 0) {
            restoreModel('')
            setCurPath('')
            prePath.current = ''
          }
          return res
        }
        return pre
      })
    },
    [restoreModel]
  )
}