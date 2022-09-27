import type { TLinter } from './useLintWorker'
import type { TEditorOpenFiles } from '../../types'
import type { SetStateAction, RefObject, Dispatch, MutableRefObject } from 'react'

import { useCallback, useState } from 'react'
import * as TMonacoType from 'monaco-editor'
import { useOpenOrFocus } from './useOpenOrFocus'
import { useRestoreModel } from './useRestoreModel'

export type TUseFileCallbacks = {
  defaultPath: string | undefined
  editorNodeRef: RefObject<HTMLDivElement>
  setCurPath: (value: SetStateAction<string>) => void
  curValueRef: MutableRefObject<string>
  prePath: MutableRefObject<string | null>
  lintWorkerRef: MutableRefObject<TLinter>
  editorStatesRef:MutableRefObject<Map<any, any>>
  onValueChangeRef: MutableRefObject<((v: string) => void) | undefined>
  valueListenerRef: MutableRefObject<TMonacoType.IDisposable | undefined>
  editorRef: MutableRefObject<TMonacoType.editor.IStandaloneCodeEditor | null>
  optionsRef: MutableRefObject<TMonacoType.editor.IStandaloneEditorConstructionOptions>
  onFileChangeRef: MutableRefObject<((key: string, value: string) => void) | undefined>
}

export const useEditorCallbacks = (props:TUseFileCallbacks) => {

  const {
    prePath,
    editorRef,
    optionsRef,
    setCurPath,
    curValueRef,
    defaultPath,
    lintWorkerRef,
    editorNodeRef,
    onFileChangeRef,
    editorStatesRef,
    valueListenerRef,
    onValueChangeRef,
  } = props


  const [openedFiles, setOpenedFiles] = useState<TEditorOpenFiles>(
    defaultPath ? [{ path: defaultPath }] : []
  )

  const restoreModel = useRestoreModel({
    prePath,
    editorRef,
    curValueRef,
    lintWorkerRef,
    setOpenedFiles,
    onFileChangeRef,
    editorStatesRef,
    valueListenerRef,
    onValueChangeRef,
  })

  const openOrFocusPath = useOpenOrFocus({
    editorRef,
    setCurPath,
    optionsRef,
    editorNodeRef,
    setOpenedFiles,
  })

  const handlePathChange = useCallback(
    (path: string) => {
      const model = restoreModel(path)
      model && openOrFocusPath(path)
    },
    [restoreModel, openOrFocusPath]
  )

  return {
    openedFiles,
    restoreModel,
    setOpenedFiles,
    openOrFocusPath,
    handlePathChange
  }
}