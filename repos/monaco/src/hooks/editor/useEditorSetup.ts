import type { ForwardedRef, MutableRefObject } from 'react'
import type { editor } from 'monaco-editor'
import {
  TMFile,
  TMFiles,
  TFilelist,
  TEditorTheme,
  IMultiRefType,
  TEditorConfig,
} from '../../types'

import { THEMES } from '../../constants'
import { useEffect, useImperativeHandle } from 'react'


export type TUseEditorSetup = {
  curPath: string
  config: TEditorConfig
  ref: ForwardedRef<IMultiRefType>
  curPathRef: MutableRefObject<string>
  filesRef: MutableRefObject<TFilelist>
  resizeFileTree: (width:number) => void
  options: editor.IStandaloneEditorConstructionOptions
  createOrUpdateModel: (path: string, value: string) => void
  onPathChangeRef: MutableRefObject<((key: string) => void) | undefined>
  editorRef:MutableRefObject<editor.IStandaloneCodeEditor | null>
  setTheme: (name: string, themeObj?: TEditorTheme | undefined) => Promise<void>
}

export const useEditorSetup = (props:TUseEditorSetup) => {

  const {
    ref,
    config,
    curPath,
    options,
    filesRef,
    setTheme,
    editorRef,
    curPathRef,
    resizeFileTree,
    onPathChangeRef,
    createOrUpdateModel,
  } = props

    useEffect(() => {
      Object.keys(filesRef.current).forEach(key => {
        const value = filesRef.current[key]
        typeof value === 'string'
          && createOrUpdateModel(key, value)
      })
    }, [])

  useEffect(() => {
    if (editorRef.current) {
      if(config.theme) setTheme(config.theme.name, config.theme.theme)
      editorRef.current.updateOptions(options)
    }
  }, [options, config])

  useEffect(() => {
    if (onPathChangeRef.current && curPath) {
      onPathChangeRef.current(curPath)
    }
    curPathRef.current = curPath
  }, [curPath])

  useImperativeHandle(ref, () => ({
    setTheme,
    resizeFileTree,
    getSupportThemes: () => THEMES,

    getAllValue: () => filesRef.current,
    getValue: (path: string) => filesRef.current[path],
  }))

}