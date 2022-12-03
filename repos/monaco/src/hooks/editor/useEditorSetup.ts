import type { ForwardedRef, MutableRefObject } from 'react'
import type { editor } from 'monaco-editor'
import type {
  TFilelist,
  TEditorTheme,
  IMultiRefType,
  TEditorConfig,
  TOnEditorLoaded
} from '../../types'

import { THEMES } from '../../constants'
import { useEffect, useImperativeHandle } from 'react'
import { createOrUpdateModel } from '../../utils/editor/createOrUpdateModel'

export type TUseEditorSetup = {
  curPath: string
  config: TEditorConfig
  onEditorLoaded?:TOnEditorLoaded
  ref: ForwardedRef<IMultiRefType>
  curPathRef: MutableRefObject<string>
  filesRef: MutableRefObject<TFilelist>
  resizeSidebar: (width:number) => void
  options: editor.IStandaloneEditorConstructionOptions
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
    resizeSidebar,
    onEditorLoaded,
    onPathChangeRef,
  } = props

    // Hook that runs on load of the editor component
    // Creates monaco models for each of the defaultFiles
    // that get set to the filesRef in the editor component
    useEffect(() => {
      Object.keys(filesRef.current).forEach(key => {
        const content = filesRef.current[key]
        typeof content === 'string' || content === null
          && createOrUpdateModel(key, content)
      })

      onEditorLoaded?.(editorRef.current as editor.IStandaloneCodeEditor, window.monaco)
    }, [])

  useEffect(() => {
    if (editorRef.current) {
      if(config.theme) setTheme(config.theme.name, config.theme.theme)
      editorRef.current.updateOptions(options)
    }
  }, [options, config])

  useEffect(() => {
    if (onPathChangeRef.current && curPath) onPathChangeRef.current(curPath)
    curPathRef.current = curPath
  }, [curPath])

  useImperativeHandle(ref, () => ({
    setTheme,
    resizeSidebar,
    getSupportThemes: () => THEMES,
    getAllValue: () => filesRef.current,
    getValue: (path: string) => filesRef.current[path],
  }))

}