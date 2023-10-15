import type { TLinter } from './useLintWorker'
import type { TTypes } from './useTypesWorker'
import type { Dispatch, MutableRefObject } from 'react'
import type { editor, IDisposable } from 'monaco-editor'
import type {
  TFilelist,
  TCodeEditorRef,
  TDecorationFns,
  TEditorOpenFiles,
} from '../../types'

import { useCallback } from 'react'
import { isStr } from '@keg-hub/jsutils'
import { getModelFromPath } from '../../utils/editor/getModelFromPath'

export type TUseRestoreModel = {
  editorRef: TCodeEditorRef
  decoration: TDecorationFns
  curValueRef: MutableRefObject<string>
  filesRef: MutableRefObject<TFilelist>
  openedPathRef: MutableRefObject<string | null>
  lintWorkerRef: MutableRefObject<TLinter>
  typesWorkerRef: MutableRefObject<TTypes>
  editorStatesRef:MutableRefObject<Map<any, any>>
  contentListenerRef: MutableRefObject<IDisposable | undefined>
  setOpenedFiles: Dispatch<React.SetStateAction<TEditorOpenFiles>>
  onValueChangeRef: MutableRefObject<((loc: string) => void) | undefined>
  onLoadFileRef:MutableRefObject<((loc: string) => Promise<string|null>) | undefined>
  onFileChangeRef: MutableRefObject<((key: string, content: string) => void) | undefined>
}

const updateLinter = (
  loc:string,
  model:editor.ITextModel,
  lintWorkerRef?:MutableRefObject<TLinter>,
) => {
  lintWorkerRef?.current?.postMessage({
    path: loc,
    code: model.getValue(),
    version: model.getVersionId(),
  })

}

const resetTimer = (
  timer:any,
  loc:string,
  model:editor.ITextModel,
  lintWorkerRef?:MutableRefObject<TLinter>
) => {
  if (timer) clearTimeout(timer)
  timer = setTimeout(() => {
    timer = null
    updateLinter(loc, model, lintWorkerRef)
  }, 500)
}


const restoreContentListener = (
  loc:string,
  model:editor.ITextModel,
  props:TUseRestoreModel
) => {

  const {
    filesRef,
    decoration,
    curValueRef,
    lintWorkerRef,
    setOpenedFiles,
    onFileChangeRef,
    contentListenerRef,
    onValueChangeRef,
  } = props

  let timer: any = null

  // On change listener, that updates the content of the active model
  contentListenerRef.current = model.onDidChangeContent(() => {
    const content = model.getValue()

    setOpenedFiles(openedFiles => {
      return openedFiles.map(file => {
        if (file.path === loc && filesRef.current[loc] !== content)
          file.status = `editing`

        return file
      })
    })

    // Clear any run / test decorations if they exist on file change
    decoration.clear(loc)

    onFileChangeRef.current
      && onFileChangeRef.current(loc, content)

    curValueRef.current = content

    onValueChangeRef.current
      && onValueChangeRef.current(content)
    
    resetTimer(timer, loc, model, lintWorkerRef)

  })
}

const locationRestore = (
  loc:string,
  model:editor.ITextModel,
  props:TUseRestoreModel
) => {

  const { editorRef, editorStatesRef } = props
  const editorStates = editorStatesRef.current
  const editorState = editorStates.get(loc)
  if (editorState) editorRef.current?.restoreViewState(editorState)

  editorRef.current?.focus()

  restoreContentListener(loc, model, props)
}

const loadFileContent = async (
  loc:string,
  model:editor.ITextModel,
  props:TUseRestoreModel
) => {

  const {
    filesRef,
    onLoadFileRef
  } = props

  const content = await onLoadFileRef?.current?.(loc)
  if(!isStr(content)) return

  filesRef.current[loc] = content as string || null
  content && model.setValue(content)
}


const modelRestore = (
  loc:string,
  model:editor.ITextModel,
  props:TUseRestoreModel
) => {
  const {
    openedPathRef,
    filesRef,
    editorRef,
    lintWorkerRef,
  } = props
  
  const content = filesRef.current[loc]
  if(content === null) loadFileContent(loc, model, props)

  editorRef?.current?.setModel(model)

  loc !== openedPathRef.current
    && locationRestore(loc, model, props)

  updateLinter(loc, model, lintWorkerRef)

  openedPathRef.current = loc
  return model
}

export const useRestoreModel = (props:TUseRestoreModel) => {
  const {
    editorRef,
    openedPathRef,
    editorStatesRef,
    contentListenerRef,
  } = props

  return useCallback((loc: string) => {
    const editorStates = editorStatesRef.current
    const model = getModelFromPath(loc)

    if (loc !== openedPathRef.current && openedPathRef.current)
      editorStates.set(openedPathRef.current, editorRef.current?.saveViewState())

    if (contentListenerRef.current && contentListenerRef.current.dispose)
      contentListenerRef.current.dispose()

    return model && editorRef.current
      ? modelRestore(loc, model, props)
      : false

  }, [])
}