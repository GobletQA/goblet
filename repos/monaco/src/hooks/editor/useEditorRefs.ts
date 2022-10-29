import type { editor, IDisposable } from 'monaco-editor'
import type {
  TFilelist,
  TEditorCB,
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

  const rootRef = useRef(null)
  const filesRef = useRef(defaultFiles)
  const editorStatesRef = useRef(new Map())
  const contentListenerRef = useRef<IDisposable>()
  const editorNodeRef = useRef<HTMLDivElement>(null)
  const prePath = useRef<string | null>(defaultPath || '')
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null)

  return {
    rootRef,
    prePath,
    filesRef,
    editorRef,
    optionsRef,
    editorNodeRef,
    onLoadFileRef,
    onPathChangeRef,
    editorStatesRef,
    onFileChangeRef,
    onValueChangeRef,
    contentListenerRef,
  }
}