import type { TTypes } from './useTypesWorker'
import type { IDisposable } from 'monaco-editor'
import type { SetStateAction, RefObject, MutableRefObject } from 'react'
import type {
  TFilelist,
  TEditorOpts,
  TPathChange,
  TCodeEditorRef,
  TEditorFileCBRef,
  TEditorPathCBRef,
  TEditorOpenFiles,
} from '../../types'

import { useState, useCallback } from 'react'
import { useDecorations } from './useDecorations'
import { useOpenOrFocus } from './useOpenOrFocus'
import { useRestoreModel } from './useRestoreModel'
import { emptyObj } from '@keg-hub/jsutils/emptyObj'
import { getContentFromPath } from '@GBM/utils/editor/getContentFromPath'

export type TUseFileCallbacks = {
  curPath:string
  openedPaths?:string[]
  editorRef:TCodeEditorRef
  onFileChangeRef: TEditorFileCBRef
  onPathChangeRef: TEditorPathCBRef
  filesRef: MutableRefObject<TFilelist>
  curValueRef: MutableRefObject<string>
  editorNodeRef: RefObject<HTMLDivElement>
  typesWorkerRef: MutableRefObject<TTypes>
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
    openedPaths,
    openedPathRef,
    onLoadFileRef,
    typesWorkerRef,
    editorNodeRef,
    onPathChangeRef,
    onFileChangeRef,
    editorStatesRef,
    contentListenerRef,
    onValueChangeRef,
  } = props

  const [openedFiles, setOpenedFiles] = useState<TEditorOpenFiles>(
    openedPaths?.length ? openedPaths.map(loc => ({ path: loc, editor: { readOnly: false } })) : []
  )

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
    typesWorkerRef,
    setOpenedFiles,
    onFileChangeRef,
    editorStatesRef,
    onValueChangeRef,
    contentListenerRef,
  })

  const openOrFocusPath = useOpenOrFocus({
    editorRef,
    setCurPath,
    optionsRef,
    editorNodeRef,
    setOpenedFiles,
  })


  const pathChange = useCallback<TPathChange>((loc, opts=emptyObj) => {
    const model = restoreModel(loc)
    if(model)
      opts?.openLoc !== false
        ? openOrFocusPath(loc, opts)
        : setCurPath(loc)

    const editorOpts = opts?.editor || openedFiles.find(file => file.path === loc)?.editor
    editorOpts && editorRef.current?.updateOptions(editorOpts)

    const content = getContentFromPath(loc) || filesRef.current[loc]
    onPathChangeRef.current?.(loc, content, opts)
  }, [
    setCurPath,
    openedFiles,
    restoreModel,
    openOrFocusPath
  ])

  return {
    decoration,
    pathChange,
    openedFiles,
    restoreModel,
    setOpenedFiles,
    openOrFocusPath,
  }
}