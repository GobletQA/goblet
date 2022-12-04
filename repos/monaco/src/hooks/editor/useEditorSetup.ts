import type { ForwardedRef, MutableRefObject } from 'react'
import type { editor } from 'monaco-editor'
import type {
  TAutoSave,
  TFilelist,
  TEditorTheme,
  IMultiRefType,
  TEditorConfig,
  TOnEditorLoaded,
  TEditorFileCBRef
} from '../../types'

import { THEMES } from '../../constants'
import { useRef, useCallback, useEffect, useImperativeHandle } from 'react'
import { createOrUpdateModel } from '../../utils/editor/createOrUpdateModel'

export type TUseEditorSetup = {
  curPath: string
  autoSave: TAutoSave
  saveFile: () => void
  config: TEditorConfig
  onEditorLoaded?:TOnEditorLoaded
  ref: ForwardedRef<IMultiRefType>
  onEditorBlurRef: TEditorFileCBRef
  onEditorFocusRef: TEditorFileCBRef
  curPathRef: MutableRefObject<string>
  curValueRef: MutableRefObject<string>
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
    autoSave,
    saveFile,
    setTheme,
    editorRef,
    curPathRef,
    curValueRef,
    resizeSidebar,
    onEditorLoaded,
    onPathChangeRef,
    onEditorBlurRef,
    onEditorFocusRef,
  } = props

    const lastSavedRef = useRef<string>()
    const onEditorFocus = useCallback(() => {
      onEditorFocusRef.current?.(curPathRef.current, curValueRef.current)
    }, [])

    const onEditorBlur = useCallback(() => {
      if(autoSave === `blur` && lastSavedRef.current !== curValueRef.current){
        lastSavedRef.current = curValueRef.current
        saveFile()
      }

      onEditorBlurRef?.current?.(curPathRef.current, curValueRef.current)
    }, [autoSave, saveFile])

  // Sets up callbacks for focus and blur of the editor
  useEffect(() => {
    if(!editorRef.current) return

    const focusDispose = editorRef.current.onDidFocusEditorText(onEditorFocus)
    const blurDispose = editorRef.current.onDidBlurEditorText(onEditorBlur)

    return () => {
      focusDispose?.dispose?.()
      blurDispose?.dispose?.()
    }

  }, [onEditorFocus, onEditorBlur])

    // Hook that runs on load of the editor component
    // Creates monaco models for each of the defaultFiles
    // that get set to the filesRef in the editor component
    // Finally calls the onEditorLoaded callback if it exists
    useEffect(() => {
      Object.keys(filesRef.current).forEach(key => {
        const content = filesRef.current[key]
        typeof content === 'string' || content === null
          && createOrUpdateModel(key, content)
      })

      editorRef.current
        && onEditorLoaded?.(editorRef.current as editor.IStandaloneCodeEditor, window.monaco)
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