import type { ForwardedRef, MutableRefObject } from 'react'
import type { editor } from 'monaco-editor'
import type {
  TAutoSave,
  TFilelist,
  TEditorOpts,
  TCodeEditor,
  TEditorTheme,
  IMultiRefType,
  TEditorConfig,
  TCodeEditorRef,
  TOnEditorLoaded,
  TEditorFileCBRef,
  TEditorOpenFiles,
} from '../../types'

import { THEMES } from '../../constants'
import { useRef, useCallback, useEffect, useImperativeHandle } from 'react'
import { createOrUpdateModel } from '../../utils/editor/createOrUpdateModel'

export type TUseEditorSetup = {
  curPath: string
  autoSave: TAutoSave
  saveFile: () => void
  options: TEditorOpts
  config: TEditorConfig
  editorRef:TCodeEditorRef
  openedFiles: TEditorOpenFiles
  onEditorLoaded?:TOnEditorLoaded
  ref: ForwardedRef<IMultiRefType>
  closeFile:(path: string) => void
  onEditorBlurRef: TEditorFileCBRef
  onEditorFocusRef: TEditorFileCBRef
  curPathRef: MutableRefObject<string>
  curValueRef: MutableRefObject<string>
  filesRef: MutableRefObject<TFilelist>
  resizeSidebar: (width:number) => void
  onPathChangeRef: MutableRefObject<((key: string) => void) | undefined>
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
    closeFile,
    curPathRef,
    openedFiles,
    curValueRef,
    resizeSidebar,
    onEditorLoaded,
    onPathChangeRef,
    onEditorBlurRef,
    onEditorFocusRef,
  } = props

    const onEditorFocus = useCallback(() => {
      onEditorFocusRef.current?.(curPathRef.current, curValueRef.current)
    }, [])

    const onEditorBlur = useCallback(() => {
      if(!curValueRef.current) return

      const file = openedFiles.find(file => file.path === curPathRef.current)
      const isEditing = file?.status === `editing`

      // Check if save on blur and the file was changed
      if(autoSave === `blur` && isEditing){
        saveFile()
      }

      // TODO: find way to know if the event that called this was an action within the editor
      // If a close file action is called for a diff file that is also open
      // Then this event is called as well
      // see onCloseTab in useOnTabClose hook

      // Check if we should auto close the file when not edited
      if(options.openMode === `preview` && file && file?.mode !== `keep`){
        if(!isEditing) closeFile(curPathRef.current)
        else file.mode = `keep`
      }

      // Call passed in callbacks
      onEditorBlurRef?.current?.(curPathRef.current, curValueRef.current)

    }, [
      autoSave,
      saveFile,
      closeFile,
      openedFiles,
      options.openMode,
    ])

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
        && onEditorLoaded?.(editorRef.current as TCodeEditor, window.monaco)
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