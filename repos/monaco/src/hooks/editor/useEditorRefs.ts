import type { MutableRefObject } from 'react'
import type { IDisposable } from 'monaco-editor'
import type {
  TFilelist,
  TEditorCB,
  TCodeEditor,
  TEditorOpts,
  TEditorFileCB,
  TEditorPromiseCB,
} from '../../types'

import { useRef, useEffect } from 'react'
import { useLintWorker } from '@GBM/hooks/editor/useLintWorker'
import { useTypesWorker } from '@GBM/hooks/editor/useTypesWorker'

export type THEditorRefs = {
  curPath:string
  options: TEditorOpts
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
    curPath,
    options,
    onLoadFile,
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
  const editorRef = useRef<TCodeEditor>()
  const contentListenerRef = useRef<IDisposable>()
  const editorNodeRef = useRef<HTMLDivElement>(null)
  const [lintWorkerRef] = useLintWorker({ editorRef })
  const [typesWorkerRef] = useTypesWorker({ editorRef })

  // TODO: investigate removing this, pretty sure it's not needed
  // Or at least can be handled differently
  const openedPathRef = useRef<string | null>('')

  useEffect(() => {
    onPathChangeRef.current
      && curPath
      && onPathChangeRef.current(curPath)
  }, [curPath])

  return {
    rootRef,
    filesRef,
    editorRef,
    optionsRef,
    openedPathRef,
    editorNodeRef,
    onLoadFileRef,
    lintWorkerRef,
    typesWorkerRef,
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