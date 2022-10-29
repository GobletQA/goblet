import type { TLinter } from './useLintWorker'
import type { TTypes } from './useTypesWorker'
import type { Dispatch, MutableRefObject } from 'react'
import type { editor, IDisposable } from 'monaco-editor'
import type { TEditorOpenFiles, TFilelist } from '../../types'

import { useCallback } from 'react'
import { isStr } from '@keg-hub/jsutils'
import { getModelFromPath } from '../../utils/editor/getModelFromPath'

export type TUseRestoreModel = {
  curValueRef: MutableRefObject<string>
  filesRef: MutableRefObject<TFilelist>
  prePath: MutableRefObject<string | null>
  lintWorkerRef: MutableRefObject<TLinter>
  typesWorkerRef: MutableRefObject<TTypes>
  editorStatesRef:MutableRefObject<Map<any, any>>
  contentListenerRef: MutableRefObject<IDisposable | undefined>
  editorRef: MutableRefObject<editor.IStandaloneCodeEditor | null>
  setOpenedFiles: Dispatch<React.SetStateAction<TEditorOpenFiles>>
  onLoadFileRef:MutableRefObject<((path: string) => Promise<string|null>) | undefined>
  onValueChangeRef: MutableRefObject<((path: string) => void) | undefined>
  onFileChangeRef: MutableRefObject<((key: string, content: string) => void) | undefined>
}

const updateLinter = (
  path:string,
  model:editor.ITextModel,
  lintWorkerRef?:MutableRefObject<TLinter>,
) => {
  lintWorkerRef?.current?.postMessage({
    code: model.getValue(),
    version: model.getVersionId(),
    path,
  })

}

const resetTimer = (
  timer:any,
  path:string,
  model:editor.ITextModel,
  lintWorkerRef?:MutableRefObject<TLinter>
) => {
  if (timer) clearTimeout(timer)
  timer = setTimeout(() => {
    timer = null
    updateLinter(path, model, lintWorkerRef)
  }, 500)
}


const restoreContentListener = (
  path:string,
  model:editor.ITextModel,
  props:TUseRestoreModel
) => {

  const {
    curValueRef,
    lintWorkerRef,
    setOpenedFiles,
    onFileChangeRef,
    contentListenerRef,
    onValueChangeRef,
  } = props

  let timer: any = null
  contentListenerRef.current = model.onDidChangeContent(() => {

    const content = model.getValue()
    setOpenedFiles(pre =>
      pre.map(loc => {
        if (loc.path === path) loc.status = 'editing'
        return loc
      })
    )
  
    // filesRef.current[path] = content;
    onFileChangeRef.current
      && onFileChangeRef.current(path, content)

    curValueRef.current = content

    onValueChangeRef.current
      && onValueChangeRef.current(content)
    
    resetTimer(timer, path, model, lintWorkerRef)

  })
}

const pathRestore = (
  path:string,
  model:editor.ITextModel,
  props:TUseRestoreModel
) => {

  const { editorRef, editorStatesRef } = props
  const editorStates = editorStatesRef.current
  const editorState = editorStates.get(path)
  if (editorState) editorRef.current?.restoreViewState(editorState)

  editorRef.current?.focus()

  restoreContentListener(path, model, props)
}

const loadFileContent = async (
  path:string,
  model:editor.ITextModel,
  props:TUseRestoreModel
) => {

  const {
    filesRef,
    onLoadFileRef
  } = props

  const content = await onLoadFileRef?.current?.(path)
  if(!isStr(content)) return

  filesRef.current[path] = content
  content && model.setValue(content)
}


const modelRestore = (
  path:string,
  model:editor.ITextModel,
  props:TUseRestoreModel
) => {
  const {
    prePath,
    filesRef,
    editorRef,
    lintWorkerRef,
  } = props

  const content = filesRef.current[path]
  if(content === null) loadFileContent(path, model, props)

  editorRef?.current?.setModel(model)

  path !== prePath.current
    && pathRestore(path, model, props)

  updateLinter(path, model, lintWorkerRef)

  prePath.current = path
  return model
}

export const useRestoreModel = (props:TUseRestoreModel) => {
  const {
    prePath,
    editorRef,
    editorStatesRef,
    contentListenerRef,
  } = props

  return useCallback((path: string) => {
    const editorStates = editorStatesRef.current
    const model = getModelFromPath(path)

    if (path !== prePath.current && prePath.current)
      editorStates.set(prePath.current, editorRef.current?.saveViewState())

    if (contentListenerRef.current && contentListenerRef.current.dispose)
      contentListenerRef.current.dispose()

    return model && editorRef.current
      ? modelRestore(path, model, props)
      : false

  }, [])
}