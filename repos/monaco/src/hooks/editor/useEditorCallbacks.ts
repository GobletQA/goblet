import type { TLinter } from './useLintWorker'
import type { TTypes } from './useTypesWorker'
import type { editor, IDisposable } from 'monaco-editor'
import type { TEditorOpenFiles, TFilelist } from '../../types'
import type { SetStateAction, RefObject, Dispatch, MutableRefObject } from 'react'

import { useCallback, useState } from 'react'
import { useOpenOrFocus } from './useOpenOrFocus'
import { useRestoreModel } from './useRestoreModel'

export type TUseFileCallbacks = {
  defaultPath: string | undefined
  filesRef: MutableRefObject<TFilelist>
  curValueRef: MutableRefObject<string>
  editorNodeRef: RefObject<HTMLDivElement>
  prePath: MutableRefObject<string | null>
  typesWorkerRef: MutableRefObject<TTypes>
  lintWorkerRef: MutableRefObject<TLinter>
  editorStatesRef:MutableRefObject<Map<any, any>>
  setCurPath: (data: SetStateAction<string>) => void
  contentListenerRef: MutableRefObject<IDisposable | undefined>
  editorRef: MutableRefObject<editor.IStandaloneCodeEditor | null>
  onValueChangeRef: MutableRefObject<((v: string) => void) | undefined>
  onLoadFileRef:MutableRefObject<((path: string) => Promise<string|null>) | undefined>
  optionsRef: MutableRefObject<editor.IStandaloneEditorConstructionOptions>
  onFileChangeRef: MutableRefObject<((key: string, content: string) => void) | undefined>
}

export const useEditorCallbacks = (props:TUseFileCallbacks) => {

  const {
    prePath,
    filesRef,
    editorRef,
    optionsRef,
    setCurPath,
    curValueRef,
    defaultPath,
    onLoadFileRef,
    lintWorkerRef,
    typesWorkerRef,
    editorNodeRef,
    onFileChangeRef,
    editorStatesRef,
    contentListenerRef,
    onValueChangeRef,
  } = props


  const [openedFiles, setOpenedFiles] = useState<TEditorOpenFiles>(
    defaultPath ? [{ path: defaultPath }] : []
  )

  const restoreModel = useRestoreModel({
    prePath,
    filesRef,
    editorRef,
    curValueRef,
    onLoadFileRef,
    lintWorkerRef,
    typesWorkerRef,
    setOpenedFiles,
    onFileChangeRef,
    editorStatesRef,
    contentListenerRef,
    onValueChangeRef,
  })

  const openOrFocusPath = useOpenOrFocus({
    editorRef,
    setCurPath,
    optionsRef,
    editorNodeRef,
    setOpenedFiles,
  })

  const pathChange = useCallback(
    (path: string) => {
      const model = restoreModel(path)
      model && openOrFocusPath(path)
    },
    [restoreModel, openOrFocusPath]
  )

  return {
    pathChange,
    openedFiles,
    restoreModel,
    setOpenedFiles,
    openOrFocusPath,
  }
}