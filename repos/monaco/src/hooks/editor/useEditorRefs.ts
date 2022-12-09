import type { IDisposable } from 'monaco-editor'
import type {
  TFilelist,
  TEditorCB,
  TCodeEditor,
  TEditorOpts,
  TEditorFileCB,
  TEditorPromiseCB,
} from '../../types'

import { useRef } from 'react'

export type THEditorRefs = {
  options: TEditorOpts
  defaultPath?: string
  defaultFiles: TFilelist
  onPathChange?: TEditorCB
  onValueChange?: TEditorCB
  onEditorBlur?: TEditorFileCB
  onEditorFocus?: TEditorFileCB
  onFileChange?: TEditorFileCB
  onLoadFile?: TEditorPromiseCB
  onFileTreeResize?: (width:number) => void
}

export const useEditorRefs = (props:THEditorRefs) => {
  const {
    options,
    onLoadFile,
    defaultPath,
    defaultFiles,
    onPathChange,
    onFileChange,
    onValueChange,
    onEditorBlur,
    onEditorFocus,
  } = props

  const optionsRef = useRef(options)
  optionsRef.current = options

  const onLoadFileRef = useRef(onLoadFile)
  onLoadFileRef.current = onLoadFile

  const onPathChangeRef = useRef(onPathChange)
  onPathChangeRef.current = onPathChange

  const onFileChangeRef = useRef(onFileChange)
  onFileChangeRef.current = onFileChange

  const onValueChangeRef = useRef(onValueChange)
  onValueChangeRef.current = onValueChange

  const onEditorFocusRef = useRef(onEditorFocus)
  onEditorFocusRef.current = onEditorFocus

  const onEditorBlurRef = useRef(onEditorBlur)
  onEditorBlurRef.current = onEditorBlur

  const rootRef = useRef(null)
  const filesRef = useRef(defaultFiles)
  const editorStatesRef = useRef(new Map())
  const editorRef = useRef<TCodeEditor>(null)
  const contentListenerRef = useRef<IDisposable>()
  const editorNodeRef = useRef<HTMLDivElement>(null)
  const openedPathRef = useRef<string | null>(defaultPath || '')

  return {
    rootRef,
    filesRef,
    editorRef,
    optionsRef,
    openedPathRef,
    editorNodeRef,
    onLoadFileRef,
    onPathChangeRef,
    editorStatesRef,
    onFileChangeRef,
    onEditorBlurRef,
    onEditorFocusRef,
    onValueChangeRef,
    contentListenerRef,
    autoSave: optionsRef?.current?.autoSave ?? `off`,
  }
}