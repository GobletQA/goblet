import type { ForwardedRef, MutableRefObject } from 'react'
import type {
  TMonaco,
  TAutoSave,
  TFilelist,
  TEditorOpts,
  TPathChange,
  TEditorTheme,
  IMultiRefType,
  TEditorConfig,
  TDecorationFns,
  TCodeEditorRef,
  TOnEditorLoaded,
  TEditorFileCBRef,
  TEditorOpenFiles,
} from '@GBM/types'

import { useEffect } from 'react'
import { useEditorFocus } from '@GBM/hooks/editor/useEditorFocus'
import { useEditorFiles } from '@GBM/hooks/editor/useEditorFiles'
import { useExposeEditor } from '@GBM/hooks/editor/useExposeEditor'
import { GetActiveFileEvent, useOnEvent } from '@gobletqa/components'

export type TUseEditorSetup = {
  curPath: string
  autoSave: TAutoSave
  saveFile: () => void
  options: TEditorOpts
  config: TEditorConfig
  pathChange:TPathChange
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

  useEditorFocus({
    curPath,
    options,
    filesRef,
    autoSave,
    saveFile,
    editorRef,
    closeFile,
    openedFiles,
    onEditorBlurRef,
    onEditorFocusRef,
  })

  useEditorFiles({
    filesRef,
    editorRef,
    pathChange,
    openedFiles,
    onEditorLoaded,
  })

  useExposeEditor({
    ref,
    filesRef,
    setTheme,
    closeFile,
    pathChange,
    decoration,
    resizeSidebar,
  })

  useEffect(() => {
    if(!editorRef.current) return

    config.theme
      && setTheme(config.theme.name, config.theme.theme, window.monaco)
    editorRef.current.updateOptions(options)

  }, [options, config])

  /**
   * Helper to allow external code ask the content of the current file
   * Used for accessing the active file outside of editor
   */
  useOnEvent(GetActiveFileEvent, ({ cb }) => cb?.({
    location: curPath,
    content: filesRef.current[curPath],
  }))

}