import type { ForwardedRef, MutableRefObject } from 'react'
import type {
  TMonaco,
  TAutoSave,
  TFilelist,
  TEditorOpts,
  TCodeEditor,
  TEditorTheme,
  IMultiRefType,
  TEditorConfig,
  TDecorationFns,
  TCodeEditorRef,
  TOnEditorLoaded,
  TEditorRefHandle,
  TEditorFileCBRef,
  TEditorOpenFiles,
} from '@GBM/types'

import { THEMES } from '@GBM/constants'
import { isStr } from '@keg-hub/jsutils/isStr'
import { useCallback, useEffect, useImperativeHandle } from 'react'
import { GetActiveFileEvent, useOnEvent } from '@gobletqa/components'
import { getContentFromPath } from '@GBM/utils/editor/getContentFromPath'
import { createOrUpdateModel } from '@GBM/utils/editor/createOrUpdateModel'

export type TUseEditorSetup = {
  curPath: string
  autoSave: TAutoSave
  saveFile: () => void
  options: TEditorOpts
  config: TEditorConfig
  editorRef:TCodeEditorRef
  decoration: TDecorationFns
  openedFiles: TEditorOpenFiles
  onEditorLoaded?:TOnEditorLoaded
  ref: ForwardedRef<IMultiRefType>
  closeFile:(path: string) => void
  onEditorBlurRef: TEditorFileCBRef
  onEditorFocusRef: TEditorFileCBRef
  filesRef: MutableRefObject<TFilelist>
  resizeSidebar: (width:number) => void
  pathChange:(key: string, content?:string) => void
  setTheme: (name: string, themeObj?: TEditorTheme | undefined, monaco?:TMonaco) => Promise<void>
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
    pathChange,
    decoration,
    openedFiles,
    resizeSidebar,
    onEditorLoaded,
    onEditorBlurRef,
    onEditorFocusRef,
  } = props

  const onEditorFocus = useCallback(() => {
    const content = getContentFromPath(curPath) || filesRef.current[curPath]
    onEditorFocusRef.current?.(curPath, content)
  }, [curPath])

  const onEditorBlur = useCallback(() => {
    const content = getContentFromPath(curPath) || filesRef.current[curPath]
    if(!content) return

    const file = openedFiles.find(file => file.path === curPath)
    const isEditing = file?.status === `editing`

    // Check if save on blur and the file was changed
    if(autoSave === `blur` && isEditing) saveFile()

    // TODO: find way to know if the event that called this was an action within the editor
    // If a close file action is called for a diff file that is also open
    // Then this event is called as well
    // see onCloseTab in useOnTabClose hook

    // Check if we should auto close the file when not edited
    if(options.openMode === `preview` && file && file?.mode !== `keep`){
      if(!isEditing) closeFile(curPath)
      else file.mode = `keep`
    }

    // Call passed in callbacks
    onEditorBlurRef?.current?.(curPath, content)

  }, [
    curPath,
    autoSave,
    saveFile,
    closeFile,
    openedFiles,
    options.openMode,
  ])

  // Function exposed to the host application
  // Allows opening files externally to the editor
  const openFile = useCallback((path:string, content?:string) => {
    if(isStr(content)){
      createOrUpdateModel(path, content)
      filesRef.current[path] = content
    }

    pathChange(path)
  }, [])

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

      ;(typeof content === 'string' || content === null)
        && createOrUpdateModel(key, content)
    })

    editorRef.current
      && onEditorLoaded?.(editorRef.current as TCodeEditor, window.monaco)
  }, [])

  useEffect(() => {
    if (editorRef.current) {
      config.theme
        && setTheme(config.theme.name, config.theme.theme, window.monaco)

      editorRef.current.updateOptions(options)
    }
  }, [options, config])

  // Helper to allow external code ask the content of the current file
  // Used for accessing the active file outside of editor
  useOnEvent(GetActiveFileEvent, ({ cb }) => cb?.({
    location: curPath,
    content: filesRef.current[curPath],
  }))

  useImperativeHandle(ref, () => ({
    openFile,
    setTheme,
    closeFile,
    decoration,
    resizeSidebar,
    getSupportThemes: () => THEMES,
    getAllValue: () => filesRef.current,
    getValue: (path: string) => filesRef.current[path],
  } as TEditorRefHandle))

}