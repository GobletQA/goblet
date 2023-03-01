import type { TLinter } from './useLintWorker'
import type { TTypes } from './useTypesWorker'
import type { IDisposable } from 'monaco-editor'
import type { SetStateAction, RefObject, MutableRefObject } from 'react'
import type {
  TFilelist,
  TEditorOpts,
  TCodeEditorRef,
  TEditorFileCBRef,
  TEditorOpenFiles,
} from '../../types'

import { useCallback, useState } from 'react'
import { useDecorations } from './useDecorations'
import { useOpenOrFocus } from './useOpenOrFocus'
import { useRestoreModel } from './useRestoreModel'

export type TUseFileCallbacks = {
  curPath:string
  editorRef: TCodeEditorRef
  onFileChangeRef: TEditorFileCBRef
  filesRef: MutableRefObject<TFilelist>
  curValueRef: MutableRefObject<string>
  editorNodeRef: RefObject<HTMLDivElement>
  typesWorkerRef: MutableRefObject<TTypes>
  lintWorkerRef: MutableRefObject<TLinter>
  optionsRef: MutableRefObject<TEditorOpts>
  openedPathRef: MutableRefObject<string | null>
  editorStatesRef:MutableRefObject<Map<any, any>>
  setCurPath: (data: SetStateAction<string>) => void
  contentListenerRef: MutableRefObject<IDisposable | undefined>
  onValueChangeRef: MutableRefObject<((v: string) => void) | undefined>
  onLoadFileRef:MutableRefObject<((path: string) => Promise<string|null>) | undefined>
}

export const useEditorCallbacks = (props:TUseFileCallbacks) => {

  const {
    curPath,
    filesRef,
    editorRef,
    optionsRef,
    setCurPath,
    curValueRef,
    openedPathRef,
    onLoadFileRef,
    lintWorkerRef,
    typesWorkerRef,
    editorNodeRef,
    onFileChangeRef,
    editorStatesRef,
    contentListenerRef,
    onValueChangeRef,
  } = props


  const [openedFiles, setOpenedFiles] = useState<TEditorOpenFiles>([])

  const decoration = useDecorations({
    curPath,
    editorRef
  })

  const restoreModel = useRestoreModel({
    filesRef,
    editorRef,
    decoration,
    curValueRef,
    openedPathRef,
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
    decoration,
    pathChange,
    openedFiles,
    restoreModel,
    setOpenedFiles,
    openOrFocusPath,
  }
}